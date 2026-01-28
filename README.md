# Yoo Juno Portfolio

로보틱스·컴퓨터비전·임베디드 중심의 개인 포트폴리오 웹페이지입니다.

## Live
- https://<GitHub아이디>.github.io

## Stack
- HTML / CSS / JavaScript (Vanilla)
- GitHub Pages

## Structure
- `index.html` : 메인 페이지
- `assets/css/portfolio.css` : 스타일
- `assets/js/portfolio.js` : 인터랙션
- `assets/images/` : 이미지(추가 예정)
- `포트폴리오_유준호.pdf`, `이력서_유준호.pdf`

## Update Guide
- 이미지 교체: `index.html`의 `<figure class="media-tile">` 안 `div.media-placeholder`를 `<img>`로 교체
- 내용 수정: `index.html` 텍스트 편집
- 스타일 조정: `assets/css/portfolio.css`

## Deploy
```bash
git add -A
git commit -m "update"
git push
```

GitHub Pages: Settings -> Pages -> main / root
