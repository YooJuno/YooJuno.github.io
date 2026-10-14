---
id: "proj-smart-factory"
title: "스마트 팩토리 로봇팔 자동화 & 디지털 트윈"
start: "2025-04"
end: "2025-05"
meta: "SSAFY · 3인 · 팀장/PM"
---

웹에서 Dobot 로봇팔을 제어하고 RoboDK에서 같은 동작을 시뮬레이션하는 자동화 공정을 만들었습니다. 3인 팀의 팀장·PM으로 ROS2 시스템, 서버, 영상처리와 로봇 모션 제어를 맡았습니다.

- 카메라 영상에서 Coordinate Board 를 Perspective Transformation 해 원근 제거
- 원근이 제거된 RoI 를 실시간 웹 스트리밍하고, 화면 클릭으로 로봇 목적지 지정
- 슬라이드 바로 세밀 제어, 채팅창에 대화식으로 입력하면 ChatGPT API 가 로봇 명령으로 변환
- 컨베이어 위 객체를 감지하면 벨트를 구동하고 YOLOv5 로 불량품(빨간색) 분류
- 같은 시나리오를 RoboDK 디지털 트윈으로 동시 시뮬레이션

#### 문제 해결

**문제** 로봇의 End-Effector 위치가 실제 흡착 부위인 Suction-Cup 이 아니라 마지막 관절 위치로 반영됐습니다.

**해결** 마지막 관절부터 Suction-Cup 까지의 거리를 직접 측정하고, 정기구학(FK)으로 End-Effector 위치를 계산해 보정했습니다.

#### 서버 구조

메인 스레드의 Web API 외에 ROS2(Dobot·영상처리 노드), TCP1(컨베이어 벨트 라즈베리파이5), TCP2(RoboDK 실행 PC) 를 각각 별도 스레드로 두어 실시간 비동기 통신을 처리했습니다.

연결 대상과 수가 정해져 있어 기능별 스레드로 요청 처리를 분리했습니다. 공유 상태의 동기화와 종료 순서는 별도로 관리해야 합니다.

#### 회고

- 스트리밍 지연을 줄이려면 촬영·인코딩·전송·재생 버퍼의 지연을 나눠 측정한 뒤 전송 방식을 비교해야 합니다.
- Perspective Transformation 으로 원근은 제거했지만, 지면에서 솟아 있는 객체는 옆면이 함께 보이는 한계가 남습니다.

`ROS2` `YOLOv5` `RoboDK` `OpenCV` `Flask`

[GitHub](<https://github.com/YooJuno/SSAFY-Smart_Factory>) [Demo Video](<https://www.youtube.com/watch?v=G8R1HWxcDtk>)

![로봇팔 작업 셀](./images/workspace.png)
![디지털 트윈 화면](./images/robodk.png)
![검출 결과](./images/yolo.png)
![시스템 아키텍처](./images/system_architecture.png)
![멀티 스레드 구조](./images/thread.png)
![웹 인터페이스](./images/ui.png)
