---
title: "[Jetson] 전력 모드별 CUDA 실행 시간 측정"
slug: "jetson-cuda-power-benchmark"
date: "2026-11-23"
category: "시스템 통합"
tags: [Jetson, CUDA, 벤치마크]
summary: "전력 모드별 GPU 실행 시간과 온도 비교 방법."
---

같은 CUDA 연산도 전력 모드와 온도에 따라 실행 시간이 달라질 수 있다. 전력 모드의 이름에 적힌 와트 수는 설정을 구분하는 값이다. 실측 소비전력이나 GPU 클럭은 따로 기록한다.

## 측정 범위

| 지표 | 측정 구간 |
| --- | --- |
| 커널 실행 시간 | 같은 CUDA 스트림에서 커널 전후에 이벤트를 기록한다. 종료 이벤트가 완료된 뒤 `cudaEventElapsedTime()`으로 간격을 읽는다. |
| 전체 처리 시간 | 호스트에서 입력 준비부터 결과를 사용할 수 있을 때까지 잰다. 실제 처리 과정에 포함된 복사와 동기화도 측정 범위에 둔다. |

커널 호출은 비동기다. 호출 전후를 호스트 시계로 재면 GPU가 작업을 끝내기 전에 타이머가 멈출 수 있다. [CUDA 타이밍 가이드](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#using-cuda-gpu-timers).

## 비교 절차

전력 모드는 보드와 Jetson Linux 버전에 맞는 지원 목록에서 고른다. 모드 변경에 재부팅이 필요한 경우 부팅 후 다시 확인한다. [Jetson Orin 전력 관리](https://docs.nvidia.com/jetson/archives/r36.5/DeveloperGuide/SD/PlatformPowerAndPerformance/JetsonOrinNanoSeriesJetsonOrinNxSeriesAndJetsonAgxOrinSeries.html).

```bash
sudo nvpmodel -q
tegrastats --interval 500
```

1. 같은 보드·바이너리·입력으로 비교한다. 벡터 덧셈이라면 원소 수와 데이터 타입을 고정하고, 버퍼 할당은 커널 측정 구간 밖에서 한다.
2. 모드마다 비슷한 시작 온도에서 동일한 횟수만큼 워밍업한 뒤 반복 측정한다. 팬 설정과 백그라운드 부하도 맞춘다.
3. 커널과 전체 처리 시간의 중앙값·95백분위수(p95)를 따로 기록한다. 옆 터미널의 `tegrastats`에서 GPU·메모리 클럭과 온도 추이를 함께 본다. [Tegrastats 출력 항목](https://docs.nvidia.com/jetson/archives/r36.5/DeveloperGuide/AT/JetsonLinuxDevelopmentTools/TegrastatsUtility.html).

커널이 빨라져도 전체 시간이 비슷하면 복사나 CPU 전처리 구간을 본다. 반복 실행 중 느려지면 온도와 클럭이 함께 변했는지 확인한다. 추론이나 영상 처리에 적용할 모드는 실제 작업을 같은 절차로 다시 측정해 고른다.

빌드 설정은 [Jetson CUDA 개발 환경과 CMake](/blog/jetson-cuda-development)에 정리했다.
