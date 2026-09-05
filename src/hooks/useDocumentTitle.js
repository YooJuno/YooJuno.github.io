import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  DEFAULT_DESCRIPTION,
  ROUTE_META,
  formatTitle,
  normalizePathname,
} from '../lib/routeMeta'

// 라우트별 <title>과 meta description을 갱신한다.
//
// 인자를 주지 않으면 현재 경로에 해당하는 routeMeta 값을 쓴다.
// 글 상세처럼 값이 동적인 화면만 인자로 직접 넘긴다.
//
// 빌드 시 vite.config.js 가 같은 값으로 각 경로의 HTML 을 미리 만들어 두므로
// 최초 응답과 이 훅이 설정하는 값이 일치한다.
const useDocumentTitle = (title, description) => {
  const { pathname } = useLocation()
  const meta = ROUTE_META[normalizePathname(pathname)]
  const resolvedTitle = title ?? meta?.title ?? ''
  const resolvedDescription = description ?? meta?.description ?? DEFAULT_DESCRIPTION

  useEffect(() => {
    document.title = formatTitle(resolvedTitle)

    const tag = document.querySelector('meta[name="description"]')
    if (tag) tag.setAttribute('content', resolvedDescription)
  }, [resolvedTitle, resolvedDescription])
}

export default useDocumentTitle
