// 라우트 메타데이터 단일 출처.
//
// 런타임에서는 useDocumentTitle 이, 빌드 시에는 vite.config.js 의 프리렌더
// 플러그인이 같은 값을 읽는다. 한쪽에만 고치면 화면과 검색 결과가 어긋나므로
// 라우트를 추가/수정할 때는 이 파일만 고치면 된다.
//
// 순수 ESM 이어야 한다. vite.config.js 가 Node 에서 직접 import 하므로
// React 나 import.meta.glob 같은 번들러 전용 문법을 넣으면 안 된다.

export const SITE_URL = 'https://yoojuno.github.io'
export const SITE_NAME = 'Yoo Juno'
export const HOME_TITLE = 'Yoo Juno · 로보틱스·컴퓨터비전 개발자'
export const DEFAULT_DESCRIPTION =
  '로보틱스·컴퓨터비전·임베디드 중심의 시스템 통합 개발자 유준호 포트폴리오'

// title 이 빈 문자열이면 HOME_TITLE 을 그대로 쓴다.
export const ROUTE_META = {
  '/': {
    title: '',
    description: DEFAULT_DESCRIPTION,
  },
  '/portfolio': {
    title: '포트폴리오',
    description: '로보틱스·컴퓨터비전·임베디드 프로젝트와 경험을 정리한 포트폴리오입니다.',
  },
  '/blog': {
    title: '블로그',
    description: '개발 과정과 기술 메모를 기록합니다.',
  },
  '/web-service': {
    title: '웹서비스',
    description: '개발하거나 운영 중인 웹서비스 모음입니다.',
  },
  '/web-service/blog': {
    title: 'Portfolio & Blog',
    description: '포트폴리오와 기술 기록을 관리하는 사이트의 구조와 기능 정리.',
  },
  '/web-service/cctv-streaming': {
    title: 'CCTV Streaming',
    description: '장거리 무선 환경을 위한 영상 모니터링 서비스.',
  },
  '/web-service/video-chatting': {
    title: 'Video Chatting',
    description: '브라우저 기반 실시간 영상 통화 서비스.',
  },
  '/web-service/bitcoin-auto-trader': {
    title: 'Bitcoin Auto Trader',
    description: '전략 설정과 자동매매 실행을 연결한 서비스.',
  },
}

// 페이지 제목을 문서 <title> 형태로 만든다.
export const formatTitle = (title) => (title ? `${title} · ${SITE_NAME}` : HOME_TITLE)

// 프리렌더된 경로는 하위 디렉터리로 제공되어 /portfolio/ 처럼 끝에 슬래시가
// 붙은 채 들어온다. 경로를 비교할 때는 항상 이 함수를 거쳐야 한다.
export const normalizePathname = (pathname) =>
  pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
