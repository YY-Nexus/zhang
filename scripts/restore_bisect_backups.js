const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const bakDir = path.join(root, '.bisectbak')
if (!fs.existsSync(bakDir)) {
  console.log('no bak dir')
  process.exit(0)
}
const files = fs.readdirSync(bakDir)
const all = require('./client_imports_report.json').clientFiles || []
for (const f of files) {
  if (!f.endsWith('.bak')) continue
  const rel = f.replace(/\.bak$/, '').replace(/_/g, path.sep)
  const target = path.join(root, rel)
  if (fs.existsSync(target)) {
    fs.copyFileSync(path.join(bakDir, f), target)
    console.log('restored ->', target)
  } else {
    const candidates = []
    for (const c of all) {
      if (c.endsWith(rel)) candidates.push(c)
    }
    if (candidates.length === 1) {
      fs.copyFileSync(path.join(bakDir, f), candidates[0])
      console.log('restored (suffix)->', candidates[0])
    } else if (candidates.length > 1) {
      console.log('multiple candidates for', f, candidates)
    } else {
      console.log('no target for', f)
    }
  }
}

console.log('restore script complete')
