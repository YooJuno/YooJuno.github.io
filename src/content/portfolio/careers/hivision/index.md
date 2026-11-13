---
id: "career-hivision"
organization: "하이비젼시스템"
role: "선행기술본부 · SW팀"
type: "경력"
start: "2025-12-01"
end: "2026-03-17"
summary: "Jetson 기반 영상처리 알고리즘을 C++·CUDA로 이식하고, 이미지 배포와 보드 상태 측정 도구를 개발했습니다."
hardware: []
---

#### 영상처리 알고리즘 이식·최적화

기존 영상 품질 분석 알고리즘을 C++·CUDA로 이식하고 기준 결과와 비교. GPU 버퍼를 재사용해 반복 메모리 할당을 줄이고, PC·Jetson에서 CPU/GPU 실행시간 비교.

#### Jetson 개발 환경·이미지 배포

Yocto·Ubuntu Server 기반 이미지를 빌드하고 부팅 과정 비교. Windows·WSL 기반 이미지 추출·축소 도구와 첫 부팅 시 파티션 확장 스크립트 구현.

#### 보드 성능·상태 측정

C++ 온도 로거와 Python 기반 전압·전류 수집 도구 개발. 외부 계측기를 RS-232로 연동해 측정값을 CSV로 기록하고, CPU 부하·냉각 조건별 온도 추이 비교.

#### Linux 서비스·상태 관리

UDS·systemd 기반 상태 수집 도구 구현. Suspend/Resume 전환과 복귀 후 상태 기록 재개를 확인하고 테스트 절차 문서화.
