---
title: "KISS-ICP"
slug: "kiss-icp"
date: "2026-11-20"
category: "Perception"
tags:
  - LiDAR
  - ICP
  - KISS ICP
  - Odometry
summary: "3D LiDAR 스캔을 복셀 지역 지도에 맞춰 자세를 추정하는 point-to-point ICP."
---

KISS-ICP는 연속된 3D LiDAR 스캔으로 센서의 **6자유도 오도메트리**를 구한다. 현재 점군을 직전 스캔에서 얻은 이동량으로 먼저 옮겨 보고, 주변 스캔을 쌓아 둔 지역 지도에 맞춰 예측 자세를 보정한다. 기본 파이프라인은 점의 XYZ 좌표와, 스캔 왜곡 보정에 사용할 수 있는 점별 시각을 입력으로 받는다. IMU나 휠 오도메트리 없이도 동작한다. [Vizzo 외, IEEE RA-L 2023][paper]

```text
점군·점별 시각 → 스캔 왜곡 보정·거리 필터 → 복셀 샘플링
  → 예측 자세로 지역 지도에 point-to-point ICP → 자세·지역 지도 갱신
```

## 자세 예측과 스캔 왜곡 보정

직전 두 자세의 상대 변환을 한 번 더 적용해 현재 자세의 초기값을 만든다. 예를 들어 직전 스캔 사이에 센서가 전진하면서 오른쪽으로 돌았다면, 이번 스캔도 비슷하게 움직였다고 보고 ICP를 시작한다. 이전 변환에는 3차원 이동과 회전이 모두 들어간다. [파이프라인 코드][pipeline]

LiDAR 점은 한 스캔 안에서도 서로 다른 시각에 찍힌다. 회전하는 동안 찍힌 벽을 각 점이 관측된 자세 그대로 합치면 벽이 휘거나 두껍게 보일 수 있다. C++ v1.3.0 구현은 점별 시각을 스캔 내부의 상대 시각으로 정규화하고, 앞서 추정한 이동을 SE(3)에서 보간해 점들을 스캔 끝 시점 기준으로 맞춘다. 점별 시각이 들어오지 않거나 보정이 꺼져 있으면 이 단계는 건너뛴다. ROS 2에서 bag을 재생할 때는 `PointCloud2`에 `time`, `t` 같은 점별 시각 필드가 있는지 확인한다. [전처리 코드][preprocessing] · [ROS 2 시각 필드][ros-timing]

논문의 KITTI raw 실험에서 평균 상대 이동 오차는 왜곡 보정 없이 0.91%, 등속 운동 모델로 보정했을 때 0.49%였다. [논문 표 V][paper]

## 점과 지도의 정합

복셀 크기 `v`를 기준으로 먼저 `0.5v`에서 점군을 줄이고, 그 결과를 `1.5v`에서 다시 줄인다. 촘촘한 점군은 지도 갱신에 쓰고, 성긴 점군은 매 반복마다 대응점을 찾는 ICP에 쓴다. 지역 지도는 복셀 해시로 관리하고 센서에서 멀어진 구역은 제거한다. [파이프라인 코드][pipeline] · [복셀 지도 코드][voxel-map]

ICP의 한 반복은 두 단계다.

1. 현재 자세로 옮긴 스캔 점마다 해당 복셀과 이웃 복셀에서 가장 가까운 지도 점을 찾는다. 둘 사이의 거리가 허용 범위를 넘으면 대응에서 제외한다.
2. 남은 점 쌍의 3차원 거리 잔차를 줄이는 자세 보정량을 구한다. 강건 커널로 잔차가 큰 쌍의 가중치를 낮춘다. 자세가 바뀌면 대응점도 다시 찾는다.

잔차는 현재 스캔 점 `p`를 변환한 `T·p`와 지도 점 `q`의 차이다. 벽의 법선이나 모서리 방향을 따로 추출할 필요가 없다. [논문 III-C·E][paper] · [정합 코드][registration]

## 적응형 대응 거리

가까운 점만 허용하면 자세 예측이 조금 빗나갔을 때 쓸 만한 대응도 버리게 된다. 반대로 허용 거리가 넓으면 반복되는 기둥처럼 다른 구조에 대응점이 붙을 수 있다.

KISS-ICP는 **예측 자세와 ICP 결과의 차이**를 이동량과 회전에 의한 최대 거리 변화로 바꿔 누적한다. 이 값의 제곱평균제곱근(RMS)을 `σ`로 두고, 다음 정합의 대응 거리 상한을 `3σ`로 설정한다. 작은 변화는 누적 계산에서 제외한다. 대응 거리 상한은 점 쌍을 받아들일지 결정하고, 강건 커널은 받아들인 점 쌍이 자세 보정에 미치는 영향을 조절한다. [논문 III-D][paper] · [임계값 코드][threshold] · [파이프라인 코드][pipeline]

## 누적 오차와 지도 보정

구조가 적거나 비슷한 구조가 반복되는 구간에서는 일부 방향의 이동을 점군만으로 구분하기 어렵다. 긴 통로에서 양쪽 벽만 잡히면 벽과 평행한 이동이 특히 약하게 관측된다. 급회전이나 정합 실패 직후에는 초기 자세가 빗나가면서 잘못된 대응이 이어질 수 있다.

지역 지도는 다음 스캔을 맞추는 기준이다. KISS-ICP 자체에는 재방문을 찾아 과거 자세를 다시 맞추는 **Loop Closing**과 포즈 그래프 최적화가 없다. 장거리 지도에서 통로가 중복되면 자세 간 상대 이동 오차와 재방문 정합을 구분해 봐야 한다. [논문 III][paper]

[LiDAR 지도 보정](/blog/field-lidar-map-refinement/)에서는 KISS-ICP의 인접 자세 간 상대 이동을 제약으로 써 벽 휨을 줄였고, 재방문 통로의 중복은 별도 루프 제약으로 보정했다. [DDDMR Navigation](/blog/dddmr-navigation/)의 XT32 재생에서는 KISS-ICP의 `X/Y/yaw`에 IMU의 `roll/pitch`를 결합한 외부 오도메트리를 비교했다.

[논문][paper] · [DOI][doi] · [공식 구현][repository]

[paper]: https://arxiv.org/html/2209.15397v2
[doi]: https://doi.org/10.1109/LRA.2023.3236571
[repository]: https://github.com/PRBonn/kiss-icp
[pipeline]: https://github.com/PRBonn/kiss-icp/blob/v1.3.0/cpp/kiss_icp/pipeline/KissICP.cpp
[preprocessing]: https://github.com/PRBonn/kiss-icp/blob/v1.3.0/cpp/kiss_icp/core/Preprocessing.cpp
[registration]: https://github.com/PRBonn/kiss-icp/blob/v1.3.0/cpp/kiss_icp/core/Registration.cpp
[threshold]: https://github.com/PRBonn/kiss-icp/blob/v1.3.0/cpp/kiss_icp/core/Threshold.cpp
[voxel-map]: https://github.com/PRBonn/kiss-icp/blob/v1.3.0/cpp/kiss_icp/core/VoxelHashMap.cpp
[ros-timing]: https://github.com/PRBonn/kiss-icp/blob/v1.3.0/ros/src/Utils.hpp
