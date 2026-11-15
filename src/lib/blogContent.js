import { parseFrontMatter } from './frontMatter.js'
import { BLOG_CATEGORIES } from './blogCategories.js'

export const parseBlogPost = (raw, slugFromPath) => {
  const { data, content } = parseFrontMatter(raw)
  const slug = data.slug || slugFromPath
  const fail = message => { throw new Error(`${slugFromPath}/index.md: ${message}`) }

  if (typeof slug !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(slug)) {
    fail('글 주소는 영문·숫자·하이픈·밑줄만 사용할 수 있습니다.')
  }
  if (slug !== slugFromPath) fail('slug와 글 폴더 이름이 달라 기존 주소가 변경될 수 있습니다.')
  for (const field of ['title', 'date', 'category', 'summary']) {
    if (typeof data[field] !== 'string' || !data[field].trim()) fail(`${field}를 입력해주세요.`)
  }
  if (!BLOG_CATEGORIES.includes(data.category)) {
    fail(`category는 ${BLOG_CATEGORIES.join(', ')} 중에서 선택해주세요.`)
  }
  const isDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value
  if (!isDate(data.date)) {
    fail('작성일은 유효한 YYYY-MM-DD 날짜여야 합니다.')
  }
  const updated = data.updated === '' || data.updated === null ? undefined : data.updated
  if (updated !== undefined && !isDate(updated)) {
    fail('최종 수정일은 유효한 YYYY-MM-DD 날짜여야 합니다.')
  }
  if (updated && updated < data.date) {
    fail('최종 수정일은 작성일보다 빠를 수 없습니다.')
  }
  if (!Array.isArray(data.tags) || !data.tags.every(tag => typeof tag === 'string' && tag.trim())) {
    fail('tags는 비어 있지 않은 문자열 목록이어야 합니다.')
  }
  if (!content.trim()) fail('본문이 비어 있습니다.')

  return { ...data, slug, updated, tags: [...new Set(data.tags)], content }
}
