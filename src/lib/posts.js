import { marked } from 'marked'

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

const resolveImageSrc = (href, baseDir) => {
  if (!href || typeof href !== 'string') return href
  if (href.startsWith('/') || isExternalLink(href)) return href
  const [pathPart, suffix = ''] = href.split(/(?=[?#])/)
  const cleaned = pathPart.replace(/^\.\//, '')
  if (cleaned.startsWith('../')) return href
  const key = `${baseDir}${cleaned}`
  const resolved = imageModules[key]
  if (!resolved) return href
  return `${resolved}${suffix}`
}

// 본문 이미지는 화면에 들어올 때 로드한다.
// 이미지가 많은 글(예: SLAM 글 25장, 13MB)에서 진입 즉시 전부 받는 것을 막는다.
const withLazyLoading = (html) =>
  html.replace(/^<img /, '<img loading="lazy" decoding="async" ')

const createRenderer = (baseDir) => {
  const renderer = new marked.Renderer()
  const originalImage = renderer.image.bind(renderer)
  renderer.image = (token) => {
    if (!token || typeof token !== 'object') return originalImage(token)
    const resolved = resolveImageSrc(token.href, baseDir)
    return withLazyLoading(originalImage({ ...token, href: resolved }))
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
