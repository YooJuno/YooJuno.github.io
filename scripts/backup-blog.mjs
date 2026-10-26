import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const destination = path.join(root, '.backups', 'blog', stamp)
const source = path.join(root, 'src/content/blog')
const files = []

const collect = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) collect(absolute)
    else if (entry.isFile()) {
      const bytes = fs.readFileSync(absolute)
      files.push({
        path: path.relative(root, absolute).split(path.sep).join('/'),
        size: bytes.length,
        sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
      })
    }
  }
}

collect(source)
fs.mkdirSync(destination, { recursive: true })
const archive = path.join(destination, 'blog.tar.gz')
execFileSync('tar', ['-czf', archive, '-C', root, 'src/content/blog'])
const manifest = {
  createdAt: new Date().toISOString(),
  sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  archiveSha256: crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex'),
  articles: files.filter(file => file.path.endsWith('/index.md')).length,
  files,
}
fs.writeFileSync(path.join(destination, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`블로그 ${manifest.articles}개 글, ${files.length}개 파일 백업: ${destination}`)
