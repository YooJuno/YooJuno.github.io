import { parse } from 'yaml'

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/

export const parseFrontMatter = (raw) => {
  const cleaned = raw.replace(/^\uFEFF/, '')
  const match = cleaned.match(FRONT_MATTER)
  if (!match) return { data: {}, content: cleaned }
  const data = parse(match[1], { maxAliasCount: 20 }) ?? {}
  if (typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Frontmatter는 YAML 객체여야 합니다.')
  }

  return { data, content: cleaned.slice(match[0].length) }
}
