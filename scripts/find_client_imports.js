const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')

function walk(dir) {
  let results = []
  const list = fs.readdirSync(dir)
  for (const file of list) {
    if (file === 'node_modules' || file === '.next' || file === '.git') continue
    const full = path.join(dir, file)
    const stat = fs.statSync(full)
    if (stat && stat.isDirectory()) results = results.concat(walk(full))
    else if (/\.(js|jsx|ts|tsx)$/.test(file)) results.push(full)
  }
  return results
}

function firstNonEmptyLine(file) {
  const s = fs.readFileSync(file, 'utf8')
  const lines = s.split(/\r?\n/)
  for (const l of lines) {
    const t = l.trim()
    if (t.length) return t
  }
  return ''
}

const allFiles = walk(root)
const clientFiles = new Set()
for (const f of allFiles) {
  const first = firstNonEmptyLine(f)
  if (first === '"use client"' || first === "'use client'") clientFiles.add(f)
}

const imports = {}
const clientByBasename = {}
for (const cf of clientFiles) {
  clientByBasename[path.basename(cf).replace(/\.(js|jsx|ts|tsx)$/, '')] = cf
}

function resolveImport(fromFile, importPath) {
  if (!importPath.startsWith('.')) return null
  const fromDir = path.dirname(fromFile)
  const cand = path.resolve(fromDir, importPath)
  const exts = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js', '/index.jsx']
  for (const e of exts) {
    const p = cand + e
    if (fs.existsSync(p)) return p
  }
  // try as file without ext
  for (const e of ['.ts', '.tsx', '.js', '.jsx']) {
    const p = cand + e
    if (fs.existsSync(p)) return p
  }
  return null
}

for (const f of allFiles) {
  const content = fs.readFileSync(f, 'utf8')
  const importRegex = /import\s+[^'";]+['"]([^'"]+)['"]/g
  let m
  while ((m = importRegex.exec(content)) !== null) {
    const imp = m[1]
    const resolved = resolveImport(f, imp)
    if (resolved && clientFiles.has(resolved)) {
      if (!imports[resolved]) imports[resolved] = []
      imports[resolved].push(f)
    }
  }
}

fs.writeFileSync(
  path.join(root, 'scripts', 'client_imports_report.json'),
  JSON.stringify({ clientFiles: Array.from(clientFiles), imports }, null, 2)
)
console.log('Wrote scripts/client_imports_report.json')
