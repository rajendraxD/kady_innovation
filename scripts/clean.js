import fs from 'node:fs'
import path from 'node:path'

const targets = [
  'node_modules',
  path.join('backend', 'node_modules'),
  path.join('frontend', 'node_modules'),
  path.join('frontend', 'dist'),
  path.join('backend', 'uploads'),
]

let removed = 0
let failed = 0

const removeOne = (target) => {
  if (!fs.existsSync(target)) {
    console.log(`skip  ${target} (not present)`)
    return
  }
  try {
    fs.rmSync(target, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 })
    console.log(`rm    ${target}`)
    removed++
  } catch (err) {
    // Locked file (EPERM) — try fs.cp sync delete by walking tree, skipping locked entries
    if (err.code === 'EPERM' || err.code === 'EBUSY') {
      try {
        removeTreeIgnoreLocked(target)
        console.log(`rm*   ${target} (locked entries skipped)`)
        removed++
      } catch (err2) {
        console.error(`FAIL  ${target}: ${err2.code} ${err2.message}`)
        failed++
      }
    } else {
      console.error(`FAIL  ${target}: ${err.code} ${err.message}`)
      failed++
    }
  }
}

const removeTreeIgnoreLocked = (root) => {
  const stack = [root]
  while (stack.length) {
    const cur = stack.pop()
    let entries
    try { entries = fs.readdirSync(cur, { withFileTypes: true }) } catch { continue }
    for (const entry of entries) {
      const full = path.join(cur, entry.name)
      try {
        if (entry.isDirectory()) {
          stack.push(full)
        } else {
          try { fs.unlinkSync(full) } catch (e) { if (e.code !== 'EPERM' && e.code !== 'EBUSY') throw e }
        }
      } catch (e) {
        if (e.code !== 'EPERM' && e.code !== 'EBUSY') throw e
      }
    }
  }
  try { fs.rmdirSync(root) } catch {}
}

for (const t of targets) removeOne(t)

console.log(`\nRemoved: ${removed}   Failed: ${failed}`)
process.exit(failed > 0 ? 1 : 0)
