// Shared error-reporting utilities for quality-gate scripts.

/**
 * @typedef {{ file: string, line?: number, message: string }} Finding
 */

/**
 * Print findings to stderr and exit with the appropriate code.
 * @param {Finding[]} errors
 * @param {Finding[]} warnings
 * @param {string} label - human-readable check name (e.g. "doc links")
 */
export function reportAndExit(errors, warnings = [], label = 'check') {
  if (warnings.length > 0) {
    console.error(`\n${warnings.length} warning(s) in ${label}:`)
    for (const w of warnings) {
      const loc = w.line ? `${w.file}:${w.line}` : w.file
      console.error(`  WARN  ${loc} — ${w.message}`)
    }
  }

  if (errors.length > 0) {
    console.error(`\n${errors.length} error(s) in ${label}:`)
    for (const e of errors) {
      const loc = e.line ? `${e.file}:${e.line}` : e.file
      console.error(`  ERROR ${loc} — ${e.message}`)
    }
    process.exit(1)
  }

  const labelText = warnings.length > 0
    ? ` (${warnings.length} warnings)`
    : ''
  console.error(`${label}: passed${labelText}`)
  process.exit(0)
}

/**
 * Read a file safely; returns content or null on failure.
 * Records the error in `errors` so the caller can continue scanning.
 * @param {string} filePath
 * @param {Finding[]} errors
 * @returns {string|null}
 */
export function safeReadFile(filePath, errors) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch (err) {
    errors.push({
      file: filePath,
      message: `Cannot read file: ${err.message}`,
    })
    return null
  }
}

import fs from 'node:fs'
