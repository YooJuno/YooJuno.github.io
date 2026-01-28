# YooJuno.github.io (React + Vite)

유준호 포트폴리오 사이트의 React 버전입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

스크립트는 Node 20 환경으로 실행되도록 설정되어 있습니다. (Node 24에서 Vite 빌드가 충돌하는 이슈 대응)

## 빌드

```bash
npm run build
```

## GitHub Pages 배포 (GitHub Actions)

`main` 브랜치에 푸시하면 GitHub Actions가 자동으로 빌드 후 배포합니다.

저장소 설정에서 Pages 소스를 **GitHub Actions**로 설정하세요.

## 정적 파일

PDF(이력서/포트폴리오)와 `.nojekyll`은 `public/`에 두면 빌드 결과에 포함됩니다.
