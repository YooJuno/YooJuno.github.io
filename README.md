# YooJuno.github.io (React + Vite)

유준호 포트폴리오 웹사이트의 React 기반 구현입니다. 단일 페이지(Static SPA)이며 GitHub Pages로 배포됩니다.

## 기술 스택

- React 18 + Vite 5
- CSS: 전역 단일 파일 (`src/index.css`)
- 배포: GitHub Actions → GitHub Pages
- Node: 20 (빌드 안정성 확보)

## 구조 요약

- `src/App.jsx`: 전체 페이지 마크업/콘텐츠
- `src/index.css`: 전역 스타일
- `src/main.jsx`: React 진입점
- `public/`: 정적 자산 (PDF, `.nojekyll` 등)
- `.github/workflows/deploy.yml`: Pages 자동 배포 파이프라인

## 개발 환경

```bash
npm install
npm run dev
```

> 스크립트는 Node 20으로 실행되도록 구성되어 있습니다. (Node 24에서 Vite 빌드 충돌 이슈 대응)

## 빌드

```bash
npm run build
```

빌드 결과는 `dist/`에 생성되며, Pages 배포 시 이 디렉터리가 업로드됩니다.

## GitHub Actions 배포

`main` 브랜치에 푸시하면 Actions가 아래 순서로 자동 배포합니다.

1) `npm ci`
2) `npm run build`
3) `dist/`를 Pages 아티팩트로 업로드
4) GitHub Pages 배포

설정 경로:
- GitHub 저장소 → **Settings → Pages → Source: GitHub Actions**

## 정적 파일 규칙

- PDF/이미지 등 정적 파일은 `public/`에 둡니다.
- 링크는 절대 경로(`/파일명`)를 사용합니다.
  - 예: `/포트폴리오_유준호.pdf`, `/이력서_유준호.pdf`

## 내용 수정 가이드

- 프로젝트/문구 수정: `src/App.jsx`
- 색상/레이아웃 수정: `src/index.css`
- 이미지 추가: `public/` 또는 `src/assets/` 후 경로 수정

## 트러블슈팅

- 로컬 빌드가 실패하면 Node 버전을 먼저 확인하세요. (`node -v`)
- Actions 실패 시, Actions 탭의 로그에서 `npm ci` / `npm run build` 단계 확인
