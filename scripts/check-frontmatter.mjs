#!/usr/bin/env node
// Ensure every .md file in docs/ has a title (frontmatter or # heading).
// Warnings for missing frontmatter only shown with --strict.
import fs from 'node:fs'
import path from 'node:path'

import { walkFiles } from './lib/walker.mjs'
import { reportAndExit } from './lib/reporter.mjs'

const cwd = process.cwd()
const docsRoot = path.join(cwd, 'docs')
const strict = process.argv.includes('--strict')
const errors = []
const warnings = []

walkFiles(docsRoot, (filePath) => {
  if (!filePath.endsWith('.md')) return

  let content
  try { content = fs.readFileSync(filePath, 'utf8') }
  catch { return }

  const hasFrontmatterTitle = /^---\s*\n(?:.*\n)*?title:\s*\S/m.test(content)
  const hasH1 = /^#\s+\S/m.test(content)

  if (!hasFrontmatterTitle && !hasH1) {
    errors.push({
      file: path.relative(cwd, filePath),
      message: 'missing title (no frontmatter title and no # heading)',
    })
  } else if (strict && !hasFrontmatterTitle) {
    warnings.push({
      file: path.relative(cwd, filePath),
      message: 'no frontmatter title (has # heading but no YAML title field)',
    })
  }
})

reportAndExit(errors, warnings, 'frontmatter')
