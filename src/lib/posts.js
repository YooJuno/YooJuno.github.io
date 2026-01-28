import { marked } from 'marked'

const modules = import.meta.glob('../content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const FRONT_MATTER = /^---\n([\s\S]*?)\n---\n?/

const parseFrontMatter = (raw) => {
  const match = raw.match(FRONT_MATTER)
  if (!match) {
    return { data: {}, content: raw }
  }

  const body = match[1]
  const content = raw.slice(match[0].length)
  const data = {}

  body.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const index = trimmed.indexOf(':')
    if (index === -1) return
    const key = trimmed.slice(0, index).trim()
    let value = trimmed.slice(index + 1).trim()
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    }
    data[key] = value
  })

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

const getReadingMinutes = (content) => {
  const words = content.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

export const posts = Object.entries(modules)
  .map(([path, raw]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '')
    const { data, content } = parseFrontMatter(raw)
    const tags = normalizeTags(data.tags)

    return {
      slug,
      title: data.title || slug,
      date: data.date || '',
      category: data.category || '',
      tags,
      summary: getExcerpt(content, data.summary),
      readingMinutes: getReadingMinutes(content),
      html: marked.parse(content),
      raw: content,
    }
  })
  .sort((a, b) => {
    if (!a.date || !b.date) return 0
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

export const getPostBySlug = (slug) => posts.find((post) => post.slug === slug)

export const getAllTags = () => {
  const set = new Set()
  posts.forEach((post) => post.tags.forEach((tag) => set.add(tag)))
  return Array.from(set)
}

export const getAllCategories = () => {
  const set = new Set()
  posts.forEach((post) => {
    if (post.category) set.add(post.category)
  })
  return Array.from(set)
}
