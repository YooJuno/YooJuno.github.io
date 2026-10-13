# YooJuno.github.io

개인 포트폴리오와 기술 기록을 운영하기 위한 React 기반 정적 웹사이트입니다.

[운영 사이트](https://yoojuno.github.io/) · 이 문서는 사이트의 구현 방식과 설계 시 중점적으로 다룬 내용을 설명합니다.

## 개발 목표

- **서버 없이 운영:** GitHub Pages의 정적 호스팅 환경에서도 SPA의 직접 주소 접근과 링크 공유가 동작하도록 구성합니다.
- **콘텐츠 유지보수 비용 감소:** 글과 이미지를 함께 관리하고, 동일한 프로젝트 정보를 여러 곳에서 수정하지 않도록 합니다.
- **탐색 안정성과 읽기 경험:** 긴 내용을 단계적으로 펼쳐 보여주되, 주소·브라우저 이력·키보드 탐색을 유지합니다.

## 기술 구성

| 영역 | 사용 기술 | 역할 |
| --- | --- | --- |
| 화면 | React 18 · JavaScript / JSX | 페이지·컴포넌트 구성 |
| 빌드 | Vite 7 | 개발 서버, 번들 분리, 정적 파일 생성 |
| 라우팅 | React Router 7 · BrowserRouter | 페이지 이동과 URL 기반 탐색 |
| 콘텐츠 | Markdown · Frontmatter · marked | 파일 기반 글 관리와 HTML 변환 |
| 스타일 | CSS · 미디어 쿼리 | 공통 스타일과 반응형 레이아웃 |
| 검증·배포 | ESLint · GitHub Actions · GitHub Pages | 코드 검사와 정적 사이트 배포 |

백엔드·DB·CMS 없이 저장소의 콘텐츠를 빌드해 배포합니다.
`/web-service`의 페이지들은 프로젝트 소개이며, 여기서 각 서비스의 백엔드를 실행하는 것은 아닙니다.

## 구조와 처리 흐름

```text
작성
├─ portfolio.js + ProjectEntry → 포트폴리오 데이터와 상세 내용
└─ 글별 index.md + 이미지      → 블로그 콘텐츠

빌드 (Vite)
├─ React 앱                   → 라우트별 JavaScript / CSS 청크
├─ 글 이미지 크기             → 가상 모듈로 전달
└─ routeMeta + 글 메타데이터   → 경로별 HTML의 head + sitemap.xml

배포 (GitHub Actions)
└─ dist/ → GitHub Pages → 브라우저에서 React 앱 실행
```

## 핵심 설계와 구현

### 1. 정적 호스팅에서의 라우팅과 메타데이터

GitHub Pages에는 SPA용 서버 리라이트가 없으므로, 클라이언트 라우터만으로는 하위 주소에 직접 접근하는 문제를 해결할 수 없습니다.
빌드에 등록된 경로마다 `index.html`을 생성하고, 해당 경로의 메타데이터를 미리 넣는 방식으로 대응합니다.

- `/portfolio/`, `/blog/<slug>/` 등에 대응하는 HTML 파일을 빌드 결과에 생성합니다.
- `title`, description, Open Graph, canonical과 `sitemap.xml`을 경로별로 구성합니다.
- 정적 페이지 메타데이터는 `routeMeta.js`를 빌드와 런타임에서 공유합니다. 글별 값은 Frontmatter에서 가져옵니다.
- canonical·sitemap은 끝 슬래시가 있는 주소를 사용하고, 런타임 경로 비교에서는 슬래시를 정규화합니다.
- 미리 생성되지 않은 주소는 `404.html` → `sessionStorage` → 루트 페이지 복구 흐름으로 원래 경로·쿼리·해시를 React Router에 전달합니다.

**본문 SSR이나 전체 페이지 SSG는 아닙니다.** 경로별 HTML의 `head`를 사전 생성하며, 실제 본문은 브라우저에서 React로 렌더링합니다.

구현: [빌드 플러그인](vite.config.js), [공통 메타데이터](src/lib/routeMeta.js), [런타임 갱신](src/hooks/useDocumentTitle.js), [404 복구](public/404.html).

### 2. 글과 이미지를 함께 관리하는 콘텐츠 파이프라인

블로그 글은 `src/content/blog/<slug>/index.md`에 두고, 해당 글의 이미지도 같은 폴더 또는 하위 폴더에 둡니다.
본문에서는 `./image.png` 같은 상대 경로를 사용합니다.

- Vite의 `import.meta.glob`으로 Markdown 원문과 이미지 URL을 수집합니다.
- 필요한 문자열·목록 메타데이터를 내장 Frontmatter 파서로 읽고, `marked`의 커스텀 렌더러로 본문을 변환합니다.
- 상대 이미지 경로를 번들된 URL로 변환하고 `loading="lazy"`, `decoding="async"`를 추가합니다.
- 빌드에서 크기를 확인할 수 있는 PNG·JPEG·SVG 이미지에는 `width`·`height`도 넣어 로딩 중 레이아웃 이동을 줄입니다.
- 본문 제목에는 중복을 구분하는 ID를 생성해 특정 절을 직접 링크할 수 있게 합니다.
- 빌드 시 중복 slug를 검사해 HTML 파일이 조용히 덮어써지는 것을 막습니다.

구현: [글 로딩·렌더링](src/lib/posts.js), [이미지 크기·slug 검사](vite.config.js).

### 3. 데이터 중복을 줄이는 포트폴리오 구성

경력·활동·학력 정보는 `portfolio.js`에 모으고, 컴포넌트는 해당 데이터를 렌더링하도록 분리했습니다.
프로젝트는 `ProjectEntry`에 제목·기간·기관·역할과 상세 내용을 함께 정의합니다.

`ProjectLibrary`는 프로젝트를 **전체 너비의 단일 목록**으로 표시하고, 시작 시점 내림차순으로 정렬합니다.
시작 시점이 같으면 종료 시점이 최신인 항목을 먼저 표시합니다.
별도의 프로젝트 목차나 대표 프로젝트 데이터를 다시 관리하지 않습니다.
기술 이름을 나열하는 독립 섹션 대신, 경력의 수행 업무와 프로젝트 상세의 구현 방식·기술 태그로 실제 적용 경험을 보여줍니다.

상세 내용은 네이티브 `<details>`·`<summary>`로 구현합니다.
간단한 열기·닫기 상태를 별도 React 상태로 중복 관리하지 않고, 기관·역할 또는 프로젝트 제목을 먼저 읽은 뒤 필요한 내용만 펼칠 수 있도록 했습니다.

연락처·문서·프로필 링크는 소개 영역의 보조 정보로 한 번만 표시합니다.
PC에서는 소개 오른쪽, 모바일에서는 소개 아래에 배치해 하단의 별도 연락 영역과 중복 버튼을 없앴습니다.
별도 카드 배경과 강조 버튼 대신 구분선과 문서 링크를 사용해 소개와 같은 시각적 흐름을 유지합니다.
연락 정보와 자료·프로필 링크를 두 묶음으로 나누고, 자료 링크와 소셜 아이콘은 같은 행에서 정렬합니다. 좁은 화면에서는 자동으로 줄바꿈합니다.
GitHub·YouTube·Notion 링크는 SVG 아이콘으로 표시하고, 접근 가능한 이름과 마우스·키보드 포커스 시 이름 안내를 제공합니다.

구현: [포트폴리오 데이터](src/content/portfolio.js), [프로젝트 컴포넌트](src/pages/Portfolio.jsx).

### 4. URL과 연결된 탐색, 접근성, 오류 대응

- 포트폴리오의 위치를 `#career`, `#proj-hangang` 같은 URL 해시에 반영합니다. 새로고침과 뒤로가기·앞으로가기에서도 해당 위치를 탐색합니다.
- 숨겨진 상세 영역으로 직접 접근하면 먼저 펼치고, 고정 메뉴를 피한 위치로 스크롤합니다.
- 상단 섹션 메뉴는 소개·경력·프로젝트만 유지하고, 프로젝트는 제목을 눌러 상세를 펼치도록 구성합니다. 별도 사이드바나 내부 스크롤 영역은 없습니다.
- 기존 `?section=...` 링크를 유지하며, ID는 CSS 선택자 문자열 대신 `getElementById`로 조회해 잘못된 해시가 선택자 예외로 이어지지 않도록 합니다.
- 제거한 기술 역량 영역의 기존 `#skills`·`?section=skills` 링크는 프로젝트 목록으로 연결합니다.
- 기존 `#contact`·`?section=contact` 링크는 소개 영역의 연락·자료 영역으로 연결합니다.
- 이미지 확대 화면은 키보드로 열 수 있고, Tab 포커스를 대화상자 안에 유지합니다. Escape로 닫으면 원래 이미지에 포커스를 돌려줍니다.
- 토글의 `aria-expanded`, 현재 위치의 `aria-current`, 포커스 표시와 `prefers-reduced-motion` 대응을 적용합니다.
- 라우트 영역에 오류 경계를 두어 페이지 렌더링 오류가 전체 탐색 메뉴·푸터까지 제거하지 않도록 합니다. 다른 경로로 이동하면 경계를 다시 마운트합니다.

구현: [탐색·이미지 확대](src/pages/Portfolio.jsx), [라우팅·메뉴](src/App.jsx), [오류 경계](src/components/ErrorBoundary.jsx), [모션 처리](src/hooks/useReveal.js).

### 5. 초기 로딩과 이미지 표시

홈은 즉시 로드하고, 포트폴리오·블로그·웹서비스 페이지는 `React.lazy`와 `Suspense`로 분리했습니다.
홈만 방문할 때 블로그 파서와 모든 글 본문까지 함께 내려받지 않도록 하는 것이 목적입니다.

본문 이미지에는 지연 로딩을 적용하고, 블로그의 확인 가능한 이미지 크기는 빌드에서 계산합니다.
다만 블로그 모듈 자체는 현재 모든 글을 eager 방식으로 수집·변환합니다. **글별 본문까지 개별 지연 로딩하는 구조는 아닙니다.**

구현: [라우트 분리](src/App.jsx), [이미지 렌더링](src/lib/posts.js).

### 6. 검증을 통과한 빌드만 배포

`main` 푸시 또는 수동 워크플로 실행 시 아래 순서로 배포합니다.

```text
Node 20 → npm ci → ESLint → Vite build → dist 아티팩트 업로드 → Pages 배포
```

- 잠금 파일 기반으로 의존성을 설치하고, 린트·빌드 실패 시 배포 단계로 넘어가지 않습니다.
- ESLint로 미정의 JSX 컴포넌트 참조와 React Hooks 규칙 등을 검사합니다.
- Pages 배포는 GitHub Actions 워크플로로 관리하며, 같은 배포 그룹의 중복 실행은 취소합니다.
- 개발은 `dev`에서 작업 브랜치를 만들어 진행하고, 검증 후 `dev`에 병합합니다. `main` 반영이 공개 사이트 배포로 이어집니다.

도구가 자동으로 추가하는 커밋·PR 귀속 문구는 [저장소 설정](.claude/settings.json)에서 비활성화합니다.
기존 커밋 이력이나 실제 작성자 정보는 변경하지 않습니다. [설정 기준](https://code.claude.com/docs/en/settings-reference#attribution).

구현: [ESLint 설정](eslint.config.js), [배포 워크플로](.github/workflows/deploy.yml).

## 로컬 개발

Node 버전은 `.nvmrc`의 20을 기준으로 합니다. `package.json`의 허용 범위는 `^20.19.0 || >=22.12.0`입니다.

```bash
nvm use
npm ci
npm run dev
```

`nvm`을 사용하지 않는다면 호환되는 Node 버전을 직접 설치한 뒤 `npm ci`부터 실행합니다.

| 명령 | 용도 |
| --- | --- |
| `npm run lint` | 코드 정적 검사 |
| `npm run build` | 배포 파일을 `dist/`에 생성 |
| `npm run preview` | 빌드 결과를 로컬에서 확인 |

GitHub 저장소의 **Settings → Pages → Source**는 **GitHub Actions**로 설정합니다.

## 수정 지점

| 변경 대상 | 위치·규칙 |
| --- | --- |
| 경력·활동·학력 | `src/content/portfolio.js` |
| 프로젝트 제목·기간·역할 | `src/pages/Portfolio.jsx`의 `ProjectEntry`: `title`, `start`, `end`, `meta`. 기간은 `YYYY-MM` 형식 |
| 프로젝트 상세·이미지·외부 링크 | 해당 `ProjectEntry`의 `detail-body` |
| 연락처·문서·프로필 링크 | `src/pages/Portfolio.jsx`의 `hero-contact` 영역 (`#contact`) |
| 블로그 글·이미지 | `src/content/blog/<slug>/index.md`와 같은 글 폴더. 메타데이터는 `title`, `date`, `category`, `tags`, `summary`, 선택적인 `slug` |
| 새 페이지·메타데이터 | `src/App.jsx`의 라우트와 `src/lib/routeMeta.js`의 메타데이터를 함께 추가 |
| 스타일 | `src/styles/`의 공통·페이지별 CSS |
| 고정 URL로 제공할 파일 | `public/`. 빌드 시 파일명·경로를 유지해 복사 |

`src`의 글 이미지처럼 코드에서 참조하는 자산은 Vite가 처리하고, `public`의 프로젝트 이미지·PDF 등은 고정 URL로 제공합니다.
따라서 모든 콘텐츠를 한쪽에 몰아넣기보다 **참조 방식과 배포 경로**를 기준으로 구분합니다.

## 현재 범위와 한계

- Frontmatter 파서는 이 저장소에서 사용하는 간단한 문자열·목록 형식을 위한 것으로, 완전한 YAML 파서는 아닙니다.
- Markdown HTML은 저장소 작성자를 신뢰하는 전제입니다. 별도 HTML 정화(sanitization)는 없으므로 외부 사용자 입력을 그대로 렌더링하는 용도로 사용하지 않습니다.
- CI 검증 범위는 린트와 빌드입니다. 저장소에 상시 실행되는 단위·E2E 테스트나 성능 점수 기준은 아직 구성하지 않았습니다.
