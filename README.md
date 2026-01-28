# YooJuno.github.io (React + Vite)

유준호 포트폴리오 + 기술 블로그를 위한 React 기반 정적 사이트입니다.

## 기술 스택

- React 18 + Vite 5
- 라우팅: React Router (HashRouter)
- 블로그: Markdown + Frontmatter (gray-matter, marked)
- 배포: GitHub Actions → GitHub Pages
- Node: 20 (빌드 안정성 확보)

## 라우팅 구조

- `/` : 홈 (간단 소개)
- `/portfolio` : 포트폴리오 전체
- `/blog` : 블로그 목록 (검색/태그/카테고리)
- `/blog/:slug` : 글 상세

> GitHub Pages 환경을 고려해 HashRouter를 사용합니다.

## 폴더 구조

- `src/App.jsx`: 라우팅/레이아웃
- `src/pages/`: 홈/포트폴리오/블로그 페이지
- `src/index.css`: 전역 스타일
- `src/content/blog/`: Markdown 글
- `src/lib/posts.js`: 글 로딩/파싱
- `.github/workflows/deploy.yml`: GitHub Actions 배포 파이프라인

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

설정 경로:
- GitHub 저장소 → **Settings → Pages → Source: GitHub Actions**

## 블로그 글 작성

`src/content/blog/`에 Markdown 파일을 추가합니다.

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

- `summary`가 없으면 본문 일부가 자동 요약으로 사용됩니다.
- 목록 페이지에서 검색/태그/카테고리 필터가 동작합니다.

## 정적 파일

PDF(이력서/포트폴리오)와 `.nojekyll`은 `public/`에 두면 빌드 결과에 포함됩니다.
