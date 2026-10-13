import { marked } from 'marked'
import { parseFrontMatter } from './frontMatter.js'

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]))

const meaningfulTokens = (token) => (token.tokens || []).filter(item => item.type !== 'text' || item.text.trim())
const onlyTokens = (token, type) => {
  const tokens = meaningfulTokens(token)
  return tokens.length > 0 && tokens.every(item => item.type === type)
}

const resolveAsset = (href, baseDir, assets, file) => {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|\/|#)/i.test(href)) return href
  const suffixIndex = href.search(/[?#]/)
  const path = suffixIndex === -1 ? href : href.slice(0, suffixIndex)
  const suffix = suffixIndex === -1 ? '' : href.slice(suffixIndex)
  let decoded = path
  try {
    decoded = decodeURIComponent(path)
  } catch {
    throw new Error(`${file}: 파일 경로를 확인하세요: ${href}`)
  }
  const key = `${baseDir}${decoded.replace(/^\.\//, '')}`
  if (!assets[key]) throw new Error(`${file}: 참조한 파일을 찾을 수 없습니다: ${href}`)
  return `${assets[key]}${suffix}`
}

const renderMarkdown = (content, entry, baseDir, assets, file, kind) => {
  const renderer = new marked.Renderer()
  const originalImage = renderer.image.bind(renderer)
  const originalParagraph = renderer.paragraph.bind(renderer)
  const renderLink = (token, chip = false) => {
    if (!token.href) return `<span class="chip-link muted">${renderer.parser.parseInline(token.tokens)}</span>`
    const href = resolveAsset(token.href, baseDir, assets, file)
    const external = /^(?:https?:\/\/|\/\/)/i.test(href) || /\.pdf(?:[?#]|$)/i.test(href)
    const brand = /^https?:\/\/(?:www\.)?github\.com\//i.test(href) ? ' github icon-link'
      : /^https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\//i.test(href) ? ' youtube icon-link' : ''
    const className = chip ? ` class="chip-link${brand}"` : ''
    const label = `${entry.title || entry.organization} ${token.text}${external ? ' (새 창)' : ''}`
    const attributes = external ? ' target="_blank" rel="noreferrer"' : ''
    return `<a${className} href="${escapeHtml(href)}" aria-label="${escapeHtml(label)}"${attributes}>${renderer.parser.parseInline(token.tokens)}</a>`
  }

  renderer.link = token => renderLink(token)
  renderer.image = token => originalImage({ ...token, href: resolveAsset(token.href, baseDir, assets, file) })
    .replace(/^<img /, '<img loading="lazy" decoding="async" ')
  renderer.paragraph = (token) => {
    const tokens = meaningfulTokens(token)
    if (onlyTokens(token, 'codespan')) {
      return `<div class="tag-row">${tokens.map(item => `<span>${escapeHtml(item.text)}</span>`).join('')}</div>\n`
    }
    if (onlyTokens(token, 'link')) {
      return `<div class="detail-links">${tokens.map(item => renderLink(item, true)).join(' ')}</div>\n`
    }
    if (onlyTokens(token, 'image')) {
      return `<div class="media-grid">${tokens.map(item => `<figure class="media-tile">${renderer.image(item)}<figcaption>${escapeHtml(item.title || item.text)}</figcaption></figure>`).join('')}</div>\n`
    }
    return originalParagraph(token)
  }

  let html = ''
  let section = []
  const flushSection = () => {
    if (!section.length) return
    const className = kind === 'career' ? 'career-responsibility' : 'detail-note'
    html += `<div class="${className}">${marked.parser(section, { renderer })}</div>\n`
    section = []
  }
  for (const token of marked.lexer(content)) {
    if (token.type === 'heading' && token.depth === 4) {
      flushSection()
      section.push(token)
    } else if (token.type === 'heading' || (token.type === 'paragraph'
      && ['codespan', 'link', 'image'].some(type => onlyTokens(token, type)))) {
      flushSection()
      html += marked.parser([token], { renderer })
    } else if (section.length) {
      section.push(token)
    } else {
      html += marked.parser([token], { renderer })
    }
  }
  flushSection()
  return html
}

const validDate = (value, kind) => {
  if (!/^\d{4}-(0[1-9]|1[0-2])(?:-(0[1-9]|[12]\d|3[01]))?$/.test(value)) return false
  if (kind === 'project' && value.length !== 7) return false
  const fullDate = value.length === 7 ? `${value}-01` : value
  const timestamp = Date.parse(fullDate)
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === fullDate
}

export const createPortfolioEntries = (modules, assets, kind) => {
  const ids = new Set()
  const entries = []
  for (const [file, raw] of Object.entries(modules)) {
    const { data, content } = parseFrontMatter(raw)
    if (data.draft === 'true' || data.draft === true) continue
    const slug = file.split('/').at(-2)
    const entry = { ...data, id: data.id || `${kind === 'project' ? 'proj' : 'career'}-${slug}` }
    const required = kind === 'project' ? ['title', 'start', 'end'] : ['organization', 'role', 'type', 'start']
    for (const field of required) {
      if (typeof entry[field] !== 'string' || !entry[field].trim()) throw new Error(`${file}: ${field} 값을 입력하세요.`)
    }
    const idPattern = kind === 'project' ? /^proj-[a-z0-9-]+$/ : /^(?:career|experience)-[a-z0-9-]+$/
    if (!idPattern.test(entry.id)) throw new Error(`${file}: id 형식을 확인하세요: ${entry.id}`)
    if (ids.has(entry.id)) throw new Error(`${file}: id가 중복됩니다: ${entry.id}`)
    ids.add(entry.id)
    if (!validDate(entry.start, kind) || (entry.end && !validDate(entry.end, kind))) throw new Error(`${file}: 날짜 형식을 확인하세요.`)
    if (entry.end && entry.end < entry.start) throw new Error(`${file}: 종료일은 시작일 이후여야 합니다.`)
    entry.end = entry.end || null
    entry.meta = entry.meta || ''
    entry.summary = entry.summary || ''
    entry.hardware = Array.isArray(entry.hardware) ? entry.hardware : entry.hardware ? [String(entry.hardware)] : []
    const baseDir = file.slice(0, file.lastIndexOf('/') + 1)
    entry.html = renderMarkdown(content, entry, baseDir, assets, file, kind)
    entries.push(entry)
  }
  return entries.sort((left, right) => kind === 'career'
    ? (right.end || '9999-12-31').localeCompare(left.end || '9999-12-31') || right.start.localeCompare(left.start)
    : right.start.localeCompare(left.start) || right.end.localeCompare(left.end))
}
