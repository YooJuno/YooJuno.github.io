import { parseFrontMatter } from './frontMatter.js'

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
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || Number.isNaN(Date.parse(data.date)) ||
      new Date(data.date).toISOString().slice(0, 10) !== data.date) {
    fail('발행일은 유효한 YYYY-MM-DD 날짜여야 합니다.')
  }
  if (!Array.isArray(data.tags) || !data.tags.every(tag => typeof tag === 'string' && tag.trim())) {
    fail('tags는 비어 있지 않은 문자열 목록이어야 합니다.')
  }
  if (!content.trim()) fail('본문이 비어 있습니다.')

  return { ...data, slug, tags: [...new Set(data.tags)], content }
}
