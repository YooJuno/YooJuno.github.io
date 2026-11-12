import fs from 'node:fs'
import path from 'node:path'
import { marked } from 'marked'
import { parseBlogPost } from '../src/lib/blogContent.js'

const INDEX_ID = 'virtual:blog-index'
const SEARCH_ID = 'virtual:blog-search'
const POST_PREFIX = 'virtual:blog-post/'

const headingId = text => String(text)
  .toLowerCase()
  .replace(/<[^>]*>/g, '')
  .replace(/[^\p{L}\p{N}\s-]/gu, '')
  .trim()
  .replace(/\s+/g, '-') || 'section'

export default function blogContentPlugin({ rootDir, readImageSize }) {
  const directory = path.join(rootDir, 'src/content/blog')
  const virtualIds = new Set()
  const readPosts = () => fs.readdirSync(directory, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .sort((first, second) => first.name < second.name ? -1 : first.name > second.name ? 1 : 0)
    .flatMap(entry => {
      const file = path.join(directory, entry.name, 'index.md')
      if (!fs.existsSync(file)) return []
      const { slug, title, date, category, tags, summary, content } = parseBlogPost(fs.readFileSync(file, 'utf8'), entry.name)
      return [{ slug, title, date, category, tags, summary, content, file }]
    })
    .sort((first, second) => second.date.localeCompare(first.date))

  const metadata = ({ slug, title, date, category, tags, summary }) => ({ slug, title, date, category, tags, summary })

  const renderPost = (post, context) => {
    const renderer = new marked.Renderer()
    const originalImage = renderer.image.bind(renderer)
    const originalHeading = renderer.heading.bind(renderer)
    const originalTable = renderer.table.bind(renderer)
    const originalCode = renderer.code.bind(renderer)
    const assets = []
    const usedHeadings = new Map()
    renderer.table = token => `<div class="post-table-scroll" role="region" aria-label="표" tabindex="0">${originalTable(token)}</div>`
    renderer.code = token => originalCode(token).replace(/^<pre>/, '<pre tabindex="0" aria-label="코드 블록">')
    renderer.heading = token => {
      const base = headingId(token.text)
      const count = usedHeadings.get(base) || 0
      usedHeadings.set(base, count + 1)
      return originalHeading(token).replace(/^<h([1-6])/, `<h$1 id="${count ? `${base}-${count}` : base}"`)
    }
    renderer.image = token => {
      let href = token.href
      let size = null
      if (href && !/^(?:[a-z][a-z\d+.-]*:|\/)/i.test(href)) {
        const splitAt = href.search(/[?#]/)
        const pathname = splitAt < 0 ? href : href.slice(0, splitAt)
        const suffix = splitAt < 0 ? '' : href.slice(splitAt)
        const file = path.resolve(path.dirname(post.file), decodeURIComponent(pathname))
        if (!file.startsWith(`${path.dirname(post.file)}${path.sep}`) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
          throw new Error(`${post.slug}: 이미지 경로를 확인해주세요: ${href}`)
        }
        context.addWatchFile(file)
        size = readImageSize(file)
        const placeholder = `__BLOG_ASSET_${assets.length}__`
        assets.push({ file, suffix, placeholder })
        href = placeholder
      }
      const dimensions = size ? ` width="${size.width}" height="${size.height}"` : ''
      return originalImage({ ...token, href }).replace(/^<img /, `<img loading="lazy" decoding="async"${dimensions} `)
    }
    const html = marked.parse(post.content, { renderer })
    const imports = assets.map((asset, index) => `import image${index} from ${JSON.stringify(`${asset.file}?url`)};`).join('\n')
    const replacements = assets.map((asset, index) => `.replaceAll(${JSON.stringify(asset.placeholder)}, image${index} + ${JSON.stringify(asset.suffix)})`).join('')
    return `${imports}\nexport default { ...${JSON.stringify(metadata(post))}, html: ${JSON.stringify(html)}${replacements} };`
  }

  const refresh = (server, file) => {
    if (!file.startsWith(`${directory}${path.sep}`)) return false
    for (const id of virtualIds) {
      const module = server.moduleGraph.getModuleById(id)
      if (module) server.moduleGraph.invalidateModule(module)
    }
    server.ws.send({ type: 'full-reload' })
    return true
  }

  return {
    name: 'blog-content',
    resolveId(id) {
      if (id !== INDEX_ID && id !== SEARCH_ID && !id.startsWith(POST_PREFIX)) return null
      const resolved = `\0${id}`
      virtualIds.add(resolved)
      return resolved
    },
    load(id) {
      if (!virtualIds.has(id)) return null
      const posts = readPosts()
      for (const post of posts) this.addWatchFile(post.file)
      if (id === `\0${INDEX_ID}`) {
        const loaders = posts.map(post => `${JSON.stringify(post.slug)}: () => import(${JSON.stringify(`${POST_PREFIX}${post.slug}`)})`).join(',')
        return `export default ${JSON.stringify(posts.map(metadata))};\nexport const postLoaders = {${loaders}};`
      }
      if (id === `\0${SEARCH_ID}`) {
        return `export default ${JSON.stringify(Object.fromEntries(posts.map(post => [post.slug, post.content.toLowerCase()])))};`
      }
      const slug = id.slice(POST_PREFIX.length + 1)
      const post = posts.find(entry => entry.slug === slug)
      if (!post) throw new Error(`글을 찾을 수 없습니다: ${slug}`)
      return renderPost(post, this)
    },
    configureServer(server) {
      const onChange = file => refresh(server, file)
      server.watcher.add(directory)
      server.watcher.on('add', onChange)
      server.watcher.on('unlink', onChange)
      server.httpServer?.once('close', () => {
        server.watcher.off('add', onChange)
        server.watcher.off('unlink', onChange)
      })
    },
    handleHotUpdate({ file, server }) {
      if (refresh(server, file)) return []
    },
  }
}
