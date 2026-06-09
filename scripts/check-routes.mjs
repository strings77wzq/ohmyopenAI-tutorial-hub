#!/usr/bin/env node
// Verify every sidebar link resolves to an actual .md file on disk.
import path from 'node:path'
import fs from 'node:fs'

import { reportAndExit } from './lib/reporter.mjs'

const cwd = process.cwd()
const docsRoot = path.join(cwd, 'docs')
const errors = []

// Load the VitePress config dynamically by reading the compiled JS
// Since we can't easily import TypeScript, parse the config text for sidebar links.
const configPath = path.join(docsRoot, '.vitepress', 'config.ts')
const configSrc = fs.readFileSync(configPath, 'utf8')

// Extract all `link: '/path'` entries from sidebar definitions
const linkRe = /link:\s*['"]([^'"]+)['"]/g
const sidebarLinks = []
for (const m of configSrc.matchAll(linkRe)) {
  sidebarLinks.push(m[1])
}

for (const link of sidebarLinks) {
  // Skip external URLs
  if (link.startsWith('http://') || link.startsWith('https://')) continue

  // Convert sidebar link to expected file path
  let filePath
  if (link.endsWith('/')) {
    filePath = path.join(docsRoot, link, 'index.md')
  } else {
    filePath = path.join(docsRoot, link + '.md')
  }

  if (!fs.existsSync(filePath)) {
    // Try with .html extension (some links point to generated pages)
    const htmlPath = path.join(docsRoot, link + '.html')
    const indexPath = path.join(docsRoot, link, 'index.md')
    if (!fs.existsSync(htmlPath) && !fs.existsSync(indexPath)) {
      errors.push({
        file: configPath,
        message: `sidebar links to "${link}" but no file exists at ${path.relative(cwd, filePath)}`,
      })
    }
  }
}

reportAndExit(errors, [], 'sidebar routes')
