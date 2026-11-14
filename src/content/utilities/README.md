# 유틸리티 소개 수정

각 프로그램은 `<id>.json` 한 파일에서 관리합니다. 목록·상세가 같은 데이터를 사용합니다.

## 내용 구성

- `summary`: 목록과 상세에 쓰는 짧은 한 문장.
- `purpose`: 무엇이 불편했고 어떤 작업을 위해 만들었는지 설명합니다. 직접 확인하지 않은 개인 경험이나 성과는 덧붙이지 않습니다.
- `platforms`: 실제 지원하는 OS·데스크톱 환경. 데스크톱 앱에 웹 공개·미공개 상태를 붙이지 않습니다.
- `examples`: 프로그램당 1–3개 사용 예시. `title`·`input`·`steps`(1–5단계)·`result`·`note`로 입력, 실제 조작, 출력·동작, 주의사항을 구분합니다. 실측하지 않은 성능이나 장비 연결 결과는 만들지 않습니다.
- `compatibility`: 플랫폼별 `environment`·배포 `format`·실제 지원 범위 `note`. 단순 OS 나열과 기능 지원을 구분합니다.
- `overview`, `features`, `architecture`, `decisions`: 확인한 구현. 사용 목적이나 화면 설명을 반복하기보다 입력 형식·처리 구조·설계 이유를 적습니다.
- `screens`: 실제 앱 화면, 원본 크기, 대체 텍스트, 출처·예시 데이터 여부와 설명.
- `limitations`: 미지원 기능과 자동 시험·실장비 확인의 차이.
- `downloadUrl`: 이미 배포 파일이 있는 GitHub Releases 주소. 없다면 생략합니다.
- `buildUrl`, `distributionNote`: OS·CPU별 자동 빌드, 태그 릴리스 조건, 서명·공증과 지원 범위.
- `revision`, `reviewedAt`, `sources`: 확인한 전체 커밋 SHA·검토 시각·실제 소스 경로.
- `sourceNote`: 캡처 방법·검증하지 않은 항목·자산 출처. 본문의 기능 설명과 분리해 검토 기록에 모읍니다.

REST 서버가 없는 도구에는 `api: []`를 사용합니다. 가상의 API 표는 표시하지 않습니다.

## 화면 추가

목록에는 이미지 없이 이름·한 줄 설명·지원 환경·상세/GitHub 링크만 표시합니다. 사진은 상세에서만 사용합니다.

`public/content/images/utilities/<id>/`에 PNG를 넣고 `screens`에 등록합니다. `width`·`height`는 원본 픽셀 크기입니다. 상세의 첫 화면은 바로 로드하고 갤러리 선택 썸네일은 지연 로딩합니다. 선택 버튼으로 큰 화면과 설명을 함께 전환하며 클릭·키보드로 원본 크기까지 확대할 수 있습니다. 이미지 비율은 유지하고, 자동 재생이나 갤러리 내부 스크롤은 사용하지 않습니다.

상세는 화면 갤러리 → 만든 목적 → 사용 예시 → 주요 기능 → 구현 → 지원 환경 → 소스 순서입니다. 자동 배포·검토 기록과 Map Editor의 세부 인터페이스는 접어서 표시합니다. 제약 사항은 접지 않으며 예시 화면에는 실제 측정처럼 오해할 수 없도록 캡션을 붙입니다.

밝은 테마가 있는 앱은 밝게 캡처합니다. 어두운 UI만 있는 앱은 원본을 유지하며 색을 반전하거나 없는 테마로 재구성하지 않습니다. 데모 신호·예시 응답·시험 AP를 사용했다면 캡션에서 명시합니다. 개인 SSID·BSSID, 계정·연락처·기밀 자료를 캡처하지 않습니다. 외부 데이터에서 파생된 화면은 원본의 이용 조건·저자·출처를 함께 보존합니다.

WiFi Analyzer 화면은 `tools/capture_preview.py`가 실제 GUI에 예시 데이터를 연결해 생성합니다. Wi-Fi 스캔이나 위치 권한을 요청하지 않습니다. Capture Viewer는 실제 앱의 장치 미사용 데모 모드입니다.

LiDAR `export.png`는 저장소 데모 영상의 22초 프레임입니다. KITTI 정적 화면과 다른 Patchwork++ Quick preview 입력이며, 영상·데이터 출처와 라이선스는 자산 폴더에 따로 보존합니다. Map Editor `crop.png`는 공개 office 예제를 밝은 웹앱에서 자르는 화면입니다. 로그인·클라우드 저장 없이 적용·ZIP 내보내기와 레이어 크기·원점을 확인했습니다.

기존 Map Editor 데이터는 이 폴더로 옮겼습니다. `/web-service/map-editor`의 검색 조건·해시는 `/utilities/map-editor`로 연결하며 새 주소만 sitemap에 등록합니다.

새 항목 추가 시 `src/lib/utilities.js`의 순서, `src/App.jsx`의 메뉴, `src/lib/routeMeta.js`도 등록합니다. `npm run utilities:check`, `npm run lint`, `npm run build`로 검사합니다. 이미지 경로·원본 크기·지원 환경·목적·중복 ID·메타데이터는 빌드에서도 검사합니다.
