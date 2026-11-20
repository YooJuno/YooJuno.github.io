---
title: "Elevator-LIO 논문 리뷰"
slug: "elevator-lio"
date: "2026-11-20"
category: "Perception"
tags:
  - LiDAR
  - Odometry
  - Sensor Fusion
  - ROS 2
summary: "엘리베이터의 수직 운동을 분리하는 LiDAR–IMU 추정 모델과 정차 보정. 논문 실험과 공개 데이터 20개 시퀀스의 매핑 결과."
---

**Yifan Zhang 외 · arXiv:2605.24495 · 2026년 5월** [논문](https://arxiv.org/abs/2605.24495) · [공개 구현](https://github.com/xiaofan4122/Elevator-LIO/tree/4868796)

## 문제 설정

- 엘리베이터 안에 로봇이 정지해 있으면 LiDAR에서 벽과 바닥의 위치는 거의 일정하다. IMU에는 엘리베이터의 출발과 제동에 따른 수직 가속도가 들어온다.
- 엘리베이터 내부 구조를 건물에 고정된 점군으로 간주하면 LiDAR 정합과 IMU 예측의 기준이 달라진다. 논문은 **엘리베이터 기준 로봇 운동**과 **건물 기준 엘리베이터 운동**을 분리해 추정한다.

## Office3 상승 재생

[![Office3에서 문이 닫히고 엘리베이터가 상승한 뒤 상층 복도로 나오는 장면. 왼쪽은 LiDAR 점군과 추정 궤적, 오른쪽은 실제 카메라 영상.](/content/images/blog/elevator-lio/office3-ascent.gif)](/content/images/blog/elevator-lio/office3-ascent.gif)

*Office3 159–183초 · 1.55배속. 주황색 선은 추정 궤적이고, 청록색은 추정 높이에 맞춰 표시한 LiDAR 스캔이다. 오른쪽은 같은 시각의 현장 영상이다. 정차 후 추정 높이는 상승 전보다 약 4.0 m 높았다.* [GIF 크게 보기](/content/images/blog/elevator-lio/office3-ascent.gif) · [Zhang 외, Elevator-LIO Dataset](https://huggingface.co/datasets/xiaofan0100/Elevator-LIO-Dataset) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

## 상태 모델과 IMU 전파

- 반복 오차 상태 칼만 필터(IESKF)의 21차원 오차 상태에 로봇 자세·위치·속도, IMU 바이어스, 중력 벡터, 엘리베이터의 수직 변위·속도·가속도가 포함된다. [상태 정의](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/include/support/type.h#L31-L44)
- 엘리베이터은 중력에 정렬된 수직축을 따라 평행 이동한다고 가정한다. 아래 식의 <code>R</code>은 IMU 좌표를 건물에 정렬된 축으로 회전시키고, <code>e_z</code>는 위쪽 단위벡터다. [IMU 전파 코드](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/src/estimator/IMUProcess.cpp#L288-L319)

~~~text
a_world = R · (f_imu − b_a) + g
a_rel   = a_world − a_e · e_z

v_rel⁺  = v_rel + a_rel · Δt
p_rel⁺  = p_rel + v_rel · Δt + ½ a_rel · Δt²

v_e⁺    = v_e + a_e · Δt
z_e⁺    = z_e + v_e · Δt + ½ a_e · Δt²

건물 기준 높이 = p_rel,z + z_e
~~~

![엘리베이터 내부의 상대 운동을 관측하는 LiDAR와 엘리베이터 가속도가 포함된 IMU](./motion-separation.png)

- <code>f_imu</code>는 IMU 비력, <code>b_a</code>는 가속도 바이어스다. 회전과 중력 보정 후 엘리베이터 가속도 <code>a_e</code>를 빼면 로봇의 상대 가속도 <code>a_rel</code>이 된다.
- 엘리베이터 내부에서 정지한 로봇의 <code>a_rel</code>은 0에 가깝다. 엘리베이터이 등속으로 이동할 때는 <code>a_e</code>가 거의 0이어도 앞서 추정한 속도 <code>v_e</code>를 적분해 엘리베이터 변위 <code>z_e</code>를 갱신한다.

## LiDAR 점–평면 정합

- 스캔의 점 <code>p</code>를 지도 좌표로 옮기고, ikd-tree에서 찾은 이웃 점으로 국소 평면을 맞춘다. 평면 위의 점을 <code>q</code>, 단위 법선을 <code>n</code>이라 하면 잔차는 <code>r = nᵀ(p − q)</code>다. IESKF는 이 잔차로 자세와 위치를 반복 갱신한다. [잔차와 야코비안](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/src/estimator/ESEKF.cpp#L1359-L1377)
- 수직 벽 가까이에서 스캔을 위아래로 이동시켜도 벽까지의 거리는 거의 같다. 바닥과 천장은 법선에 수직 성분이 크므로 높이 오차가 잔차에 반영된다.

![수직 벽과 수평 바닥의 높이 방향 관측 차이](./point-plane.png)

- LiDAR 잔차는 로봇 자세와 위치에 직접 의존한다. 엘리베이터 가속도가 상대 위치·속도 예측에 들어가 생긴 교차 공분산을 통해 엘리베이터 상태도 간접 보정한다. 기본 <code>pose6</code> 경로는 6차원 자세 야코비안으로 전체 상태를 갱신한다. [공분산 전파](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/src/estimator/IMUProcess.cpp#L356-L372) · [pose6 갱신](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/src/estimator/ESEKF.cpp#L597-L645)
- 복셀 크기는 0.05–0.8 m 범위에서 조절한다. 기준은 초당 2만 점이다. 스캔 간격이 달라지면 프레임당 목표 점 수도 함께 바뀐다. [복셀 설정](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/yaml/runtime/mapping.yaml#L9-L16) · [프레임당 목표 점 수](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/src/node/LidarPipeline.cpp#L66-L95)

## 탑승 감지와 정차 보정

| 단계 | 기본 매핑 설정 |
| --- | --- |
| 진입 | 먼 점 상위 6%를 제외한 최대 거리가 3 m 미만인 상태가 2초간 지속되면 탑승 모드로 전환 |
| 이동 | 엘리베이터의 추정 속도와 최근 300개 추정값의 분산으로 가속 → 등속 → 감속 → 정차 판별 |
| 정차 | 안정 조건을 1.5초간 만족하면 엘리베이터의 수직 속도와 가속도를 0으로 제약 |
| 종료 | 엘리베이터 변위를 로봇 위치의 z 값에 더하고, 공분산을 변환한 뒤 엘리베이터 상태 초기화 |

[기본 설정](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/yaml/runtime/mapping.yaml#L49-L66) · [정차 상태 머신](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/src/elevator/ElevatorSelfExit.cpp#L89-L151) · [종료 시 상태 반영](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/src/node/LidarPipeline.cpp#L338-L387)

- 정차 시 속도와 가속도가 0으로 제약되는 대상은 엘리베이터이다. 속도와 변위 오차 사이의 교차 공분산을 통해 누적 높이 오차도 보정한다. [정차 측정 갱신](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/src/elevator/ElevatorProcess.cpp#L170-L200)

## 논문 실험과 한계

- **종료 높이 오차** · 실제 환경 20개 시퀀스 중 17개에서 1 cm 미만. 같은 층 재방문이나 계단 경로를 기준으로 종점의 높이를 비교했다. 전 구간의 절대 정확도를 계산할 기준 궤적은 제공되지 않는다.
- **자동 감지** · 엘리베이터 탑승 79회 중 76회 성공. 진입 감지에 실패한 구간에서는 모드를 수동 전환해 추정기를 평가했다. [논문 실험 및 표 III](https://arxiv.org/html/2605.24495v1#S6)
- **감지 조건** · 좁은 복도는 진입 오탐, 거울은 반사로 인한 진입 누락을 일으킬 수 있다. 등속 구간이 짧으면 자동 정차 판별도 실패할 수 있다. 외부 전환 신호는 <code>/LIO/set_elevator_flag</code>로 입력한다. [구현 안내](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/README_en.md#L199-L233)
- **스캔 왜곡** · 분석한 커밋은 탑승 중 스캔 모션 보정(deskew)을 생략한다. 센서가 빠르게 회전하면 스캔 내부의 왜곡이 정합에 남을 수 있다. [LiDAR 처리 경로](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/src/node/LidarPipeline.cpp#L522-L545)

## 공개 데이터셋

| 환경 | 시퀀스 | 녹화 시간 합계 |
| --- | ---: | ---: |
| 사무실 · Office | 10 | 26분 35초 |
| 캠퍼스 · Campus | 4 | 24분 18초 |
| 기숙사 · Dormitory | 4 | 12분 59초 |
| 쇼핑몰 · Mall | 2 | 5분 53초 |
| 전체 | 20 | 69분 45초 |

- 모든 시퀀스에 Livox MID-360 점군과 내장 IMU 기록이 있다. 산업용 카메라 영상은 <code>Office3</code>와 <code>Mall2</code>에만 포함된다. [데이터셋과 센서 구성](https://huggingface.co/datasets/xiaofan0100/Elevator-LIO-Dataset)
- 네 시퀀스(<code>Campus1</code>, <code>Campus3</code>, <code>Campus4</code>, <code>Mall1</code>)는 외부 모드 전환 신호를 함께 기록했다. 반사와 다중 경로로 자동 진입 감지가 어려웠던 구간이 포함된다. [전환 신호가 포함된 시퀀스](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/DATASET.md#L79-L85)

![Mall2 카메라 영상의 탑승 전 로비, L5 정차, L1 하차 후 장면](./mall2-camera.jpg)

*Mall2 카메라 프레임. 탑승 전 로비, L5 정차, L1 하차 후 순서. 원본을 자르고 축소했다.* [Zhang 외, Elevator-LIO Dataset](https://huggingface.co/datasets/xiaofan0100/Elevator-LIO-Dataset) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

![Livox MID-360과 산업용 카메라를 사용한 휴대형 수집 장비](./handheld-platform.jpg)

*논문 저자의 휴대형 수집 장비. Fig. 6을 JPEG로 변환했다.* [Zhang 외, Fig. 6, CC BY 4.0](https://arxiv.org/html/2605.24495v1#S6.F6)

## 전체 시퀀스 매핑

- 원본 ROS 1 bag을 SQLite3 rosbag2로 변환했다. ROS 2 Jazzy에서 LiDAR·IMU와 기록된 모드 전환 신호를 재생해 시퀀스별 지도를 생성했다. [변환 안내](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/scripts/README.md#convert_rosbag1_to_rosbag2py)

- 20개 시퀀스 모두 개별 3D 점군 맵으로 저장했다. LiDAR 스캔 153,823개 중 153,035개에 대해 매핑 후 자세가 출력됐다. 자세 로그가 포함하는 녹화 구간의 비율은 시퀀스별로 최소 약 97.6%였다.
- 스캔 기록률은 약 10 Hz가 8개, 약 50 Hz가 12개다. 프레임 수는 기록률과 주행 길이에 따라 달라진다.

### Campus2 층간 매핑

[![직접 재현한 Campus2 점군의 사선 측면도. 층별 구조를 높이별 색으로 나타냈으며 왼쪽 흰 선은 엘리베이터 이동 궤적이다.](/content/images/blog/elevator-lio/campus2-floor-detail.jpg)](/content/images/blog/elevator-lio/campus2-floor-detail.jpg)

*직접 재현한 Campus2 맵. 점의 색은 지도 좌표계의 높이, 흰 선은 탑승 모드가 켜진 여섯 구간의 추정 궤적이다.*

[![논문의 Campus2 매핑 결과와 5층부터 10층까지의 엘리베이터 구간 확대도.](/content/images/blog/elevator-lio/paper-mapping-example.jpg)](/content/images/blog/elevator-lio/paper-mapping-example.jpg)

*논문 저자의 Campus2 매핑 예시. 흰 선은 전체 주행 궤적이다. 오른쪽 확대도에서 5층부터 10층까지의 이동을 볼 수 있다. 그림 8에서 Campus2 부분을 잘라 확대했다.* [Zhang 외, 그림 8](https://arxiv.org/html/2605.24495v1#S6.F8) · [공식 매핑 예시](https://xiaofan4122.github.io/Elevator_LIO_Page/static/images/Scenarios.png) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

<details>
<summary>전체 시퀀스 평면도와 매핑 결과</summary>

![Office·Campus·Dormitory·Mall 전체 20개 시퀀스의 점군 맵 평면도](./dataset-maps.jpg)

*시퀀스별 ikd-tree 맵의 평면도. 색은 각 맵 내부의 상대 높이, 흰 선은 거리 축척이다.*

| 시퀀스 | LiDAR 스캔 | 자세 출력 | ikd-tree 맵 점 수 |
| --- | ---: | ---: | ---: |
| Office1 | 4,706 | 4,651 | 273,857 |
| Office2 | 1,095 | 1,080 | 380,525 |
| Office3 | 11,458 | 11,403 | 1,103,226 |
| Office4 | 4,805 | 4,755 | 367,205 |
| Office5 | 955 | 940 | 168,592 |
| Office6 | 2,746 | 2,731 | 1,230,765 |
| Office7 | 1,392 | 1,377 | 298,888 |
| Office8 | 1,081 | 1,066 | 49,965 |
| Office9 | 2,981 | 2,966 | 1,211,404 |
| Office10 | 1,502 | 1,487 | 278,670 |
| Campus1 | 14,038 | 13,988 | 1,826,576 |
| Campus2 | 35,281 | 35,209 | 5,622,381 |
| Campus3 | 6,894 | 6,838 | 968,384 |
| Campus4 | 16,673 | 16,618 | 1,630,165 |
| Dormitory1 | 4,944 | 4,889 | 109,259 |
| Dormitory2 | 8,468 | 8,413 | 140,065 |
| Dormitory3 | 8,368 | 8,313 | 138,777 |
| Dormitory4 | 17,174 | 17,119 | 348,612 |
| Mall1 | 2,066 | 2,051 | 502,110 |
| Mall2 | 7,196 | 7,141 | 332,884 |

</details>

### Campus1 재진입 오탐

- 기본 설정의 2.5배속 재생에서 두 번째 탑승 종료 직후 모드가 다시 켜졌다. 이후 추정 위치가 1초 사이 최대 25.2 m 이동했다.
- 최종 맵에는 자동 진입 감지를 끄고 bag의 진입 신호를 사용한 2.2배속 재생 결과를 사용했다. 탑승 모드는 두 번 켜졌고, LiDAR 14,038개 중 13,988개에서 자세가 출력됐다.

![Campus1 기본 설정 재생과 기록된 진입 신호 재생의 추정 높이 비교](./campus1-entry-replay.png)

*음영은 탑승 모드 구간. 위는 기본 설정, 아래는 기록된 진입 신호를 사용한 재생이다.*

## Office1 높이 추정

- ROS 2 Jazzy에서 94초 시퀀스를 재생했다. 두 탑승 모두 자동 진입과 종료를 확인했다.
- 첫 이동 후 추정 높이는 약 −3.8 m에서 유지됐고, 두 번째 이동 후 출발 높이 부근으로 돌아왔다. 탑승 모드 종료 시점에 높이 추정값이 한 번씩 바뀐다.

![Office1 추정 높이와 두 번의 자동 탑승 구간](./office1-height.png)

*음영은 <code>/LIO/in_elevator</code>가 켜진 구간. 그래프는 <code>/LIO/odom_imu</code>의 z 값.*

![Office1 점군의 평면도와 측면도](./office1-map.jpg)

*273,857점 ikd-tree 맵. 빨간 선은 평면에 투영한 오도메트리 궤적.*

- <code>/LIO/odom_imu</code>의 pose에는 엘리베이터 변위가 더해진다. <code>twist.linear.z</code>는 엘리베이터 속도를 포함하지 않으므로, 두 필드를 함께 쓰는 후단에서 기준 좌표를 확인해야 한다. [odometry 발행 코드](https://github.com/xiaofan4122/Elevator-LIO/blob/4868796/src/node/publish.cpp#L17-L46)
