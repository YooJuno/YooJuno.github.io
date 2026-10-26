# 블로그 관리자

방문자 화면과 관리자 화면은 분리합니다. 기존 글 URL·발행일·본문·이미지를 유지하고, 관리자에서 수정한 내용도 Markdown 파일로 저장합니다. Firebase DB나 Storage는 사용하지 않습니다.

| 화면 | 주소 |
| --- | --- |
| 방문자 블로그 | https://yoojuno.github.io/blog/ |
| 관리자 | https://yoojuno.github.io/admin/ |

## 1. 현재 준비 상태

- Decap CMS 3.17.3을 버전과 SRI 해시로 고정했습니다. 관리자에서만 편집기 스크립트를 불러옵니다.
- 기존 9개 글을 CMS 컬렉션에 연결하고, 기존 폴더 이름을 `slug`로 명시했습니다. 본문·날짜·이미지는 그대로입니다.
- Cloudflare Worker 인증 서버 코드는 `infrastructure/cms-auth/`에 있습니다.
- 배포 주소는 `https://yoojuno-blog-cms-auth.moim-auth-worker.workers.dev`입니다. 현재 관리자 설정에도 연결되어 있습니다.
- GitHub OAuth 앱과 Worker 시크릿 연결을 완료했고 `/health` 준비 응답을 확인했습니다. 본인 계정의 최초 OAuth 승인은 관리자에서 진행합니다. 새 환경에 배포할 때는 아래 연결 절차를 따릅니다.
- 로컬 편집은 OAuth 없이 사용할 수 있습니다. 로컬 모드에서는 GitHub에 쓰지 않습니다.

## 2. GitHub 로그인 연결

### 인증 서버 배포

Cloudflare에 로그인한 터미널에서 저장소 루트를 기준으로 실행합니다.

```bash
npx wrangler@4.153.0 deploy --config infrastructure/cms-auth/wrangler.toml
```

출력되는 `https://yoojuno-blog-cms-auth.<계정>.workers.dev` 주소를 기록합니다.
`wrangler.toml`에는 공개 설정만 두며, 시크릿이나 개인 액세스 토큰을 커밋하지 않습니다.

### GitHub OAuth 앱 등록

