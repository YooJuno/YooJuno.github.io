import { marked } from 'marked'
import imageSizes from 'virtual:blog-image-sizes'

const modules = import.meta.glob('../content/blog/**/index.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const imageModules = import.meta.glob('../content/blog/**/*.{png,jpg,jpeg,webp,svg,gif,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

const parseFrontMatter = (raw) => {
  const cleaned = raw.replace(/^\uFEFF/, '')
  const match = cleaned.match(FRONT_MATTER)
  if (!match) {
    return { data: {}, content: cleaned }
  }

  const body = match[1]
  const content = cleaned.slice(match[0].length)
  const data = {}
  const lines = body.split('\n')

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const index = trimmed.indexOf(':')
    if (index === -1) continue
    const key = trimmed.slice(0, index).trim()
    let value = trimmed.slice(index + 1).trim()

    if (!value) {
      const list = []
      let j = i + 1
      while (j < lines.length) {
        const next = lines[j].trim()
        if (!next) {
          j += 1
          continue
        }
        if (next.startsWith('-')) {
          list.push(next.replace(/^-+/, '').trim())
          j += 1
          continue
        }
        if (next.includes(':')) break
        break
      }
      if (list.length) {
        data[key] = list
        i = j - 1
        continue
      }
      data[key] = ''
      continue
    }

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    }
    data[key] = value
  }

  return { data, content }
}

const normalizeTags = (tags) => {
  if (!tags) return []
  if (Array.isArray(tags)) return tags.map(String)
  return String(tags)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

const getExcerpt = (content, summary) => {
  if (summary) return summary
  const plain = content.replace(/\s+/g, ' ').trim()
  return plain.length > 160 ? `${plain.slice(0, 160)}...` : plain
}

const isExternalLink = (value) =>
  /^https?:\/\//.test(value) ||
  value.startsWith('//') ||
  value.startsWith('data:') ||
  value.startsWith('mailto:') ||
  value.startsWith('tel:')

// 번들된 이미지 URL 과 실제 픽셀 크기를 함께 돌려준다.
// 크기는 vite.config.js 의 blog-image-sizes 플러그인이 빌드 시 계산한다.
const resolveImage = (href, baseDir) => {
  if (!href || typeof href !== 'string') return { src: href, size: null }
  if (href.startsWith('/') || isExternalLink(href)) return { src: href, size: null }
  const [pathPart, suffix = ''] = href.split(/(?=[?#])/)
  const cleaned = pathPart.replace(/^\.\//, '')
  if (cleaned.startsWith('../')) return { src: href, size: null }
  const key = `${baseDir}${cleaned}`
  const resolved = imageModules[key]
  if (!resolved) return { src: href, size: null }
  return { src: `${resolved}${suffix}`, size: imageSizes[key] || null }
}

// 제목에 붙일 id 를 만든다. 같은 글 안에서 중복되면 뒤에 번호를 붙인다.
const slugify = (text) =>
  String(text)
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-') || 'section'

const createRenderer = (baseDir) => {
  const renderer = new marked.Renderer()
  const originalImage = renderer.image.bind(renderer)
  const originalHeading = renderer.heading.bind(renderer)
  const used = new Map()

  // 본문 이미지는 화면에 들어올 때 로드하고, 실제 크기를 함께 지정해
  // 로딩 중 본문이 밀리지 않게 한다. (CSS 의 height:auto 와 함께 동작)
  renderer.image = (token) => {
    if (!token || typeof token !== 'object') return originalImage(token)
    const { src, size } = resolveImage(token.href, baseDir)
    const attrs = ['loading="lazy"', 'decoding="async"']
    if (size) attrs.push(`width="${size.width}"`, `height="${size.height}"`)
    return originalImage({ ...token, href: src }).replace(
      /^<img /,
      `<img ${attrs.join(' ')} `,
    )
  }

  // marked v7 부터 제목 id 를 자동으로 만들지 않는다. 긴 글에서 특정 절을
  // 링크로 가리킬 수 있도록 직접 붙인다.
  renderer.heading = (token) => {
    const html = originalHeading(token)
    const base = slugify(token.text)
    const count = used.get(base) || 0
    used.set(base, count + 1)
    const id = count ? `${base}-${count}` : base
    return html.replace(/^<h([1-6])/, `<h$1 id="${id}"`)
  }

  return renderer
}

export const posts = Object.entries(modules)
  .map(([path, raw]) => {
    const { data, content } = parseFrontMatter(raw)
    const parts = path.split('/')
    const slugFromPath = parts[parts.length - 2]
    const slug = data.slug ? String(data.slug) : slugFromPath
    const baseDir = path.slice(0, path.lastIndexOf('/') + 1)
    const tags = normalizeTags(data.tags)

    return {
      slug,
      title: data.title || slug,
      date: data.date || '',
      category: data.category || '',
      tags,
      summary: getExcerpt(content, data.summary),
      html: marked.parse(content, { renderer: createRenderer(baseDir) }),
      raw: content,
    }
  })
  .sort((a, b) => {
    if (!a.date || !b.date) return 0
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

const normalizeSlugValue = (value) => {
  if (!value) return ''
  let normalized = String(value)
    .trim()
    .replace(/^\/+|\/+$/g, '')
  try {
    normalized = decodeURIComponent(normalized)
  } catch {
    // keep original when URI decoding fails
  }
  return normalized.toLowerCase()
}

export const getPostBySlug = (slug) => {
  const target = normalizeSlugValue(slug)
  return posts.find((post) => normalizeSlugValue(post.slug) === target)
}

export const getAllTags = () => {
  const set = new Set()
  posts.forEach((post) => post.tags.forEach((tag) => set.add(tag)))
  return Array.from(set)
}
