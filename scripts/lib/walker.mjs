// Shared file-system walking utilities for quality-gate scripts.
import fs from 'node:fs'
import path from 'node:path'

/**
 * Walk a directory tree, calling `visitor` for every file.
 * Skips directories matching `skipDir` names (e.g. node_modules, .vitepress/dist).
 */
export function walkFiles(dir, visitor, { skipDirs = ['node_modules', '.git'] } = {}) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (skipDirs.includes(entry.name)) continue
      // Skip VitePress build output
      if (fullPath.includes(`${path.sep}.vitepress${path.sep}dist`)) continue
      walkFiles(fullPath, visitor, { skipDirs })
    } else {
      visitor(fullPath)
    }
  }
}

/**
 * Collect all files under `dir` matching one of `extensions`.
 * Returns an array of absolute paths.
 */
export function collectFiles(dir, extensions, { skipDirs = ['node_modules', '.git'] } = {}) {
  const files = []
  walkFiles(dir, (filePath) => {
    const ext = path.extname(filePath)
    if (extensions.includes(ext)) files.push(filePath)
  }, { skipDirs })
  return files
}

/**
 * Return a POSIX-style relative path from `base` to `file`.
 */
export function posixRelative(base, file) {
  return path.relative(base, file).split(path.sep).join('/')
}
