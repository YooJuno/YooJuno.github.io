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

## 검토 시점·소스 상태

- `inspectedAt`은 확인 날짜, `reviewedAt`은 시간대가 포함된 최종 검토 시각입니다. 예: `2026-10-14T14:49:49+09:00`. 화면에는 한국 시간으로 표시하며, 이미지 캐시 버전에도 사용하므로 새 캡처를 반영할 때 갱신합니다.
- `revision`에는 실제 확인한 커밋을 기록합니다. 날짜만 비교하지 말고 해당 커밋 이후의 변경과 미커밋·새 파일도 확인합니다.
- 아직 GitHub에 반영하지 않은 수정본은 `sourceState: "local"`로 표시합니다. `revision`은 기준 HEAD, `sourceSnapshot`은 확인한 파일 집합의 SHA-256, `sourceNote`는 공개 상태 설명입니다.
- 로컬 수정본의 소스 항목은 링크 대신 안내 태그로 표시합니다. 존재하지 않는 GitHub 파일 링크를 만들지 않습니다.
- 소스를 공개하면 내용과 커밋을 다시 대조한 뒤 `sourceState: "published"`로 바꾸고 `revision`·검토 시각을 갱신합니다. `sourceSnapshot`과 미커밋 안내 문구는 제거합니다. `dev` 기준 등 추가 설명은 `sourceNote`로 남길 수 있습니다.
- 화면을 다시 캡처할 때 실장비·가상 장치·예시 API 응답을 구분하고, 기능 설명·API·한계·소스 경로도 함께 갱신합니다.

서비스를 새로 추가할 때는 JSON과 `src/lib/webServices.js` 등록, 페이지 라우트·메타데이터도 추가합니다. 기존 서비스 내용 수정에는 JSX 변경이 필요하지 않습니다.
