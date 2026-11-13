# 유틸리티 소개 수정

각 프로그램은 `<id>.json` 한 파일에서 관리합니다. 목록·상세가 같은 데이터를 사용합니다.

## 내용 구성

- `summary`: 목록과 상세에 쓰는 짧은 한 문장.
- `purpose`: 무엇이 불편했고 어떤 작업을 위해 만들었는지 설명합니다. 직접 확인하지 않은 개인 경험이나 성과는 덧붙이지 않습니다.
- `platforms`: 실제 지원하는 OS·데스크톱 환경. 데스크톱 앱에 웹 공개·미공개 상태를 붙이지 않습니다.
- `overview`, `features`, `architecture`, `decisions`: 사용 흐름과 확인한 구현.
- `screens`: 실제 앱 화면, 원본 크기, 대체 텍스트, 출처·예시 데이터 여부와 설명.
- `limitations`: 미지원 기능과 자동 시험·실장비 확인의 차이.
- `downloadUrl`: 이미 배포 파일이 있는 GitHub Releases 주소. 없다면 생략합니다.
- `buildUrl`, `distributionNote`: OS·CPU별 자동 빌드, 태그 릴리스 조건, 서명·공증과 지원 범위.
- `revision`, `reviewedAt`, `sources`: 확인한 전체 커밋 SHA·검토 시각·실제 소스 경로.

REST 서버가 없는 도구에는 `api: []`를 사용합니다. 가상의 API 표는 표시하지 않습니다.

## 화면 추가

`public/content/images/utilities/<id>/`에 PNG를 넣고 `screens`에 등록합니다. `width`·`height`는 원본 픽셀 크기입니다. 화면은 지연 로딩하고 클릭·키보드로 확대합니다. 썸네일에서도 원본 비율을 유지합니다.

밝은 테마가 있는 앱은 밝게 캡처합니다. 어두운 UI만 있는 앱은 원본을 유지하며 색을 반전하거나 없는 테마로 재구성하지 않습니다. 데모 신호·예시 응답·시험 AP를 사용했다면 캡션에서 명시합니다. 개인 SSID·BSSID, 계정·연락처·기밀 자료를 캡처하지 않습니다. 외부 데이터에서 파생된 화면은 원본의 이용 조건·저자·출처를 함께 보존합니다.

WiFi Analyzer 화면은 `tools/capture_preview.py`가 실제 GUI에 예시 데이터를 연결해 생성합니다. Wi-Fi 스캔이나 위치 권한을 요청하지 않습니다. Capture Viewer는 실제 앱의 장치 미사용 데모 모드입니다.

기존 Map Editor 데이터는 이 폴더로 옮겼습니다. `/web-service/map-editor`의 검색 조건·해시는 `/utilities/map-editor`로 연결하며 새 주소만 sitemap에 등록합니다.

새 항목 추가 시 `src/lib/utilities.js`의 순서, `src/App.jsx`의 메뉴, `src/lib/routeMeta.js`도 등록합니다. `npm run utilities:check`, `npm run lint`, `npm run build`로 검사합니다. 이미지 경로·원본 크기·지원 환경·목적·중복 ID·메타데이터는 빌드에서도 검사합니다.
