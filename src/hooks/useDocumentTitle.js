import { useEffect } from 'react'

const SITE_NAME = 'Yoo Juno'
const HOME_TITLE = 'Yoo Juno · 로보틱스·컴퓨터비전 개발자'
const DEFAULT_DESCRIPTION =
  '로보틱스·컴퓨터비전·임베디드 중심의 시스템 통합 개발자 유준호 포트폴리오'

// 라우트별 <title>과 meta description을 갱신한다.
//
// 이 사이트는 클라이언트 렌더링 SPA라 적용 범위에 한계가 있다.
// - 반영됨: 브라우저 탭/북마크/방문기록, JS를 실행하는 검색엔진(Google 등)
// - 반영 안 됨: JS를 실행하지 않는 SNS 링크 미리보기 크롤러
//   (카카오톡/슬랙/X 등) → index.html의 정적 og 태그가 대신 처리한다.
const useDocumentTitle = (title, description) => {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_NAME}` : HOME_TITLE

    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute('content', description || DEFAULT_DESCRIPTION)
    }
  }, [title, description])
}

export default useDocumentTitle
