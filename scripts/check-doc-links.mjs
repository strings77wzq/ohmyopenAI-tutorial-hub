#!/usr/bin/env node
// Check every first-party link in docs/ resolves to a known page or asset.
// Uses Markdown-aware heuristics (skips fenced code blocks, inline code) to
// avoid false positives that naive regex scanning produces.
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import { walkFiles, posixRelative } from './lib/walker.mjs'
import { reportAndExit, safeReadFile } from './lib/reporter.mjs'

// ---- resolve basePath from VitePress config --------------------------------
const cwd = process.cwd()
const docsRoot = path.join(cwd, 'docs')
const configPath = path.join(docsRoot, '.vitepress', 'config.ts')

function readBasePath() {
  try {
    const src = fs.readFileSync(configPath, 'utf8')
    const m = src.match(/const\s+repoBase\s*=\s*['"]([^'"]+)['"]/)
    if (m) return m[1] // e.g. '/agent-engineering-hub/'
  } catch { /* fall through */ }
  return '/' // sensible default for local dev
}

const basePath = readBasePath()

// ---- collect known routes --------------------------------------------------
const args = process.argv.slice(2)
const distFlagIndex = args.indexOf('--dist')
const distRoot = distFlagIndex >= 0 ? path.resolve(args[distFlagIndex + 1] ?? '') : null

const pageRoutes = new Set()
const assetRoutes = new Set()

function addPageRoute(route) {
  const variants = routeVariants(route)
  for (const v of variants) pageRoutes.add(v)
}

function addAssetRoute(route) {
  assetRoutes.add(route)
  // also register the route without the basePath prefix
  if (route.startsWith(basePath)) assetRoutes.add(route.slice(basePath.length - 1))
}

// Build route set from source files
const errors = []
walkFiles(docsRoot, (file) => {
  const rel = posixRelative(docsRoot, file)
  const ext = path.extname(file)

  if (ext === '.md') {
    addPageRoute(routeFromMarkdown(file))
    return
  }

  if (file.includes(`${path.sep}public${path.sep}`)) {
    addAssetRoute('/' + posixRelative(path.join(docsRoot, 'public'), file))
    return
  }

  if (!rel.startsWith('.vitepress/') && ['.svg', '.png', '.jpg', '.jpeg', '.webp', '.css', '.ico'].includes(ext)) {
    addAssetRoute('/' + rel)
  }
})

// Merge routes from dist if available (catches generated HTML pages)
if (distRoot) {
  walkFiles(distRoot, (file) => {
    const rel = '/' + posixRelative(distRoot, file)
    if (rel.endsWith('.html')) {
      addPageRoute(rel === '/index.html' ? '/' : rel.replace(/\.html$/, ''))
    } else {
      addAssetRoute(rel)
    }
  })
}

// ---- route helpers ---------------------------------------------------------
function routeFromMarkdown(file) {
  const rel = posixRelative(docsRoot, file).replace(/\.md$/, '')
  if (rel === 'index') return '/'
  if (rel.endsWith('/index')) return '/' + rel.slice(0, -'/index'.length)
  return '/' + rel
}

function routeVariants(route) {
  const normalized = normalizeRoute(route)
  const variants = new Set([normalized])
  if (normalized !== '/') {
    variants.add(normalized + '/')
    variants.add(normalized + '.html')
    variants.add(normalized + '/index.html')
  } else {
    variants.add('/index.html')
  }
  return variants
}

function normalizeRoute(route) {
  let value = route
  if (value.startsWith(basePath)) value = '/' + value.slice(basePath.length)
  if (!value.startsWith('/')) value = '/' + value
  value = value.replace(/\/+/g, '/')
  if (value.length > 1) value = value.replace(/\/$/, '')
  if (value.endsWith('/index')) value = value.slice(0, -'/index'.length) || '/'
  return value
}

function routeExists(route) {
  const ext = path.posix.extname(route)
  if (ext && ext !== '.html' && ext !== '.md') {
    return assetRoutes.has(route)
  }
  const asRoute = normalizeRoute(route.replace(/\.md$/, '').replace(/\.html$/, ''))
  return [...routeVariants(asRoute)].some(v => pageRoutes.has(v))
}

