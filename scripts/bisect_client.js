const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const root = path.resolve(__dirname, '..')
const reportPath = path.join(root, 'scripts', 'client_imports_report.json')
if (!fs.existsSync(reportPath)) {
  console.error('client_imports_report.json not found. Run scripts/find_client_imports.js first.')
  process.exit(1)
}
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
const clientFiles = report.clientFiles || []
if (clientFiles.length === 0) {
  console.error('No client files found to bisect.')
  process.exit(1)
}

const bakDir = path.join(root, '.bisectbak')
if (!fs.existsSync(bakDir)) fs.mkdirSync(bakDir)

function backup(file) {
  const rel = path.relative(root, file).replace(/[/\\]/g, '_')
  const bak = path.join(bakDir, rel + '.bak')
  if (!fs.existsSync(bak)) {
    fs.copyFileSync(file, bak)
  }
}

function restore(file) {
  const rel = path.relative(root, file).replace(/[/\\]/g, '_')
  const bak = path.join(bakDir, rel + '.bak')
  if (fs.existsSync(bak)) {
    fs.copyFileSync(bak, file)
  }
}

function restoreAll() {
  const files = fs.readdirSync(bakDir)
  for (const f of files) {
    if (!f.endsWith('.bak')) continue
    const bakPath = path.join(bakDir, f)
    // try to map bak filename back to clientFiles by basename
    const base = f.replace(/\.bak$/, '').split('_').slice(-1)[0]
    const cand = clientFiles.find(p => path.basename(p).replace(/\.(js|jsx|ts|tsx)$/,'') === base)
    if (cand) fs.copyFileSync(bakPath, cand)
  }
}

function writeStub(file) {
  const ext = path.extname(file).toLowerCase()
  let stub = ''
  // try to preserve original export shape by inspecting backup
  const rel = path.relative(root, file).replace(/[/\\]/g, '_')
  const bak = path.join(bakDir, rel + '.bak')
  let orig = ''
  if (fs.existsSync(bak)) orig = fs.readFileSync(bak, 'utf8')
  const hasDefault = /export\s+default/.test(orig)
  const named = []
  const m1 = orig.match(/export\s+(?:const|function|class)\s+([A-Za-z0-9_]+)/g)
  if (m1) {
    for (const mm of m1) {
      const nm = mm.replace(/export\s+(?:const|function|class)\s+/, '').trim()
      named.push(nm)
    }
  }
  const m2 = orig.match(/export\s*\{([^}]+)\}/)
  if (m2) {
    const parts = m2[1].split(',').map(s => s.split('as')[0].trim())
    for (const p of parts) if (p) named.push(p)
  }

  if (ext === '.tsx' || ext === '.jsx' || ext === '.ts' || ext === '.js') {
    // create stubs for named exports
    for (const n of named) {
      stub += `export const ${n} = (props:any) => null\n`
    }
    if (hasDefault) {
      stub += `export default function Stub(props:any){ return null }\n`
    } else if (named.length === 0) {
      // fallback to default export
      stub += `export default function Stub(props:any){ return null }\n`
    }
  } else {
    stub = `export default function Stub(props:any){ return null }\n`
  }
  fs.writeFileSync(file, stub, 'utf8')
}

function runBuild() {
  try {
    execSync('rm -rf .next', { cwd: root })
      const cmd = 'NODE_OPTIONS="--enable-source-maps --trace-warnings" npx next build --debug-prerender'
      const child = execSync(cmd, { cwd: root, stdio: 'pipe', maxBuffer: 1024 * 1024 * 50 })
      const out = child.toString()
      fs.writeFileSync(path.join(root, 'scripts', 'bisect_last_build.log'), out)
      if (out.includes('Error occurred prerendering page "/_global-error"') && out.includes('useContext')) {
        return { ok: false, out }
      }
      return { ok: true, out }
  } catch (err) {
      const out = (err.stdout ? err.stdout.toString() : '') + '\n' + (err.stderr ? err.stderr.toString() : '')
      fs.writeFileSync(path.join(root, 'scripts', 'bisect_last_build.log'), out)
      if (out.includes('Error occurred prerendering page "/_global-error"') && out.includes('useContext')) {
        return { ok: false, out }
      }
      // Unexpected build error: return a special result so caller can restore and abort safely
      return { ok: null, out }
  }
}

console.log(`Starting bisect across ${clientFiles.length} client files`)

let low = 0
let high = clientFiles.length - 1
let found = null

while (low <= high) {
  const mid = Math.floor((low + high) / 2)
  const testSet = clientFiles.slice(low, mid + 1)
  console.log(`Testing range [${low},${mid}] (${testSet.length} files) ...`)
  for (const f of testSet) {
    if (fs.existsSync(f)) {
      backup(f)
      writeStub(f)
    }
  }
  const res = runBuild()
  if (res.ok === true) {
    console.log(`Build succeeded when stubbing [${low},${mid}]. Narrowing to this range.`)
    high = mid
    if (low === high) {
      found = clientFiles[low]
      break
    }
  } else if (res.ok === false) {
    console.log(`Build still fails when stubbing [${low},${mid}]. Restoring and searching complement.`)
    for (const f of testSet) {
      if (fs.existsSync(f)) restore(f)
    }
    low = mid + 1
    if (low > high) break
  } else {
    console.error('Unexpected build error during bisect. See scripts/bisect_last_build.log')
    // restore and abort
    for (const f of testSet) {
      if (fs.existsSync(f)) restore(f)
    }
    restoreAll()
    process.exit(3)
  }
}

if (found) {
  console.log('Potential offending file found:', found)
  fs.writeFileSync(path.join(root, 'scripts', 'bisect_result.txt'), found)
} else {
  console.log('Bisect completed without isolating single file. Consider full bisect or manual review.')
}

console.log('Restoring all backups...')
restoreAll()
console.log('Done. Check scripts/bisect_result.txt and scripts/bisect_last_build.log')
