#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const cwd = process.cwd()
const docsRoot = path.join(cwd, 'docs')
const basePath = '/ohmyopenAI-tutorial-hub/'

const args = process.argv.slice(2)
const distFlagIndex = args.indexOf('--dist')
const distRoot = distFlagIndex >= 0 ? path.resolve(args[distFlagIndex + 1] ?? '') : null

const sourceFiles = []
const pageRoutes = new Set()
const assetRoutes = new Set()

function walk(dir, visitor) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (fullPath.includes(`${path.sep}.vitepress${path.sep}dist`)) continue
      if (entry.name === 'node_modules') continue
      walk(fullPath, visitor)
    } else {
      visitor(fullPath)
    }
  }
}

function posixPath(value) {
  return value.split(path.sep).join('/')
}

function routeFromMarkdown(file) {
  const rel = posixPath(path.relative(docsRoot, file)).replace(/\.md$/, '')
  if (rel === 'index') return '/'
  if (rel.endsWith('/index')) return `/${rel.slice(0, -'/index'.length)}`
  return `/${rel}`
}

function routeVariants(route) {
  const normalized = normalizeRoute(route)
  const variants = new Set([normalized])
  if (normalized !== '/') {
    variants.add(`${normalized}/`)
    variants.add(`${normalized}.html`)
    variants.add(`${normalized}/index.html`)
  } else {
    variants.add('/index.html')
  }
  return variants
}

function addPageRoute(route) {
  for (const variant of routeVariants(route)) pageRoutes.add(variant)
}

function addAssetRoute(route) {
  assetRoutes.add(route)
  if (route.startsWith(basePath)) assetRoutes.add(route.slice(basePath.length - 1))
}

walk(docsRoot, (file) => {
  const rel = posixPath(path.relative(docsRoot, file))
  const ext = path.extname(file)

  if (['.md', '.ts', '.vue'].includes(ext)) sourceFiles.push(file)

  if (ext === '.md') {
    addPageRoute(routeFromMarkdown(file))
    return
  }

  if (file.includes(`${path.sep}public${path.sep}`)) {
    addAssetRoute(`/${posixPath(path.relative(path.join(docsRoot, 'public'), file))}`)
    return
  }

  if (!rel.startsWith('.vitepress/') && ['.svg', '.png', '.jpg', '.jpeg', '.webp', '.css', '.ico'].includes(ext)) {
    addAssetRoute(`/${rel}`)
  }
})

if (distRoot) {
  walk(distRoot, (file) => {
    const rel = `/${posixPath(path.relative(distRoot, file))}`
    if (rel.endsWith('.html')) {
      const route = rel === '/index.html' ? '/' : rel.replace(/\.html$/, '')
      addPageRoute(route)
    } else {
      addAssetRoute(rel)
    }
  })
}

function lineNumberAt(content, index) {
  return content.slice(0, index).split('\n').length
}

function stripDecorators(raw) {
  return raw
    .trim()
    .replace(/^<|>$/g, '')
    .split(/\s+/)[0]
    .split('#')[0]
    .split('?')[0]
}

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

function normalizeRoute(route) {
  let value = route
  if (value.startsWith(basePath)) value = `/${value.slice(basePath.length)}`
  if (!value.startsWith('/')) value = `/${value}`
  value = value.replace(/\/+/g, '/')
  if (value.length > 1) value = value.replace(/\/$/, '')
  if (value.endsWith('/index')) value = value.slice(0, -'/index'.length) || '/'
  return value
}

function sourceDirRoute(file) {
  const route = routeFromMarkdown(file)
  const sourceName = path.basename(file)
  if (sourceName === 'index.md') return route
  return route === '/' ? '/' : path.posix.dirname(route)
}

function resolveLink(raw, file) {
  let stripped = stripDecorators(raw)
  const withBaseMatch = stripped.match(/^withBase\(['"`]([^'"`]+)['"`]\)$/)
  if (withBaseMatch) stripped = withBaseMatch[1]
  if (isIgnored(stripped)) return null

  if (stripped.startsWith('/')) return normalizeRoute(stripped)

  const base = file.endsWith('.md') ? sourceDirRoute(file) : '/'
  return normalizeRoute(path.posix.normalize(path.posix.join(base, stripped)))
}

function routeExists(route) {
  const ext = path.posix.extname(route)

  if (ext && ext !== '.html' && ext !== '.md') {
    return assetRoutes.has(route)
  }

  const asRoute = normalizeRoute(route.replace(/\.md$/, '').replace(/\.html$/, ''))
  return [...routeVariants(asRoute)].some((variant) => pageRoutes.has(variant))
}

const extractors = [
  /\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g,
  /(?:href|src)="([^"]+)"/g,
  /(?:href|src)='([^']+)'/g,
  /(?:link|src):\s*["'`]([^"'`]+)["'`]/g,
]

const broken = []

for (const file of sourceFiles) {
  const content = fs.readFileSync(file, 'utf8')
  for (const regex of extractors) {
    for (const match of content.matchAll(regex)) {
      const route = resolveLink(match[1], file)
      if (!route) continue
      if (!routeExists(route)) {
        broken.push({
          file: path.relative(cwd, file),
          line: lineNumberAt(content, match.index ?? 0),
          route,
        })
      }
    }
  }
}

if (broken.length > 0) {
  console.error(`Found ${broken.length} broken first-party link(s):`)
  for (const item of broken) {
    console.error(`- ${item.file}:${item.line} -> ${item.route}`)
  }
  process.exit(1)
}

console.log(`Checked ${sourceFiles.length} source files; no broken first-party links found.`)
