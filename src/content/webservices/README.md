# 웹서비스 콘텐츠

서비스별 JSON 파일에서 소개·기능·화면·API·설계·한계를 수정합니다. 화면 컴포넌트는 `src/pages/webservice/ServiceDetail.jsx`를 공유합니다.

## 배포 주소

`github`는 소스 저장소, `site`는 실제 서비스 주소입니다. 배포를 확정하지 않았다면 `site`를 빈 문자열로 유지합니다. 임시 도메인이나 `#`를 채울 필요는 없습니다.

- `site`가 비어 있거나 없으면 서비스 접속 링크를 표시하지 않습니다. 상세 페이지에는 배포 주소 추가 예정 안내만 표시합니다.
- 배포 후 `site`에 실제 HTTPS 주소를 넣으면 목록과 상세 페이지에 **서비스 열기** 링크가 자동으로 나타납니다. JSX 수정은 필요하지 않습니다.
- 실제 운영을 시작하면 `status`도 운영 상태에 맞게 수정합니다. 구현 여부와 배포 여부를 구분합니다.
- 화면 캡처는 로컬 구현을 보여주는 자료입니다. 서비스 공개·운영 중이라는 의미는 아닙니다.

## 수정 파일

- `portfolio.json`: 현재 사이트
- `cctv.json`: CCTV Streaming
- `video.json`: Pair 영상 통화
- `btc.json`: BTC Auto Trader
- `hellog.json`: HelloG 운동 기록

`screens`의 이미지 경로는 `public/content/images/webservices/<서비스>/`를 사용합니다. `width`·`height`는 원본 이미지 크기입니다. 실제 프론트엔드에 예시 API 응답을 연결한 캡처는 `caption`에 그 사실을 표시합니다. 운영 계정·키·잔고·개인 기록을 캡처하지 않습니다.

`api`는 확인한 실제 인터페이스만 기재합니다. 기획 단계 기능이나 아직 없는 경로를 구현된 API로 적지 않습니다. 소스 변경 후 `revision`·`inspectedAt`과 `sources`를 함께 갱신합니다.

서비스를 새로 추가할 때는 JSON과 `src/lib/webServices.js` 등록, 페이지 라우트·메타데이터도 추가합니다. 기존 서비스 내용 수정에는 JSX 변경이 필요하지 않습니다.
