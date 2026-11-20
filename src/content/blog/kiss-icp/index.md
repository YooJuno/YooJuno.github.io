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
summary: "ICP의 대응점과 자세 갱신, KISS-ICP의 스캔 보정·적응형 거리 상한, 실제 LiDAR 오도메트리 영상."
---

## ICP란

ICP는 **Iterative Closest Point**의 약자다. 서로 다른 위치에서 찍은 두 점군을 같은 좌표계에 맞추는 방법이다. 예를 들어 LiDAR가 기둥 앞에서 오른쪽으로 움직이면 같은 기둥도 다음 스캔에서는 센서 기준으로 왼쪽에 찍힌다. ICP는 두 관측이 겹치도록 현재 스캔을 얼마나 이동하고 회전해야 하는지 계산한다. [논문 II][paper]

1. 현재 추정한 자세로 스캔 점을 옮긴다.
2. 옮긴 점마다 참조 점군에서 가장 가까운 점을 찾아 대응 쌍을 만든다.
3. 대응 쌍의 거리 오차가 줄어들도록 이동과 회전을 갱신한다.
4. 새 자세에서 대응점을 다시 찾고, 자세 보정량이 충분히 작아질 때까지 반복한다.

**Point-to-point ICP**는 두 점의 3차원 좌표 차이를 오차로 쓴다. 시작 자세가 크게 빗나가면 같은 기둥이 옆 기둥에 잘못 대응할 수 있다. 그래서 연속 스캔에서는 직전 움직임을 이용해 시작 자세를 잡는다.

## KISS-ICP의 처리 흐름

KISS는 논문에서 **Keep It Small and Simple**을 뜻한다. KISS-ICP는 point-to-point ICP를 중심에 두고, 자세 예측과 스캔 왜곡 보정, 복셀 샘플링, 적응형 대응 거리, 강건 가중치를 결합한다. 연속된 3D LiDAR 스캔을 받아 센서의 **6자유도 오도메트리**를 낸다. 출력에는 3차원 위치와 회전이 들어간다. [Vizzo 외, IEEE RA-L 2023][paper]

| 단계 | 처리 | 다음 단계로 넘기는 값 |
| --- | --- | --- |
| 전처리 | 점별 시각으로 스캔 왜곡을 보정하고 거리 범위를 적용 | 같은 시각을 기준으로 한 점군 |
| 복셀 샘플링 | 참조 갱신용과 정합 입력용 점군을 서로 다른 해상도로 구성 | 두 해상도의 점군 |
| 스캔 정합 | 직전 이동량으로 예측한 자세에서 point-to-point ICP 반복 | 보정된 센서 자세 |
| 갱신 | 보정된 자세로 참조 점군을 갱신하고 예측 오차를 누적 | 다음 스캔의 참조 점군과 대응 거리 |

## 실제 LiDAR 오도메트리 GIF

공개 Office1 기록의 첫 20초에서 Livox LiDAR 패킷 다섯 개씩을 묶어 200개 스캔을 만들었다. XYZ 점과 점별 시각으로 KISS-ICP v1.3.0을 실행했다. 스캔 왜곡 보정을 켰고, 거리 범위는 0.5~30 m, 기준 복셀은 0.30 m로 설정했다.

<details>
<summary>KISS-ICP 실행 GIF 보기</summary>

![실제 LiDAR 기록을 KISS-ICP로 처리해 추정한 위치와 수평 궤적이 시간 순서대로 그려지는 GIF.](./standalone-odometry.gif)

*선은 추정한 센서의 X/Y 경로이고, 삼각형은 현재 추정 방향이다.*

</details>

*데이터는 [Zhang 외의 Elevator-LIO Dataset, Office1][office1] 일부를 사용했다. [CC BY 4.0][dataset-license]*

## 자세 예측과 스캔 왜곡 보정

스캔 `k`의 센서 좌표를 오도메트리 좌표로 옮기는 변환을 `T[k]`로 두자. 직전 두 자세에서 구한 상대 변환 `Δ = inv(T[k−2]) · T[k−1]`를 한 번 더 적용해 현재 자세의 초기값 `T_pred = T[k−1] · Δ`를 만든다. 이전 두 스캔 사이에 센서가 전진하며 오른쪽으로 돌았다면, 이번에도 비슷한 이동과 회전을 했다고 보고 ICP를 시작한다. 스캔 간격이나 움직임이 급하게 바뀌면 이 초기값이 실제 자세에서 멀어질 수 있다. [파이프라인 코드][pipeline]

