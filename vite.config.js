import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  DEFAULT_DESCRIPTION,
  ROUTE_META,
  SITE_URL,
  formatTitle,
} from './src/lib/routeMeta.js'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

// 블로그 글 목록을 파일시스템에서 직접 읽는다.
// src/lib/posts.js 는 Vite 전용 import.meta.glob 에 의존해 설정 파일에서
// 재사용할 수 없으므로, 필요한 frontmatter 만 최소한으로 다시 읽는다.
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

      return {
        slug: read('slug') || entry.name,
        date: read('date'),
        title: read('title') || entry.name,
        description: read('summary') || DEFAULT_DESCRIPTION,
      }
    })
    .filter(Boolean)
}

// 이미지의 실제 픽셀 크기를 읽는다. PNG 는 IHDR, JPEG 는 SOF 마커,
// SVG 는 width/height 또는 viewBox 에서 얻는다. 외부 의존성 없이 처리한다.
const readImageSize = (file) => {
  if (/\.svg$/i.test(file)) {
    const text = fs.readFileSync(file, 'utf8').slice(0, 2000)
    const w = text.match(/\bwidth\s*=\s*"([\d.]+)/)
    const h = text.match(/\bheight\s*=\s*"([\d.]+)/)
    if (w && h) return { width: Math.round(+w[1]), height: Math.round(+h[1]) }
    const vb = text.match(/viewBox\s*=\s*"\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)/)
    if (vb) return { width: Math.round(+vb[1]), height: Math.round(+vb[2]) }
    return null
  }

  const buf = fs.readFileSync(file)
  if (buf.length > 24 && buf.toString('ascii', 12, 16) === 'IHDR') {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i += 1; continue }
      const marker = buf[i + 1]
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) }
      }
      i += 2 + buf.readUInt16BE(i + 2)
    }
  }
  return null
}

// src/lib/posts.js 의 import.meta.glob 키와 같은 형태로 크기 표를 만든다.
// (예: ../content/blog/slam-where-am-i/image_1.png)
const collectBlogImageSizes = () => {
  const blogDir = path.join(rootDir, 'src/content/blog')
  const sizes = {}
  if (!fs.existsSync(blogDir)) return sizes

  const walk = (dir, prefix) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) { walk(full, `${prefix}${entry.name}/`); continue }
      if (!/\.(png|jpe?g|webp|svg|gif|avif)$/i.test(entry.name)) continue
      const size = readImageSize(full)
      if (size) sizes[`${prefix}${entry.name}`] = size
    }
  }
  walk(blogDir, '../content/blog/')
  return sizes
}

// 본문 이미지에 width/height 를 넣어 로딩 중 레이아웃이 밀리는 것을 막는다.
// 브라우저에서는 파일 크기를 알 수 없으므로 빌드 시 계산해 넘긴다.
const VIRTUAL_SIZES = 'virtual:blog-image-sizes'
const RESOLVED_SIZES = `\0${VIRTUAL_SIZES}`

const imageSizesPlugin = () => ({
  name: 'blog-image-sizes',
  resolveId(id) {
    return id === VIRTUAL_SIZES ? RESOLVED_SIZES : null
  },
  load(id) {
    if (id !== RESOLVED_SIZES) return null
    return `export default ${JSON.stringify(collectBlogImageSizes())}`
  },
})

// 사이트가 제공하는 모든 경로와 각 경로의 head 값
const collectPages = () => [
  ...Object.entries(ROUTE_META).map(([route, meta]) => ({ route, ...meta, date: '' })),
  ...readBlogEntries().map((post) => ({
    route: `/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    date: post.date,
  })),
]

// GitHub Pages 는 하위 디렉터리 경로를 슬래시 붙은 주소로 301 리다이렉트한다.
// (/portfolio -> /portfolio/) sitemap 과 canonical 은 리다이렉트되지 않는
// 최종 주소를 가리켜야 Search Console 에서 "리다이렉트된 페이지"로 잡히지 않는다.
const toUrl = (route) => {
  const withSlash = route === '/' || route.endsWith('/') ? route : `${route}/`
  return `${SITE_URL}${encodeURI(withSlash)}`
}

const escapeAttr = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// index.html 의 head 를 해당 경로 값으로 바꾼다.
const renderHead = (html, page) => {
  const url = toUrl(page.route)
  const title = escapeAttr(formatTitle(page.title))
  const desc = escapeAttr(page.description || DEFAULT_DESCRIPTION)

  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /(<meta\s+name="description"\s+content=")[\s\S]*?(")/,
      `$1${desc}$2`,
    )
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${title}$2`)
    .replace(
      /(<meta\s+property="og:description"\s+content=")[\s\S]*?(")/,
      `$1${desc}$2`,
    )
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${url}$2`)
}

// GitHub Pages 는 실제 파일이 없는 경로에 404 를 준다. 라우트마다 HTML 을
// 만들어 두지 않으면 / 를 제외한 모든 주소가 404 로 응답하고, sitemap 에
// 올린 주소도 색인되지 않는다. 또 SNS 크롤러는 JS 를 실행하지 않으므로
// head 를 경로별로 채워 두어야 링크 미리보기가 글마다 달라진다.
const prerenderPlugin = () => ({
  name: 'prerender-routes',
  apply: 'build',
  // index.html 은 Vite 코어 플러그인이 뒤늦게 번들에 추가하므로
  // generateBundle 시점에는 없다. 디스크에 기록된 뒤인 writeBundle 을 쓴다.
  writeBundle(options) {
    const outDir = options.dir || path.join(rootDir, 'dist')
    const indexPath = path.join(outDir, 'index.html')
    if (!fs.existsSync(indexPath)) {
      this.error(`프리렌더 실패: ${indexPath} 가 없습니다.`)
    }

    const indexHtml = fs.readFileSync(indexPath, 'utf8')
    const pages = collectPages()

    for (const page of pages) {
      const html = renderHead(indexHtml, page)
      const target =
        page.route === '/'
          ? indexPath
          : path.join(outDir, page.route.replace(/^\//, ''), 'index.html')
      fs.mkdirSync(path.dirname(target), { recursive: true })
      fs.writeFileSync(target, html, 'utf8')
    }

    const body = pages
      .map(({ route, date }) => {
        const lastmod = date ? `\n    <lastmod>${date}</lastmod>` : ''
        return `  <url>\n    <loc>${toUrl(route)}</loc>${lastmod}\n  </url>`
      })
      .join('\n')

    fs.writeFileSync(
      path.join(outDir, 'sitemap.xml'),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
      'utf8',
    )
  },
})

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), imageSizesPlugin(), prerenderPlugin()],
})
