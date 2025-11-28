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
  console.error('No client files listed.')
  process.exit(1)
}

const bakDir = path.join(root, '.bisectbak')
if (!fs.existsSync(bakDir)) fs.mkdirSync(bakDir)

function backup(file) {
  const rel = path.relative(root, file).replace(/[/\\]/g, '_')
  const bak = path.join(bakDir, rel + '.bak')
  if (!fs.existsSync(bak)) fs.copyFileSync(file, bak)
  return bak
}

function restoreFromBak(file) {
  const rel = path.relative(root, file).replace(/[/\\]/g, '_')
  const bak = path.join(bakDir, rel + '.bak')
  if (fs.existsSync(bak)) fs.copyFileSync(bak, file)
}

function makeStubFromBak(bakPath, target) {
  let orig = ''
  if (fs.existsSync(bakPath)) orig = fs.readFileSync(bakPath, 'utf8')
  const ext = path.extname(target).toLowerCase()
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
  let stub = ''
  if (ext === '.tsx' || ext === '.jsx' || ext === '.ts' || ext === '.js') {
    for (const n of named) {
      stub += `export const ${n} = (props:any) => null\n`
    }
    if (hasDefault || named.length === 0) {
      stub += `export default function Stub(props:any){ return null }\n`
    }
  } else {
    stub = `export default function Stub(props:any){ return null }\n`
  }
  return stub
}

function runBuild(iter) {
  try {
    execSync('rm -rf .next', { cwd: root })
    const cmd =
      'NODE_OPTIONS="--enable-source-maps --trace-warnings" npx next build --debug-prerender'
    const out = execSync(cmd, { cwd: root, stdio: 'pipe', maxBuffer: 1024 * 1024 * 50 }).toString()
    fs.writeFileSync(path.join(root, 'scripts', `linear_${iter}_build.log`), out)
    return { ok: true, out }
  } catch (err) {
    const out =
      (err.stdout ? err.stdout.toString() : '') + '\n' + (err.stderr ? err.stderr.toString() : '')
    fs.writeFileSync(path.join(root, 'scripts', `linear_${iter}_build.log`), out)
    return { ok: false, out }
  }
}

console.log(`Starting linear bisect over ${clientFiles.length} client files`)

let candidate = null
for (let i = 0; i < clientFiles.length; i++) {
  const f = clientFiles[i]
  console.log(`\n[${i + 1}/${clientFiles.length}] Testing: ${f}`)
  if (!fs.existsSync(f)) {
    console.log('  -> file missing, skipping')
    continue
  }
  const bak = backup(f)
  const stub = makeStubFromBak(bak, f)
  try {
    fs.writeFileSync(f, stub, 'utf8')
  } catch (e) {
    console.error('  -> failed to write stub:', e.message)
    restoreFromBak(f)
    continue
  }

  const res = runBuild(i + 1)
  const out = res.out || ''
  const hadPrerenderError =
    out.includes('Error occurred prerendering page "/_global-error"') && out.includes('useContext')
  if (!hadPrerenderError) {
    console.log(`  -> PRERENDER ERROR disappeared when stubbing ${f}`)
    candidate = f
    // restore original file before breaking
    restoreFromBak(f)
    break
  } else {
    console.log(`  -> still failing prerender; restoring file and continuing`)
    restoreFromBak(f)
  }
}

if (candidate) {
  console.log('\nPotential offending file found:', candidate)
  fs.writeFileSync(path.join(root, 'scripts', 'linear_bisect_result.txt'), candidate)
} else {
  console.log('\nNo single-file fix found by linear bisect. See logs in scripts/linear_*.log')
}

console.log('Linear bisect finished')
