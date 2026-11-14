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
export const HOME_TITLE = '유준호 · 자율주행 로봇 개발자'
export const DEFAULT_DESCRIPTION =
  '자율주행 로봇 개발자 유준호의 포트폴리오. 3D SLAM·Navigation 연구, 로봇·센서 통합과 배포 자동화 경험을 소개합니다.'

// title 이 빈 문자열이면 HOME_TITLE 을 그대로 쓴다.
export const ROUTE_META = {
  '/': {
    title: '',
    description: DEFAULT_DESCRIPTION,
  },
  '/portfolio': {
    title: '포트폴리오',
    description: '위고로보틱스에서의 3D SLAM·Navigation 연구개발과 자율주행 로봇 개발 경력, 로보틱스·컴퓨터비전 프로젝트를 소개합니다.',
  },
  '/blog': {
    title: '블로그',
    description: '개발 과정과 기술 메모를 기록합니다.',
  },
  '/web-service': {
    title: '웹서비스',
    description: '웹서비스의 화면·기능·API와 소스 코드를 정리했습니다.',
  },
  '/web-service/blog': {
    title: 'Portfolio & Blog',
    description: '포트폴리오와 기술 기록을 관리하는 사이트의 구조와 기능 정리.',
  },
  '/web-service/moim': {
    title: '모임 · moim',
    description: 'React·Firebase 기반 모임 운영 서비스. 가입 승인, 일정 투표, 캘린더·게시판·회계와 외부 서비스 연동의 구현.',
  },
  '/web-service/map-editor': {
    title: 'Map Editor',
    canonicalRoute: '/utilities/map-editor',
    description: 'PGM/YAML 지도와 Nav2 금지·속도 마스크를 편집하는 웹·데스크톱 도구. 지도 좌표 처리, Firebase 공유 워크스페이스와 화면·파일 인터페이스를 정리했습니다.',
  },
  '/web-service/cctv-streaming': {
    title: 'CCTV Streaming',
    description: 'ESP32-CAM USB 설치·JPEG push 송출, MJPEG·HLS 재생과 카메라별 송출 설정을 관리하는 웹 관제 앱.',
  },
  '/web-service/video-chatting': {
    title: 'Pair · Video Chatting',
    description: 'WebRTC 학습용 1:1 랜덤 매칭·초대방 통화, 장치 권한 안내·채팅 읽기 위치·세션별 송신 처리의 구현과 API.',
  },
  '/web-service/bitcoin-auto-trader': {
    title: 'BTC Auto Trader',
    description: 'Upbit 자동매매 콘솔의 기능·구조·API와 예시 데이터로 제공하는 공개 미리보기.',
  },
  '/web-service/hellog': {
    title: 'HelloG',
    description: 'React·Firebase 기반 운동 기록 앱. 세트 입력, 기록 탐색, 개인 기구 관리와 사용자별 데이터 구조.',
  },
  '/utilities': {
    title: '유틸리티',
    description: '직접 쓰기 위해 만든 LiDAR 분석·지도 편집·시스템 관리 프로그램의 목적, 사용 화면과 구현.',
  },
  '/utilities/lidar-studio': {
    title: 'LiDAR Studio',
    description: '점군·센서 파노라마 탐색, 지면 분리, 객체 검출과 ROI 데이터 추출을 위한 데스크톱 도구.',
  },
  '/utilities/map-editor': {
    title: 'Map Editor',
    description: 'PGM/YAML 지도와 Nav2 금지·속도 마스크 편집기. 모바일 터치 편집과 웹·데스크톱 파일 처리를 지원합니다.',
  },
  '/utilities/ubuntu-status-bar': {
    title: 'Ubuntu Status Bar',
    description: 'Ubuntu GNOME 상단 패널에서 CPU·GPU·메모리·저장장치 상태를 확인하는 확장.',
  },
  '/utilities/volidge': {
    title: 'Volidge',
    description: 'macOS 오디오 인터페이스의 출력 음량을 키보드로 조절하는 가상 오디오 브리지.',
  },
  '/utilities/capture-board-viewer': {
    title: 'Capture Viewer',
    description: 'USB HDMI 캡처보드 영상 확인, 장치 재연결, 전체 화면과 PNG 저장을 위한 데스크톱 앱.',
  },
  '/utilities/wifi-analyzer': {
    title: 'WiFi Analyzer',
    description: 'Wi-Fi 신호·채널·네트워크 경로 진단과 CSV·JSONL 연속 측정을 지원하는 다중 플랫폼 도구.',
  },
}

// 페이지 제목을 문서 <title> 형태로 만든다.
export const formatTitle = (title) => (title ? `${title} · ${SITE_NAME}` : HOME_TITLE)

// 프리렌더된 경로는 하위 디렉터리로 제공되어 /portfolio/ 처럼 끝에 슬래시가
// 붙은 채 들어온다. 경로를 비교할 때는 항상 이 함수를 거쳐야 한다.
export const normalizePathname = (pathname) =>
  pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
