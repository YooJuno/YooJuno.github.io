import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'
import { parseBlogPost } from '../src/lib/blogContent.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const directory = path.join(root, 'src/content/blog')
const seen = new Set()
let count = 0

const checkImage = (href, folder) => {
  if (!href || /^(?:https?:|data:|\/\/)/i.test(href)) return
  const pathname = decodeURIComponent(href.split(/[?#]/)[0])
  const file = pathname.startsWith('/')
    ? path.join(root, 'public', pathname)
    : path.resolve(folder, pathname)
  const allowed = pathname.startsWith('/') ? path.join(root, 'public') : folder
  if (!file.startsWith(`${allowed}${path.sep}`) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    throw new Error(`이미지 경로를 확인해주세요: ${folder} → ${href}`)
  }
}

for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const folder = path.join(directory, entry.name)
  const file = path.join(folder, 'index.md')
  if (!fs.existsSync(file)) continue
  const post = parseBlogPost(fs.readFileSync(file, 'utf8'), entry.name)
  const key = post.slug.toLowerCase()
  if (seen.has(key)) throw new Error(`중복된 글 주소: ${post.slug}`)
  seen.add(key)
  marked.walkTokens(marked.lexer(post.content), token => {
    if (token.type === 'image') checkImage(token.href, folder)
  })
  count += 1
}

console.log(`블로그 ${count}개 글의 메타데이터·주소·이미지 경로 확인 완료`)
