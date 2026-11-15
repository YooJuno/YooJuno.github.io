export const BLOG_CATEGORIES = [
  'Perception',
  'Planning',
  'Control',
  '시스템 통합',
  '웹·보안',
  '개발 환경·배포',
  '트레이딩',
]

export const normalizeBlogCategory = value => {
  const category = value === '로보틱스' ? '시스템 통합' : value
  return BLOG_CATEGORIES.includes(category) ? category : ''
}
