---
id: "proj-hangang"
title: "한강 자율주행 배달 로봇 LiNKY"
start: "2025-07"
end: "2025-08"
meta: "SSAFY · 6인 · 팀장/PM/Robotics"
---

한강에서 배달 음식을 받으려면 먼 거리를 걸어가야 하는 불편을 해결하기 위해, 야외에서 카메라 기반으로 자율주행하는 배달 로봇을 만들었습니다. 6인 팀에서 팀장이자 PM 으로 자율주행 로봇 개발을 맡았습니다.

- Jetson Orin Nano 에 최적화된 Isaac ROS Visual-SLAM 으로 온디바이스 위치 추정
- RealSense D435i 로 Point Cloud 를 얻어 주행 환경 지도를 미리 생성
- 주행 환경의 GPS 정보를 SLAM 좌표와 매핑해 GPS \<-\> SLAM 실시간 변환
- 가까운 고객 순으로 경로를 만들고 Pure-Pursuit 로 추종
- FaceNet 으로 사전 등록 사진과 실시간 이미지를 비교해 수령자 확인
- 실시간 영상을 base64 로 변환해 MQTT 로 송신, 관리자·고객 화면에서 확인

#### 설계 변경

**gRPC 에서 REST + SSE 로** protobuf 직렬화가 빨라 영상 전송에 유리하다고 보고 gRPC 로 설계했습니다. 서버와 로봇 사이는 잘 동작했지만, 브라우저에서 gRPC 를 쓰려면 별도 프로토콜과 envoy proxy 중계가 필요했고 Vue 의 Vite 와 호환되지 않아 전체를 REST 와 SSE 구조로 바꿨습니다.

**WebRTC 에서 MQTT 로** 실시간 스트리밍을 위해 C++ ffmpeg 파이프라인을 설계했으나 백엔드의 OpenVIDU 와 호환되지 않았고 WebRTC Signaling 을 직접 구현할 시간이 부족했습니다. 이미지를 base64 로 변환해 MQTT 토픽으로 보내는 방식으로 기능을 완성했습니다.

`ROS2` `Isaac ROS VSLAM` `MQTT` `FaceNet` `Docker`

[GitHub](<https://github.com/YooJuno/LiNKY>)

![로봇 정면](./images/front.png)
![시스템 아키텍처](./images/system_architecture.png)
![관제 UI](./images/ui.png)
![Visual SLAM 맵](./images/slam_map.png)
![얼굴 인식](./images/face_recognition.png)