LiDAR 점은 한 스캔 안에서도 서로 다른 시각에 찍힌다. 센서가 회전하는 동안 측정한 벽의 좌표를 같은 자세에서 얻은 것처럼 합치면 벽이 휘어 보인다. C++ v1.3.0에서는 점의 시각을 스캔 내부의 상대 시각 `u = 0…1`로 정규화한다. 앞서 구한 이동 `Δ`를 SE(3)에서 보간해 각 점에 `exp((u−1) · log(Δ))`를 적용한다. 가장 늦은 시각의 점은 `u = 1`이라 그대로 두고, 앞서 측정한 점들을 **스캔 끝 시점**에 맞춘다. [전처리 코드][preprocessing]

![회전하는 센서가 관측한 벽 점군. 보정 전에는 측정 시각에 따라 점이 휘어 보이고, 보정 후에는 스캔 끝 좌표계에서 점이 직선으로 정렬된다.](./deskew.png)

*평면 벽을 센서가 32° 회전하면서 관측한다고 가정한 합성 예시. 두 그림의 좌표 축척은 같다.*

ROS 2 bag에서는 `PointCloud2`의 `time`, `t`, `timestamp`, `time_stamp` 같은 점별 시각 필드를 확인한다. `header.stamp`는 메시지 전체의 시각이다. 점별 시각이 없거나 deskew 옵션을 끄면 v1.3.0은 왜곡 보정을 건너뛴다. 드라이버가 이미 보정한 점군을 공급하는지도 함께 확인한다. [전처리 코드][preprocessing] · [ROS 2 시각 필드][ros-timing]

## 참조 점군과 복셀 샘플링

복셀은 공간을 일정한 크기의 정육면체로 나눈 셀이다. 기준 복셀 크기를 `v`라고 하면, v1.3.0은 전처리한 점군에 두 번 샘플링을 적용한다. 첫 번째 `0.5v` 결과는 참조 점군에 추가한다. 이 결과를 `1.5v`에서 다시 줄인 점군은 ICP의 입력으로 넣는다. 예를 들어 `v = 1 m`로 설정하면 참조 점군 갱신에는 0.5 m, ICP 입력을 줄일 때는 1.5 m 복셀을 사용한다. 참조 쪽에는 더 많은 점을 남겨 구조를 보존하고, 반복 계산에 쓰는 입력 점은 줄인다. [파이프라인 코드][pipeline]

논문에서 *local map*이라 부르는 참조 점군은 다음 스캔을 맞추기 위한 데이터다. 복셀 좌표를 키로 쓰는 해시 테이블에 보관하고, 센서에서 멀어진 복셀은 제거한다. 정합할 점이 들어간 셀과 이웃 셀만 보면 주변 후보를 빠르게 찾을 수 있다. 복셀을 지나치게 크게 잡으면 좁은 경계나 작은 구조의 점이 뭉개질 수 있다. [논문 III-B·C][paper] · [복셀 해시 코드][voxel-map]

## 대응점 탐색과 자세 갱신

1. **대응점 탐색.** 현재 자세 `T`로 스캔 점 `p`를 옮긴다. 해당 복셀과 이웃 복셀에서 가장 가까운 참조 점 `q`를 찾는다. 두 점 사이 거리가 허용 범위를 넘으면 이 쌍은 제외한다.
2. **자세 갱신.** 남은 점 쌍의 잔차 `T·p − q`가 작아지도록 이동과 회전을 함께 보정한다. 큰 잔차를 가진 쌍은 강건 커널로 가중치를 낮춘다. 갱신한 자세에서 대응점을 다시 찾고, 수렴 조건이나 최대 반복 횟수에 도달할 때까지 반복한다.

잔차는 점과 점 사이의 3차원 차이다. 센서의 자세가 정해지면 갱신용 점군을 그 자세로 변환해 다음 스캔의 참조 데이터에 넣는다. [논문 III-C·E][paper] · [정합 코드][registration]

