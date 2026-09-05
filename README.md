# YooJuno.github.io (React + Vite)

유준호 포트폴리오 + 기술 블로그를 위한 React 기반 정적 사이트입니다.

https://yoojuno.github.io/

## 기술 스택

- React 18 + Vite 7
- 라우팅: React Router 7 (BrowserRouter)
- 블로그: Markdown + Frontmatter (내장 파서) + marked
- 배포: GitHub Actions → GitHub Pages
- Node: 20 (`.nvmrc`) — Vite 7 요구사항은 `^20.19.0 || >=22.12.0`

## 라우팅 구조

- `/` : 홈 (간단 소개)
- `/portfolio` : 포트폴리오 전체
- `/blog` : 블로그 목록 (검색/태그/카테고리)
- `/blog/:slug` : 글 상세
- `/web-service` : 웹서비스 목록
- `/web-service/:name` : 웹서비스 상세 (blog / cctv-streaming / video-chatting / bitcoin-auto-trader)

## 폴더 구조

- `src/App.jsx`: 라우팅/레이아웃
- `src/pages/`: 홈/포트폴리오/블로그 페이지
- `src/index.css`: 전역 스타일
- `src/content/blog/<slug>/index.md`: Markdown 글 + Frontmatter
- `src/content/blog/<slug>/*`: 글에 사용하는 이미지
- `src/lib/posts.js`: 글 로딩/파싱
- `src/lib/routeMeta.js`: 라우트별 제목/설명 단일 출처 (런타임·빌드 공용)
- `src/hooks/useDocumentTitle.js`: 라우트별 `<title>`/meta description 갱신
- `src/components/ErrorBoundary.jsx`: 페이지 예외를 가둬 사이트 전체 백지화를 막음
- `vite.config.js`: 빌드 시 라우트별 HTML 프리렌더 + `sitemap.xml` 생성 플러그인 포함
- `public/robots.txt`: 크롤러 안내 + sitemap 위치
- `.github/workflows/deploy.yml`: GitHub Actions 배포 파이프라인
- `public/404.html`: GitHub Pages SPA 리다이렉트
- `index.html`: SPA 리다이렉트 복구 스크립트

## 로컬 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

빌드 결과는 `dist/`에 생성되며, Pages 배포 시 이 디렉터리가 업로드됩니다.

## GitHub Actions 배포

`main` 브랜치에 푸시하면 Actions가 자동으로 배포합니다.
배포 경로는 이 워크플로 하나뿐입니다. (`gh-pages` 수동 배포 스크립트는 제거했습니다.)
워크플로는 `npm ci` → `npm run lint` → `npm run build` 순으로 실행합니다.

설정 경로:
- GitHub 저장소 → **Settings → Pages → Source: GitHub Actions**

## 해시(#) 제거 적용 방식

GitHub Pages는 서버 리라이트가 없어 `/portfolio` 같은 경로로 직접 접근 시 404가 발생합니다.
이를 해결하기 위해 **BrowserRouter + 404 리다이렉트** 패턴을 적용했습니다.

- `public/404.html`에서 잘못된 경로를 `sessionStorage`에 저장 후 `/`로 리다이렉트
- `index.html`에서 `spa-redirect` 값을 읽어 원래 경로로 복구

이렇게 하면 `/#/portfolio` 대신 `/portfolio`로 접근해도 정상 렌더링됩니다.

## 블로그 글 작성

`src/content/blog/<slug>/index.md` 구조로 글을 추가합니다.

Frontmatter 예시:

```md
---
title: "글 제목"
date: "2026-01-28"
category: "카테고리"
tags:
  - tag1
  - tag2
summary: "글 요약"
---

본문 내용...
```

이미지 예시:

```md
![](./image.png)
![](./images/diagram.png)
```

- 이미지 파일은 같은 폴더에 두거나 하위 폴더(`images/`)에 둡니다.

- `summary`가 없으면 본문 일부가 자동 요약으로 사용됩니다.
- 목록 페이지에서 검색/태그/카테고리 필터가 동작합니다.
- `slug`를 Frontmatter에 넣으면 폴더명 대신 해당 값이 사용됩니다.

## SEO / 프리렌더링

GitHub Pages는 실제 파일이 없는 경로에 404를 반환합니다. 따라서 빌드할 때
`vite.config.js`의 플러그인이 **라우트마다 HTML 파일을 생성**합니다.
(`/portfolio` → `dist/portfolio/index.html`)

- 모든 경로가 200으로 응답하며, `404.html` 리다이렉트는 진짜 없는 주소에만 쓰입니다.
- 각 HTML의 `<title>`, description, og 태그, canonical이 경로별 값으로 채워집니다.
  JS를 실행하지 않는 SNS 크롤러도 글마다 다른 링크 미리보기를 얻습니다.
- `sitemap.xml`도 같은 플러그인이 생성합니다.

라우트 메타데이터의 단일 출처는 `src/lib/routeMeta.js`입니다.
런타임에서는 `useDocumentTitle`이, 빌드 시에는 프리렌더 플러그인이 같은 값을 읽으므로
**라우트를 추가하거나 문구를 바꿀 때는 이 파일만 수정**하면 됩니다.
블로그 글은 Frontmatter의 `title`/`summary`/`date`를 그대로 사용합니다.

본문은 여전히 클라이언트에서 렌더링됩니다. 프리렌더되는 것은 `<head>`입니다.

## 정적 파일

PDF(이력서/포트폴리오)와 `.nojekyll`은 `public/`에 두면 빌드 결과에 포함됩니다.
