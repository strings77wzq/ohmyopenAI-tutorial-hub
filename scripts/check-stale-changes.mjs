#!/usr/bin/env node
// Detect stale OpenSpec changes (>14 days without modification, still in-progress).
import fs from 'node:fs'
import path from 'node:path'

import { reportAndExit } from './lib/reporter.mjs'

const cwd = process.cwd()
const changesDir = path.join(cwd, 'openspec', 'changes')
const errors = []
const warnings = []
const STALE_DAYS = 14

if (!fs.existsSync(changesDir)) {
  console.error('No openspec/changes/ directory found.')
  process.exit(0)
}

const now = Date.now()
const staleThreshold = STALE_DAYS * 24 * 60 * 60 * 1000

for (const entry of fs.readdirSync(changesDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const changeDir = path.join(changesDir, entry.name)
  const yamlPath = path.join(changeDir, '.openspec.yaml')

  if (!fs.existsSync(yamlPath)) {
    warnings.push({
      file: path.relative(cwd, changeDir),
      message: 'no .openspec.yaml — cannot determine status',
    })
    continue
  }

  try {
    const yaml = fs.readFileSync(yamlPath, 'utf8')
    const statusMatch = yaml.match(/^status:\s*(\S+)/m)
    const status = statusMatch ? statusMatch[1] : 'unknown'

    if (status === 'in-progress' || status === 'no-tasks') {
      const stat = fs.statSync(yamlPath)
      const ageDays = Math.round((now - stat.mtimeMs) / (24 * 60 * 60 * 1000))

      if (stat.mtimeMs < now - staleThreshold) {
        errors.push({
          file: path.relative(cwd, changeDir),
          message: `stale change: status="${status}", last modified ${ageDays}d ago (>${STALE_DAYS}d threshold). Archive or resume.`,
        })
      }
    }
  } catch (err) {
    warnings.push({
      file: path.relative(cwd, changeDir),
      message: `cannot read .openspec.yaml: ${err.message}`,
    })
  }
}

if (errors.length === 0 && warnings.length === 0) {
  console.error(`stale changes: all active changes modified within ${STALE_DAYS}d`)
}

reportAndExit(errors, warnings, 'stale changes')
