---
title: "[ROS 2] 토픽·서비스·액션과 CLI"
slug: "ros2-communication-cli"
date: "2026-11-15"
category: "시스템 통합"
tags: [ROS2, QoS, CLI]
summary: "통신 방식·인터페이스·QoS와 실행 중인 노드 진단."
---

ROS 2 Jazzy 기준이다. 노드가 실행된 것, 상대 노드를 발견한 것, 실제 데이터를 받은 것은 서로 다른 상태다. CLI에서는 **이름 → 타입 → 연결 → 데이터** 순서로 확인한다.

## 1. 통신 방식

| 요소 | 용도 | 예시 |
| --- | --- | --- |
| Topic | 지속적인 발행·구독 | 카메라 영상·IMU·속도 명령 |
| Service | 요청 하나와 응답 하나 | 설정 초기화·단기 조회 |
| Action | 장시간 작업·피드백·취소 | 목표 위치까지 이동 |
| Parameter | 노드의 설정값 | 처리 주기·프레임 이름 |

파라미터는 범용 데이터 스트림이 아니다. 서비스 응답이 끝날 때까지 오래 기다려야 하고 중간 상태·취소가 필요하다면 액션이 적합할 수 있다.

## 2. Turtlesim 실습

Jazzy의 `turtlesim` 패키지가 설치된 환경에서 서로 다른 터미널에 실행한다. 각 터미널에서 ROS 환경을 먼저 읽는다.

```bash
ros2 run turtlesim turtlesim_node
```

```bash
ros2 run turtlesim turtle_teleop_key
```

다른 터미널에서 구조와 인터페이스를 조회한다.

```bash
ros2 node list
ros2 node info /turtlesim
ros2 topic list -t
ros2 topic info /turtle1/cmd_vel --verbose
ros2 interface show geometry_msgs/msg/Twist
ros2 topic echo /turtle1/cmd_vel
```

`ros2 topic echo`는 구독자 하나를 추가하는 동작이다. 고속·대용량 토픽을 조회하는 것 자체가 부하를 늘릴 수 있다.

## 3. 발행·호출·리맵

```bash
ros2 topic pub --once /turtle1/cmd_vel geometry_msgs/msg/Twist \
  "{linear: {x: 1.0}, angular: {z: 0.5}}"
ros2 service type /clear
ros2 service call /clear std_srvs/srv/Empty "{}"
```

명령의 타입과 YAML 필드가 실제 인터페이스와 일치해야 한다. `--once`는 한 번 발행하는 옵션이지 실제 로봇을 안전하게 정지시키는 보장 기능은 아니다. 실습은 시뮬레이터에서 시작한다.

다른 이름의 토픽으로 연결하려면 리맵을 사용한다.

```bash
ros2 run turtlesim turtle_teleop_key --ros-args -r turtle1/cmd_vel:=turtle2/cmd_vel
```

`turtle2`는 별도로 생성되어 있어야 한다. 상대 이름·절대 이름·namespace에 따라 최종 토픽 이름이 달라진다.

## 4. 액션과 파라미터

```bash
ros2 action list -t
ros2 action info /turtle1/rotate_absolute
ros2 action send_goal /turtle1/rotate_absolute turtlesim/action/RotateAbsolute "{theta: 1.57}" --feedback
ros2 param list /turtlesim
ros2 param get /turtlesim background_r
ros2 param set /turtlesim background_r 120
```

실행 중 파라미터 변경 가능 여부는 노드 구현에 달려 있다. CLI에서 바꾼 값이 다음 실행에도 자동으로 유지되는 것은 아니므로 YAML·launch 설정도 함께 관리한다.

## 5. QoS 호환성

| 정책 | 확인할 의미 |
| --- | --- |
| Reliability | Reliable / Best effort |
| Durability | Volatile / Transient local |
| History·Depth | 보관 방식과 큐 크기 |
| Deadline·Lifespan | 예상 갱신 간격·메시지 유효 기간 |

Best-effort 발행자와 Reliable 구독자는 호환되지 않는다. 반대 조합은 Reliability 관점에서 호환된다. 다른 정책도 함께 맞아야 한다. 큐 깊이만 높이는 것이 무선 손실이나 처리 지연의 보편적인 해결책은 아니다. [공식 QoS 호환 표](https://github.com/ros2/ros2_documentation/blob/jazzy/source/Concepts/Intermediate/About-Quality-of-Service-Settings.rst).

## 6. 데이터가 안 보일 때

1. 패키지·노드가 실제로 실행 중인지 확인한다.
2. 토픽 이름·namespace·메시지 타입을 맞춘다.
3. `topic info --verbose`로 양쪽 QoS를 비교한다.
4. 여러 장치에서는 `ROS_DOMAIN_ID`, discovery 범위, RMW·보안 설정과 방화벽을 확인한다.
5. 장치는 보이는데 데이터가 멈추면 발행 주기·로그·executor 부하를 확인한다.

CLI 목록에 나타난다고 통신 경로·시간 동기화·센서 데이터 의미까지 검증된 것은 아니다. [ROS 2 CLI 튜토리얼](https://github.com/ros2/ros2_documentation/tree/jazzy/source/Tutorials/Beginner-CLI-Tools).
