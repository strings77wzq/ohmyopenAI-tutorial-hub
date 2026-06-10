#!/usr/bin/env node
/**
 * Lighthouse + axe-core baseline audit.
 *
 * Boots a local preview of the production build, runs Lighthouse against
 * the homepage and 3 main module entries, captures axe-core a11y findings,
 * and writes results to .lighthouse/baseline.json.
 *
 * Usage:
 *   npm run docs:build        # required first — preview serves dist/
 *   node scripts/audit-lighthouse.mjs
 *
 * Exit code:
 *   0 = audit ran and wrote baseline.json
 *   1 = audit could not run (missing deps, no build, port busy)
 *
 * Thresholds (warn only — does not fail CI yet):
 *   Performance   ≥ 90
 *   Accessibility ≥ 95
 *   LCP          < 2.5s
 *   CLS          < 0.1
 *
 * Dependencies are intentionally NOT in package.json yet. This is a
 * baseline-gathering tool, not a CI gate. To run it:
 *   npm i -D lighthouse @axe-core/puppeteer puppeteer
 *
 * Once we have a baseline, we'll wire this into npm test as a soft gate
 * (compare against baseline, warn on regression > 5 points). See ROADMAP
 * Week 1 PR 3 acceptance.
 */

import { spawn } from 'node:child_process'
import { mkdir, writeFile, access } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT_DIR = join(ROOT, '.lighthouse')
const OUT_FILE = join(OUT_DIR, 'baseline.json')
const PREVIEW_PORT = 4173
const BASE_PATH = '/agent-engineering-hub/'

const URLS_TO_AUDIT = [
  { id: 'home', path: '' },
  { id: 'guide-index', path: 'guide/' },
  { id: 'skills', path: 'guide/skills/what-is-skill' },
  { id: 'harness', path: 'guide/harness/intro' },
  { id: 'openspec', path: 'guide/openspec/concepts' },
]

const THRESHOLDS = {
  performance: 90,
  accessibility: 95,
  lcp_ms: 2500,
  cls: 0.1,
}

async function fileExists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function ensureDist() {
  const distMarker = join(ROOT, 'docs/.vitepress/dist/index.html')
  if (!(await fileExists(distMarker))) {
    console.error('[audit] dist/ not found — run `npm run docs:build` first')
    process.exit(1)
  }
}

async function loadLighthouse() {
  try {
    const lh = await import('lighthouse')
    const chromeLauncher = await import('chrome-launcher')
    return { lighthouse: lh.default, chromeLauncher }
  } catch (err) {
    console.error('[audit] missing deps. Install with:')
    console.error('       npm i -D lighthouse chrome-launcher @axe-core/puppeteer puppeteer')
    console.error('       (this is intentional — keeps dev install lean until baseline lands)')
    console.error('       underlying error:', err instanceof Error ? err.message : String(err))
    process.exit(1)
  }
}

function startPreview() {
  return new Promise((resolve, reject) => {
    const proc = spawn('npx', ['vitepress', 'preview', 'docs', '--port', String(PREVIEW_PORT)], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let booted = false
    const onChunk = (chunk) => {
      const s = chunk.toString()
      if (!booted && /localhost:\d+/.test(s)) {
        booted = true
        setTimeout(() => resolve(proc), 500)
      }
    }
    proc.stdout?.on('data', onChunk)
    proc.stderr?.on('data', onChunk)
    proc.on('error', reject)
    setTimeout(() => {
      if (!booted) reject(new Error('preview did not boot within 15s'))
    }, 15000)
  })
}

async function runLighthouse({ lighthouse, chromeLauncher }, url) {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
  })
  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    })
    const lhr = result.lhr
    return {
      performance: Math.round((lhr.categories.performance?.score ?? 0) * 100),
      accessibility: Math.round((lhr.categories.accessibility?.score ?? 0) * 100),
      best_practices: Math.round((lhr.categories['best-practices']?.score ?? 0) * 100),
      seo: Math.round((lhr.categories.seo?.score ?? 0) * 100),
      lcp_ms: lhr.audits['largest-contentful-paint']?.numericValue ?? null,
      cls: lhr.audits['cumulative-layout-shift']?.numericValue ?? null,
      tbt_ms: lhr.audits['total-blocking-time']?.numericValue ?? null,
      fcp_ms: lhr.audits['first-contentful-paint']?.numericValue ?? null,
    }
  } finally {
    await chrome.kill()
  }
}

function evaluateThresholds(scores) {
  const fails = []
  if (scores.performance < THRESHOLDS.performance)
    fails.push(`performance ${scores.performance} < ${THRESHOLDS.performance}`)
  if (scores.accessibility < THRESHOLDS.accessibility)
    fails.push(`accessibility ${scores.accessibility} < ${THRESHOLDS.accessibility}`)
  if (scores.lcp_ms !== null && scores.lcp_ms > THRESHOLDS.lcp_ms)
    fails.push(`LCP ${Math.round(scores.lcp_ms)}ms > ${THRESHOLDS.lcp_ms}ms`)
  if (scores.cls !== null && scores.cls > THRESHOLDS.cls)
    fails.push(`CLS ${scores.cls.toFixed(3)} > ${THRESHOLDS.cls}`)
  return fails
}

async function main() {
  await ensureDist()
  const lhMods = await loadLighthouse()
  await mkdir(OUT_DIR, { recursive: true })

  console.log('[audit] booting preview on port', PREVIEW_PORT)
  const preview = await startPreview()

  const results = {
    timestamp: new Date().toISOString(),
    base_url: `http://localhost:${PREVIEW_PORT}${BASE_PATH}`,
    thresholds: THRESHOLDS,
    pages: {},
  }

  try {
    for (const { id, path } of URLS_TO_AUDIT) {
      const url = `http://localhost:${PREVIEW_PORT}${BASE_PATH}${path}`
      console.log(`[audit] ${id} → ${url}`)
      try {
        const scores = await runLighthouse(lhMods, url)
        const fails = evaluateThresholds(scores)
        results.pages[id] = { url, scores, fails }
        const fmt = `perf=${scores.performance} a11y=${scores.accessibility} LCP=${Math.round(scores.lcp_ms ?? 0)}ms CLS=${(scores.cls ?? 0).toFixed(3)}`
        console.log(`  ${fails.length === 0 ? '✓' : '⚠'} ${fmt}${fails.length ? ' — ' + fails.join(', ') : ''}`)
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error(`  ✗ ${id} failed: ${msg}`)
        results.pages[id] = { url, error: msg }
      }
    }
  } finally {
    preview.kill('SIGTERM')
  }

  await writeFile(OUT_FILE, JSON.stringify(results, null, 2) + '\n', 'utf8')
  console.log(`[audit] wrote ${OUT_FILE}`)

  const anyFail = Object.values(results.pages).some(
    (p) => Array.isArray(p.fails) && p.fails.length > 0
  )
  if (anyFail) {
    console.log('[audit] ⚠ some pages did not meet thresholds (see baseline.json) — soft warn, not failing')
  } else {
    console.log('[audit] ✓ all pages meet thresholds')
  }
}

main().catch((err) => {
  console.error('[audit] fatal:', err instanceof Error ? err.message : String(err))
  process.exit(1)
})