[GitHub OAuth 앱 등록](https://github.com/settings/applications/new) 화면에서 다음 항목을 설정합니다.

| 항목 | 값 |
| --- | --- |
| Application name | Yoo Juno Blog Admin |
| Homepage URL | https://yoojuno.github.io/admin/ |
| Redirect URI / Authorization callback URL | https://yoojuno-blog-cms-auth.moim-auth-worker.workers.dev/callback |

Client ID와 생성한 Client Secret은 Cloudflare 대시보드의 해당 Worker **Settings → Variables and Secrets**에 각각 `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`이라는 Secret으로 추가합니다. 저장 후 새 버전을 배포합니다.

터미널을 이용하려면 아래 명령의 입력 프롬프트에 값을 붙여넣습니다. 명령 인자·채팅·저장소 파일에 시크릿을 적지 않습니다.

```bash
npx wrangler@4.153.0 secret put GITHUB_CLIENT_ID --config infrastructure/cms-auth/wrangler.toml
npx wrangler@4.153.0 secret put GITHUB_CLIENT_SECRET --config infrastructure/cms-auth/wrangler.toml
```

`public/admin/settings.json`의 `oauthBaseUrl`에 Worker의 HTTPS 원점 주소를 입력합니다. `/auth`, `/callback` 등의 경로는 붙이지 않습니다. 이미 실제 배포 주소가 들어 있다면 변경하지 않습니다.

Worker의 `/health`가 HTTP 200과 `{"ready":true}`를 반환하면 관리자 화면을 새로고침합니다. 이 검사는 환경변수 존재만 확인하며, 실제 OAuth 앱 설정의 유효성은 첫 로그인으로 확인해야 합니다. 잘못된 시크릿도 준비 상태로 표시될 수 있습니다.

### 인증 경계

- `YooJuno` 계정이며 대상 저장소에 쓰기 권한이 있는 사용자만 토큰을 전달받습니다.
- 로그인 요청은 지정된 사이트 도메인만 허용하고, 무작위 state와 Secure·HttpOnly·SameSite=Lax 쿠키로 요청을 연결합니다.
- 팝업 메시지는 정확한 관리자 원점과 opener에만 전달합니다. 인증 응답은 저장·캐시·로그하지 않습니다.
- GitHub OAuth 토큰은 클라이언트에서 Decap이 사용합니다. 이 방식의 `public_repo` 범위는 해당 계정의 공개 저장소에 대한 권한이며 **이 저장소만으로 한정된 토큰이 아닙니다**. 공용 PC에서 사용하지 말고, 사용 후 로그아웃합니다.
- 앱 접근을 해제하려면 [GitHub Authorized OAuth Apps](https://github.com/settings/applications)에서 승인 취소합니다.
- Wildcard matching과 Device Flow는 사용하지 않습니다. OAuth 앱의 사용자 액세스 토큰 만료를 켜도 로그인할 수 있지만, 현재 Worker는 refresh token 자동 갱신을 제공하지 않으므로 만료 후에는 다시 로그인합니다.
- CMS 설정에서 블로그만 표시하는 것은 편집 UI 범위이며, GitHub 저장소 권한을 폴더 단위로 제한하는 보안 장치는 아닙니다.

## 3. 작성·수정·발행

1. `/admin/`에 접속해 GitHub 계정으로 로그인합니다.
2. **블로그 글**에서 기존 글을 선택하거나 새 글을 만듭니다.
3. 제목·주소·날짜·카테고리·태그·요약과 본문을 작성합니다.
4. 사진은 서식 모드에서 **구성요소 추가(+) → Image → 이미지 선택 → 업로드**로 추가하고 미리보기에서 확인합니다. Markdown 모드에서는 이미 저장한 이미지의 상대 경로를 직접 입력할 수도 있습니다.
5. 초안을 저장하고 편집 워크플로에서 검토·발행합니다.

기존 글의 주소는 저장 전 훅과 빌드 검사에서 변경을 막습니다. 글 제목은 자유롭게 바꿀 수 있습니다. `Trading_beginner`처럼 기존 주소에 포함된 대문자·밑줄도 유지합니다.

코드·표·수식이 많은 자료는 기본 Markdown 모드에서 편집합니다. 서식 편집 모드도 제공하지만, 모드를 전환하면 Markdown 표현이 재직렬화될 수 있으므로 원문 보존이 중요하면 변경 이력을 확인합니다. 미리보기는 실제 블로그의 글 구조와 유사한 별도 스타일이며, 본문 렌더러와 완전히 동일하지는 않습니다.

### 발행 흐름

```text
관리자 저장 → cms/ 초안 브랜치·PR
관리자 발행 → dev
Publish blog content → 콘텐츠 변경만인지 확인 → 린트·글 검사·빌드
성공 → main 병합 → Deploy to GitHub Pages 실행
```

- `dev`에 블로그 외 코드 변경이 남아 있으면 자동 병합하지 않습니다. 해당 코드를 검증해 수동으로 `main`에 병합한 뒤, 필요하면 **Publish blog content**를 수동 실행합니다.
- 자동 병합은 충돌을 강제로 해결하거나 `main`을 덮어쓰지 않습니다. 검사·충돌·푸시가 실패하면 기존 공개 버전을 유지합니다.
- `main`의 Pages 배포도 별도로 린트·글 검사·빌드를 수행합니다. GitHub Actions 토큰의 푸시가 다른 워크플로를 자동 시작하지 않는 점을 고려해 배포를 명시적으로 실행합니다.
- 발행은 즉시 실시간 반영이 아니라 검사·빌드·배포 완료 후 반영됩니다. Actions에서 결과를 확인합니다.
- 저장소의 브랜치 보호·Actions 쓰기 권한 정책에 따라 자동 병합이 거부될 수 있습니다. 보호 설정을 임의로 해제하지 말고 검증한 PR을 직접 병합합니다.

공개 저장소의 초안은 비공개 저장소가 아닙니다. 블로그에 표시되지 않아도 GitHub의 브랜치·PR에서 읽을 수 있으며, 발행 후 삭제해도 Git 이력에 남을 수 있습니다.

## 4. 로컬 편집

의존성을 설치한 뒤 두 터미널에서 실행합니다.

```bash
npm run dev
```

```bash
npm run cms:proxy
```

Vite가 표시한 로컬 주소의 `/admin/`으로 접속합니다. 로컬 서버가 없으면 안내만 표시하며, 원격 GitHub 저장소로 자동 전환하지 않습니다.

로컬 프록시는 인증 없이 파일을 수정하는 개발 도구입니다. `decap-server`의 기본 루프백 바인딩과 로컬 Origin 제한을 유지하고 인터넷·공용 LAN에 노출하지 않습니다. `MODE=fs`가 기본이며, 모든 변경을 커밋할 수 있는 `MODE=git`은 이 프로젝트에서 사용하지 않습니다.

로컬 저장 후에는 `git diff`를 확인하고 기존 개발 브랜치 절차로 검사·커밋·통합합니다.

## 5. 백업·복원

```bash
npm run blog:backup
```

`.backups/blog/<UTC 시각>/`에 `blog.tar.gz`와 `manifest.json`을 생성합니다. 압축에는 글과 모든 이미지가 들어 있고, manifest에는 원본 커밋과 파일별 SHA-256, 압축 파일 SHA-256이 들어 있습니다. `.backups/`는 Git·배포 대상에서 제외합니다. 필요한 경우 이 폴더를 별도 디스크에 복사합니다.

CMS 연결 전 최초 백업은 `.backups/blog/2026-10-26T14-37-33-039Z/`입니다. 원본 기준 커밋은 `7e90138`이며 `backup/blog-before-cms-2026-10-26` 태그로도 보존합니다.

압축을 복원할 때는 먼저 별도 임시 폴더에 풉니다. 기존 작업 폴더에 바로 덮어쓰지 않습니다.

```bash
mkdir -p /tmp/blog-restore
tar -xzf .backups/blog/<백업 시각>/blog.tar.gz -C /tmp/blog-restore
```

복원본과 현재 파일을 비교한 뒤 필요한 글만 복사합니다. Git 이력에서도 변경 전 내용을 복구할 수 있습니다.

## 6. 검증 범위와 제한

- `npm run blog:check`: 필수 필드·날짜·주소 중복·폴더 일치·Markdown 이미지 경로.
- `npm run lint`, `npm run build`: 코드·콘텐츠 파이프라인과 배포 결과.
- 이미지 경로 검사는 Markdown 이미지 문법을 대상으로 합니다. 임의의 HTML·외부 이미지 서버 상태까지 보장하지 않습니다.
- 공개 본문은 기존처럼 저장소 작성자를 신뢰하는 Markdown 렌더링입니다. 외부 사용자에게 글 쓰기 권한을 개방하지 않습니다.
- 현재 글별 HTML은 head만 사전 생성하고 본문은 브라우저에서 렌더링합니다. CMS 도입 자체가 본문 SSG나 검색 색인을 보장하지는 않습니다.
- 원본 글의 기술 내용·이미지 문구를 CMS 도입 과정에서 자동 교정하지 않습니다.
- `npm audit`는 기존 의존성과 로컬 CMS 개발 도구의 전이 의존성에 보안 경고를 보고합니다. 린트·빌드 통과가 취약점 부재를 뜻하지는 않습니다. 개발 프록시는 로컬 전용으로 유지하고, 관련 패키지 업데이트는 호환성을 검증해 별도로 진행합니다.

## 7. 무료 운영 범위

- Decap CMS는 오픈소스 편집기를 사용하며 유료 Turbo 서비스를 연결하지 않습니다.
- GitHub Pages와 일반 Ubuntu Actions 러너를 사용하는 공개 저장소 배포를 유지합니다.
- 인증 서버는 Workers Free에서 실행 가능한 구성입니다. DB·KV·R2·Firebase Storage·유료 도메인을 추가하지 않았고, 요금제·결제 설정도 변경하지 않았습니다.
- Workers Free의 하루 100,000 요청·요청당 CPU 10ms 한도를 전제로 합니다. 한도는 계정 내 다른 Worker와 공유될 수 있습니다. 무제한 무료 서비스는 아닙니다.
- 계정의 기존 유료 구독 여부까지 보장하는 설정은 아닙니다. 대시보드의 **Workers & Pages → Plans**에서 Free 여부를 확인합니다. 계정의 요금제를 임의로 변경하지 않습니다.

요금 기준: [Workers 요금](https://developers.cloudflare.com/workers/platform/pricing/), [GitHub Actions](https://docs.github.com/en/billing/concepts/product-billing/github-actions), [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

참고: [Decap 폴더·이미지 설정](https://decapcms.org/docs/collection-folder/), [OAuth 연결](https://decapcms.org/docs/backends-overview/), [로컬 프록시](https://decapcms.org/docs/decap-proxy/).