// ---- link extraction (Markdown + HTML aware) -------------------------------
function isIgnored(raw) {
  return (
    raw === '' ||
    raw.startsWith('#') ||
    raw.startsWith('http://') ||
    raw.startsWith('https://') ||
    raw.startsWith('mailto:') ||
    raw.startsWith('tel:') ||
    raw.startsWith('data:') ||
    raw.startsWith('javascript:')
  )
}

function stripDecorators(raw) {
  return raw
    .trim()
    .replace(/^<|>$/g, '')
    .split(/\s+/)[0]
    .split('#')[0]
    .split('?')[0]
}

function sourceDirRoute(file) {
  const route = routeFromMarkdown(file)
  const sourceName = path.basename(file)
  if (sourceName === 'index.md') return route
  return route === '/' ? '/' : path.posix.dirname(route)
}

function resolveLink(raw, file) {
  let stripped = stripDecorators(raw)
  // Handle withBase() calls in Vue templates
  const withBaseMatch = stripped.match(/^withBase\(['"`]([^'"`]+)['"`]\)$/)
  if (withBaseMatch) stripped = withBaseMatch[1]
  if (isIgnored(stripped)) return null

  if (stripped.startsWith('/')) return normalizeRoute(stripped)

  const base = file.endsWith('.md') ? sourceDirRoute(file) : '/'
  return normalizeRoute(path.posix.normalize(path.posix.join(base, stripped)))
}

/**
 * Extract link targets from a line of Markdown/HTML.
 * Returns an array of { raw, col } objects.
 */
function extractLinksFromLine(line) {
  const results = []
  // Markdown links: [text](url)
  const mdLinkRe = /\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g
  for (const m of line.matchAll(mdLinkRe)) {
    results.push({ raw: m[2], col: m.index + m[0].indexOf('(') + 1 })
  }
  // HTML href/src attributes (double-quoted)
  const htmlDqRe = /(?:href|src)="([^"]+)"/g
  for (const m of line.matchAll(htmlDqRe)) {
    results.push({ raw: m[1], col: m.index + m[0].indexOf('"') + 1 })
  }
  // HTML href/src attributes (single-quoted)
  const htmlSqRe = /(?:href|src)='([^']+)'/g
  for (const m of line.matchAll(htmlSqRe)) {
    results.push({ raw: m[1], col: m.index + m[0].indexOf("'") + 1 })
  }
  return results
}

// ---- scan source files -----------------------------------------------------
const broken = []
const sourceFiles = []
walkFiles(docsRoot, (file) => {
  const ext = path.extname(file)
  if (['.md', '.ts', '.vue'].includes(ext)) sourceFiles.push(file)
})

for (const file of sourceFiles) {
  const content = safeReadFile(file, errors)
  if (content === null) continue

  const lines = content.split('\n')
  let inFencedBlock = false
  let fenceChar = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNum = i + 1

    // Track fenced code blocks (``` or ~~~)
    const fenceMatch = line.trimStart().match(/^(```|~~~)/)
    if (fenceMatch) {
      const fc = fenceMatch[1]
      if (!inFencedBlock) {
        inFencedBlock = true
        fenceChar = fc
        continue
      } else if (fc === fenceChar) {
        inFencedBlock = false
        fenceChar = ''
        continue
      }
    }

    // Skip links inside fenced code blocks
    if (inFencedBlock) continue

    // Skip inline code spans (naive: skip content between backticks on same line)
    const cleanLine = line.replace(/`[^`]+`/g, '')

    for (const { raw } of extractLinksFromLine(cleanLine)) {
      const route = resolveLink(raw, file)
      if (!route) continue
      if (!routeExists(route)) {
        broken.push({
          file: path.relative(cwd, file),
          line: lineNum,
          route,
        })
      }
    }
  }
}

if (broken.length > 0) {
  errors.push(...broken.map(b => ({
    file: b.file,
    line: b.line,
    message: `broken link → ${b.route}`,
  })))
}

reportAndExit(errors, [], `links (${sourceFiles.length} source files, basePath=${basePath})`)
