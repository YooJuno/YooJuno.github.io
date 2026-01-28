# YooJuno.github.io (React + Vite)

유준호 포트폴리오 웹사이트의 React 기반 구현입니다. 정적 페이지이며 GitHub Pages로 배포됩니다.

## 기술 스택

- Frontend: React 18 + Vite 5
- 스타일: 단일 CSS (`src/index.css`)
- 배포: GitHub Actions → GitHub Pages
- Node: 20 (빌드 안정성 확보)

## 폴더 구조

- `src/App.jsx`: 전체 페이지 마크업
- `src/index.css`: 전역 스타일
- `public/`: 정적 자산 (PDF, `.nojekyll` 등)
- `.github/workflows/deploy.yml`: GitHub Actions 배포 파이프라인

## 로컬 실행

```bash
npm install
npm run dev
```

> 스크립트는 Node 20으로 실행되도록 구성되어 있습니다. (Node 24에서 Vite 빌드 충돌 이슈 대응)

## 빌드

```bash
npm run build
```

## GitHub Actions 배포

- `main`에 푸시 → Actions가 자동으로 `npm ci` → `npm run build` → Pages 배포
- 설정: GitHub 저장소 → **Settings → Pages → Source: GitHub Actions**

## 정적 파일

PDF(이력서/포트폴리오)와 `.nojekyll`은 `public/`에 두면 빌드 결과에 포함됩니다.