![현재 자세로 옮긴 스캔 점과 참조 점 사이에서 짧은 대응은 실선으로 채택되고 긴 대응은 점선으로 제외되는 그림.](./correspondence.png)

*개념도. 상한이 0.90 m라면 0.20 m 쌍은 채택하고 1.10 m 쌍은 제외한다. 상한을 통과한 쌍에는 잔차에 따라 가중치를 준다.*

## 적응형 대응 거리

대응 거리를 너무 작게 잡으면 예측 자세가 조금만 빗나가도 쓸 만한 점 쌍이 사라진다. 너무 크게 잡으면 서로 다른 기둥이나 벽에도 대응이 붙는다. KISS-ICP는 스캔마다 **예측 자세와 ICP 결과가 얼마나 달랐는지** 기록하고, 그 차이로 다음 스캔의 거리 상한을 계산한다. [논문 III-D][paper]

예측에서 정합 결과로 바뀔 때 이동량이 `‖Δt‖`, 회전각이 `θ`, 센서의 설정 최대 거리가 `R`이면 점이 움직일 수 있는 거리의 상한을 다음과 같이 잡는다.

```text
e = ‖Δt‖ + 2R·sin(θ/2)
σ = RMS(e)  (최소 기준을 넘은 과거 오차)
대응 거리 상한 = 3σ
```

예를 들어 회전 오차가 1°, `R = 20 m`라면 회전 항은 약 0.35 m다. 같은 회전이라도 거리가 먼 점이 더 크게 움직인다는 뜻이다. 예측 오차를 바탕으로 한 상한으로 후보를 먼저 거르고, 통과한 후보 중 큰 잔차의 영향은 강건 커널이 줄인다. [임계값 코드][threshold] · [파이프라인 코드][pipeline]

## 논문의 KITTI 비교

저자들은 KITTI raw의 대응 시퀀스에서 동일 계열 파이프라인에 스캔 왜곡 보정 방식을 달리 적용했다. 오차는 경로의 여러 구간에서 구한 **상대 오차의 평균**이다. [논문 표 V][paper]

| 스캔 왜곡 보정 | 평균 상대 이동 오차 | 평균 처리율 |
| --- | ---: | ---: |
| 보정 없음 | 0.91% | 51 Hz |
| IMU에서 추정한 운동으로 보정 | 0.51% | 38 Hz |
| 직전 이동 기반 등속 모델로 보정 | 0.49% | 38 Hz |

저자들의 실험 환경에서는 등속 모델로 스캔을 보정했을 때 평균 상대 이동 오차가 줄었고, 처리율은 51 Hz에서 38 Hz로 낮아졌다. 급회전이 많거나 스캔 간격이 불규칙한 기록을 쓸 때는 같은 bag에서 보정 켜기와 끄기를 비교하고, 급회전 직후 벽 모양과 자세 변화가 함께 개선되는지 본다.

[논문][paper] · [DOI][doi] · [공식 구현 및 시연 영상][repository]

[paper]: https://arxiv.org/html/2209.15397v2
[doi]: https://doi.org/10.1109/LRA.2023.3236571
[repository]: https://github.com/PRBonn/kiss-icp/tree/v1.3.0
[pipeline]: https://github.com/PRBonn/kiss-icp/blob/v1.3.0/cpp/kiss_icp/pipeline/KissICP.cpp
[preprocessing]: https://github.com/PRBonn/kiss-icp/blob/v1.3.0/cpp/kiss_icp/core/Preprocessing.cpp
[registration]: https://github.com/PRBonn/kiss-icp/blob/v1.3.0/cpp/kiss_icp/core/Registration.cpp
[threshold]: https://github.com/PRBonn/kiss-icp/blob/v1.3.0/cpp/kiss_icp/core/Threshold.cpp
[voxel-map]: https://github.com/PRBonn/kiss-icp/blob/v1.3.0/cpp/kiss_icp/core/VoxelHashMap.cpp
[ros-timing]: https://github.com/PRBonn/kiss-icp/blob/v1.3.0/ros/src/Utils.hpp
[office1]: https://huggingface.co/datasets/xiaofan0100/Elevator-LIO-Dataset/blob/main/Office1.bag
[dataset-license]: https://creativecommons.org/licenses/by/4.0/
