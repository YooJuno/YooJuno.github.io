---
title: "Elevator-LIO는 층간 이동을 어떻게 추정하는가"
slug: "elevator-lio"
date: "2026-11-20"
category: "Perception"
tags:
  - LiDAR
  - Odometry
  - Sensor Fusion
  - ROS 2
summary: "엘리베이터의 수직 운동을 분리하는 IESKF, 정차 보정, 공개 데이터로 생성한 층간 점군 맵."
---

- **문제.** 객실에 로봇이 서 있으면 LiDAR에서 벽과 바닥의 위치는 거의 그대로다. 같은 순간 IMU에는 객실의 출발과 제동에 따른 수직 가속이 들어온다.
- **해법.** Elevator-LIO는 객실에 대한 로봇 운동과 건물에 대한 객실 운동을 한 필터에서 따로 추정한다. 일반 구간에서는 기존 LiDAR–IMU 오도메트리(LIO)와 같은 형태로 동작한다. [Elevator-LIO 논문](https://arxiv.org/html/2605.24495v1)

![Office3 시퀀스의 열린 출입구, 닫힌 객실 문, 하차 후 복도](./office3-elevator.jpg)

*Office3 카메라 프레임. 왼쪽부터 열린 출입구, 닫힌 문, 하차 후 복도. 원본을 크롭·축소해 나란히 배치했다. 카메라는 장면 기록용이며, 이 실험의 추정 입력은 LiDAR와 IMU다.* [Elevator-LIO Dataset, Zhang 외, CC BY 4.0](https://huggingface.co/datasets/xiaofan0100/Elevator-LIO-Dataset)

## 1. IMU 예측에서 객실 가속도 분리

- **상태 구성.** 로봇의 자세·위치·속도, IMU 바이어스와 중력 벡터에 객실의 수직 변위·속도·가속도를 더한다. IESKF 오차 상태는 총 21차원이다. [상태 정의](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/include/support/type.h#L31-L44)
- **운동 가정.** 객실은 중력에 정렬된 수직축을 따라 평행 이동한다. 수평 진동이나 객실 자체의 회전은 이 모델의 추정 범위 밖이다.
- **예측.** IMU 비력 <code>f_imu</code>에서 바이어스를 빼고, 건물에 정렬된 축으로 회전한 뒤 중력을 더한다. 그 선가속도에서 추정한 객실 가속도를 빼면 로봇의 상대 가속도가 된다. [IMU 전파 코드](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/src/estimator/IMUProcess.cpp#L288-L319)

~~~text
a_world = R · (f_imu − b_a) + g
a_rel   = a_world − a_e · e_z

v_rel⁺  = v_rel + a_rel · Δt
p_rel⁺  = p_rel + v_rel · Δt + ½ a_rel · Δt²

v_e⁺    = v_e + a_e · Δt
z_e⁺    = z_e + v_e · Δt + ½ a_e · Δt²
p_world,z = p_rel,z + z_e
~~~

![LiDAR는 객실에 대한 상대 위치를 관측하고 IMU에는 객실의 가속도가 포함되는 구조](./motion-separation.png)

- **출발과 등속 구간.** 객실이 위로 가속하고 로봇이 바닥에 정지해 있다면, 객실 가속도를 뺀 <code>a_rel</code>은 0에 가깝다. 객실이 등속으로 바뀌면 가속도는 거의 0이지만 출발 때 추정한 <code>v_e</code>가 유지되면서 변위 <code>z_e</code>가 계속 바뀐다.

## 2. LiDAR 정합과 수직 방향 관측

- **점–평면 잔차.** 스캔의 점 <code>p</code>를 추정 자세로 지도에 옮긴 뒤, ikd-tree에서 이웃을 찾아 평면을 맞춘다. 평면 위의 기준점이 <code>q</code>, 단위 법선이 <code>n</code>이면 잔차는 <code>r = nᵀ(p − q)</code>다. IESKF는 잔차를 줄이도록 자세와 위치를 반복 보정한다. [잔차와 야코비안](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/src/estimator/ESEKF.cpp#L1359-L1377)
- **바닥과 천장이 필요한 이유.** 수직 벽의 법선은 수평에 가깝다. 점을 위아래로 움직여도 벽까지의 거리는 거의 같다. 바닥이나 천장의 법선은 수직에 가까워 같은 높이 오차에 잔차가 생긴다.

![높이 변화가 수직 벽의 점–평면 잔차는 거의 바꾸지 않고 수평 바닥의 잔차는 바꾸는 비교 그림](./point-plane.png)

- **객실 상태의 간접 보정.** LiDAR 잔차는 로봇 자세와 위치에 직접 의존한다. IMU 전파에서 객실 가속도가 상대 위치와 속도 예측에 들어가므로 두 상태 사이에 교차 공분산이 생긴다. 기본 <code>pose6</code> 경로는 LiDAR 야코비안을 6차원으로 계산하고, 이 상관을 이용해 객실 상태까지 갱신한다. [공분산 전파](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/src/estimator/IMUProcess.cpp#L356-L372) · [pose6 갱신](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/src/estimator/ESEKF.cpp#L597-L645)
- **복셀 해상도.** 기본값은 초당 2만 점을 목표로 복셀 크기를 0.05–0.8 m 사이에서 조정한다. 좁은 객실에서도 정합에 쓸 점을 확보하기 위한 설정이다. 이 구현은 탑승 중 모션 왜곡 보정(deskew)을 생략하므로, 객실 안에서 센서가 빠르게 회전하는 상황은 별도 검증이 필요하다. [복셀 설정](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/yaml/runtime/mapping.yaml#L9-L16) · [LiDAR 처리 경로](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/src/node/LidarPipeline.cpp#L522-L545)

## 3. 진입 감지와 정차 보정

- **진입.** LiDAR 거리 상위 6%를 제외해 얻은 값이 3 m 미만인 상태가 2초간 지속되면 탑승 모드로 들어간다. 좁은 복도는 오탐을, 거울 반사는 누락을 일으킬 수 있다. 필요하면 <code>/LIO/set_elevator_flag</code>로 외부 신호를 줄 수 있다. [기본 매핑 설정](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/yaml/runtime/mapping.yaml#L49-L66)
- **이동 판별.** 추정 객실 속도와 최근 300개 속도 추정값의 분산으로 가속 → 등속 → 감속 → 정차 확인을 진행한다. 등속 구간이 짧으면 자동 종료 조건에 도달하지 못할 수 있다. [자동 정차 코드](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/src/elevator/ElevatorSelfExit.cpp#L89-L151)
- **정차 보정.** 안정 조건을 1.5초간 만족하면 객실의 수직 속도와 가속도가 0이라는 가상 관측으로 갱신한다. 속도와 변위 오차가 서로 연관되어 있으면 이 갱신이 누적 높이 드리프트도 줄인다. [정차 제약](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/src/elevator/ElevatorProcess.cpp#L170-L200)
- **높이 반영.** 추정한 객실 변위 <code>z_e</code>를 로봇 위치의 z 성분에 합친다. 상태 재정의에 맞춰 공분산을 변환한 뒤 객실 상태를 초기화한다. [좌표·공분산 재설정](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/src/node/LidarPipeline.cpp#L363-L387)

![Office1의 높이 추정과 두 번의 엘리베이터 모드 구간을 표시한 그래프](./office1-height.png)

*Office1의 추정 높이. 음영은 탑승 모드 구간이다. 첫 이동 후 높이는 약 −3.8 m에 머무르고, 두 번째 이동 후 출발 높이 부근으로 돌아온다. 음영 오른쪽 경계에서 보이는 단차는 모드 종료 전후의 추정값 차이다.*

## 4. 재현 결과와 적용 범위

![Office1 점군의 평면도와 측면도. 평면도의 빨간 선은 오도메트리 궤적이다.](./office1-map.jpg)

- **Office1 재현.** ROS 2 Jazzy로 전체 시퀀스를 재생했다. 두 탑승에서 자동 진입과 종료를 확인했고, 273,857점 ikd-tree 맵을 저장했다. 측면도에서 상하층 구조가 다른 높이에 분포한다.
- **논문 지표.** 20개 시퀀스 중 17개에서 종료 높이 오차가 1 cm 미만이었다. 같은 층 재방문과 계단 경로를 기준으로 종점을 비교한 값이다. 자동 감지는 79회 중 76회 성공했고, 누락된 구간은 수동 전환으로 추정기를 평가했다. [실험 방법과 표 III](https://arxiv.org/html/2605.24495v1#S6)
- **ROS 2 연결.** <code>/LIO/odom_imu</code>는 pose의 z에 객실 변위를 더하지만 <code>twist.linear.z</code>에는 객실 속도를 포함하지 않는다. 위치와 속도를 함께 쓰는 후단에서는 두 필드의 기준을 확인해야 한다. [odometry 발행 코드](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/src/node/publish.cpp#L17-L46)

## 5. 데이터와 코드

![Livox MID-360과 산업용 카메라를 사용한 휴대형 수집 장비](./handheld-platform.jpg)

*논문 저자의 휴대형 수집 장비. 원본 Fig. 6을 JPEG로 변환했다.* [Zhang 외, Fig. 6, CC BY 4.0](https://arxiv.org/html/2605.24495v1#S6.F6)

- **데이터.** 실제 환경 20개 시퀀스와 탑승 79회. <code>Office1</code>은 1분 34초, <code>Campus2</code>는 11분 46초다. [공개 데이터셋](https://huggingface.co/datasets/xiaofan0100/Elevator-LIO-Dataset) · [Office1 다운로드](https://huggingface.co/datasets/xiaofan0100/Elevator-LIO-Dataset/blob/main/Office1.bag)
- **재생.** 제공 스크립트로 ROS 1 bag을 SQLite3 rosbag2로 변환한다. ROS 2 재생 시 <code>livox_ros_driver2/msg/CustomMsg</code> 타입이 필요하다. 모드 전환과 높이는 각각 <code>/LIO/in_elevator</code>, <code>/LIO/odom_imu</code>에서 확인할 수 있다. [변환 안내](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/scripts/README.md#convert_rosbag1_to_rosbag2py) · [분석 기준 커밋 4868796](https://github.com/xiaofan4122/Elevator-LIO/tree/4868796)
