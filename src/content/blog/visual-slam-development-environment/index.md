---
title: "Visual SLAM 빌드·실행 환경"
slug: "visual-slam-development-environment"
date: "2026-11-15"
category: "Perception"
tags: [SLAM, OpenCV, ROS2]
summary: "구현별 의존성·입력·캘리브레이션과 재현 조건."
---

SLAM 구현을 실행하려면 알고리즘 이름뿐 아니라 입력 형식·카메라 모델·캘리브레이션·의존성 버전을 맞춰야 한다. 이 글은 실행 환경 정리이며 성능 비교나 특정 장치의 동작 검증 결과는 아니다.

## 1. 구현별 확인 항목

| 구현 | 주로 확인할 환경·입력 | 시작 자료 |
| --- | --- | --- |
| ORB-SLAM3 | 카메라·IMU 조합, Vocabulary, OpenCV·Eigen·Pangolin | [공식 저장소](https://github.com/UZ-SLAMLab/ORB_SLAM3) |
| stella_vslam | 카메라 모델, FBoW, core·examples·viewer 조합 | [공식 설치 문서](https://stella-cv.readthedocs.io/en/latest/installation.html) |
| RTAB-Map | core와 ROS wrapper, 센서 토픽·odometry·TF | [ROS 2 저장소](https://github.com/introlab/rtabmap_ros) |
| Isaac ROS Visual SLAM | NVIDIA 플랫폼·지원 릴리스·드라이버·ROS·입력 토픽 | [공식 저장소](https://github.com/NVIDIA-ISAAC-ROS/isaac_ros_visual_slam) |

프로젝트마다 서로 다른 의존성 fork를 사용할 수 있다. 이름이 같은 g2o·Pangolin을 설치했다는 사실만으로 호환성을 보장하지 않는다. 소스와 문서의 릴리스를 함께 고정한다.

## 2. ORB-SLAM3와 EuRoC

공식 저장소의 의존성을 준비한 뒤 `build.sh`로 라이브러리·예제를 빌드한다. 이 스크립트에는 third-party 빌드도 포함되므로 메모리·컴파일러·C++ 표준 오류가 발생한 단계를 나눠 확인한다.

EuRoC stereo 예제는 저장소 루트에서 다음 형식으로 실행할 수 있다. 데이터 경로는 준비한 데이터셋에 맞춘다.

```bash
./Examples/Stereo/stereo_euroc Vocabulary/ORBvoc.txt \
  Examples/Stereo/EuRoC.yaml /path/to/MH01 \
  Examples/Stereo/EuRoC_TimeStamps/MH01.txt
```

Monocular와 Stereo 실행 파일을 혼동하지 않는다. 카메라만 사용하는 모드와 IMU가 필요한 모드는 입력·초기화 조건도 다르다. 단안의 절대 스케일 문제와 IMU를 추가했을 때의 관측 조건은 별개로 이해해야 한다.

ATE를 계산할 때는 기준 궤적·타임스탬프 연관·좌표 정렬·스케일 보정 사용 여부를 함께 기록한다. 서로 다른 정렬 조건으로 나온 숫자를 직접 비교하지 않는다.

## 3. stella_vslam: mapping과 localization

core 라이브러리, examples 실행 파일, 선택한 viewer의 버전을 맞춘다. Vocabulary·영상·설정 파일 경로를 각각 지정한다.

공식 영상 예제의 주요 옵션은 다음과 같다.

| 옵션 | 의미 |
| --- | --- |
| `-v` | ORB Vocabulary |
| `-m` | 입력 영상 |
| `-c` | 카메라·추적 설정 |
| `--map-db-out` | 생성한 맵 저장 |
| `--map-db-in` | 기존 맵 입력 |
| `--disable-mapping` | 맵 갱신을 끄고 위치 추정 |

equirectangular·fisheye·perspective 설정을 임의로 교환하지 않는다. 영상의 해상도·카메라 모델과 설정이 맞아야 한다. [공식 실습](https://stella-cv.readthedocs.io/en/latest/simple_tutorial.html).

과거 Ubuntu에서 사용한 특정 OpenEXR·spdlog 패키지 이름을 다른 OS 버전에 그대로 설치하기보다, 선택한 릴리스가 요구하는 의존성으로 다시 빌드하는 편이 재현 가능하다.

## 4. RTAB-Map과 Isaac ROS

RTAB-Map의 ROS 2 소스 빌드는 core와 wrapper의 지원 버전을 확인하고, 일반 ROS 워크스페이스에서 `rosdep`·`colcon`으로 의존성을 관리한다. 바이너리 패키지로 충분한 환경에 소스 overlay를 불필요하게 추가하지 않는다.

Isaac ROS는 릴리스에 따라 ROS 배포판·JetPack·CUDA·컨테이너 구성이 달라진다. 예를 들어 3.1 문서는 Humble 기반이므로 Jazzy 환경에 패키지 이름만 바꿔 적용하지 않는다. [Isaac ROS 3.1 Visual SLAM](https://nvidia-isaac-ros.github.io/v/release-3.1/repositories_and_packages/isaac_ros_visual_slam/index.html).

맵 저장·불러오기 서비스도 버전에 따라 달라질 수 있다. 실제 실행 중인 환경의 `ros2 service list -t`·`ros2 interface show`로 타입을 확인한 뒤 호출한다.

## 5. 실행 전 체크리스트

- 입력 토픽·파일 형식·색상·해상도·프레임률.
- 카메라 내부 파라미터·왜곡 모델·stereo baseline·camera–IMU 외부 파라미터.
- 타임스탬프 단위·센서 동기화·ROS clock 기준.
- optical frame·base frame·TF 방향과 좌표축.
- 코드·설정·Vocabulary·맵 파일 버전과 해시.

실행 창이 뜨는 것과 올바른 좌표·스케일·시간으로 추정하는 것은 다르다. 데이터셋 예제로 설치를 확인한 뒤 실제 센서 입력을 검증한다.
