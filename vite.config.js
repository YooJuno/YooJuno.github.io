import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const SITE_URL = 'https://yoojuno.github.io'

// App.jsx 의 <Route> 와 대응하는 정적 경로.
// 라우트를 추가하면 여기도 함께 추가해야 한다.
const STATIC_ROUTES = [
  '/',
  '/portfolio',
  '/blog',
  '/web-service',
  '/web-service/blog',
  '/web-service/cctv-streaming',
  '/web-service/video-chatting',
  '/web-service/bitcoin-auto-trader',
]

// 블로그 글 목록을 파일시스템에서 직접 읽는다.
// src/lib/posts.js 는 Vite 전용 import.meta.glob 에 의존해 설정 파일에서 재사용할 수 없으므로,
// sitemap 에 필요한 slug/date 만 최소한으로 다시 읽는다.
const readBlogEntries = () => {
  const blogDir = path.join(rootDir, 'src/content/blog')
  if (!fs.existsSync(blogDir)) return []

  return fs
    .readdirSync(blogDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const file = path.join(blogDir, entry.name, 'index.md')
      if (!fs.existsSync(file)) return null

      const raw = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '')
      const front = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
      const read = (key) => {
        const hit = front?.[1].match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
        return hit ? hit[1].trim().replace(/^["']|["']$/g, '') : ''
      }

      return { slug: read('slug') || entry.name, date: read('date') }
    })
    .filter(Boolean)
}

// 빌드 시 sitemap.xml 을 생성해 글 추가와 자동으로 동기화되게 한다.
const sitemapPlugin = () => ({
  name: 'generate-sitemap',
  apply: 'build',
  generateBundle() {
    const urls = [
      ...STATIC_ROUTES.map((route) => ({ loc: route, date: '' })),
      ...readBlogEntries().map((post) => ({
        loc: `/blog/${post.slug}`,
        date: post.date,
      })),
    ]

    const body = urls
      .map(({ loc, date }) => {
        const lastmod = date ? `\n    <lastmod>${date}</lastmod>` : ''
        return `  <url>\n    <loc>${SITE_URL}${encodeURI(loc)}</loc>${lastmod}\n  </url>`
      })
      .join('\n')

    this.emitFile({
      type: 'asset',
      fileName: 'sitemap.xml',
      source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), sitemapPlugin()],
})
