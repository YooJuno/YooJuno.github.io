# LiDAR 시리즈 화면 출처

## 프로그램·실행 조건

- 프로그램: [LiDAR Studio](https://github.com/YooJuno/lidar_studio), 공개 커밋 `4107c96b558ec73ccb3b418c1d66f57c43472769`.
- 캡처일: 2026-11-15, Asia/Seoul.
- ROS·CUDA 없는 Linux ARM64 CPU 빌드, 격리한 Docker/Xvfb에서 실행.
- 앱·설정·모델 저장소는 임시 경로로 분리. 기존 앱·사용자 프로파일·실제 센서·녹화·카메라·오디오 장치를 사용하지 않음.
- 앱의 실제 Light 테마, 1440×900 PNG. 합성 박스·정답 주석·색상 반전·이미지 재구성·속도 보정 없음.
- 원본 파일은 각 글 폴더의 `studio-*.png`. SVG 두 개는 별도로 작성한 원리 설명용 개념도이며 센서 캡처가 아님.

| 캡처 | 실제 설정 |
| --- | --- |
| `studio-fugseg.png` | FugSeg, All points, 객체 분석 끔 |
| `studio-gseg3d.png` | GSeg3D, All points, 객체 분석 끔 |
| `studio-clusters-3d.png` | FugSeg 비지면, Euclidean 3D, 학습 검출 끔 |
| `studio-clusters-xy.png` | 동일 입력·FugSeg, Projected XY, 학습 검출 끔 |
| `studio-detection-035.png` | CenterPoint tiny v4.1, CPU, 모든 클래스, 표시 점수 0.35, FugSeg 비지면 표시, 군집·추적 끔 |
| `studio-detection-060.png` | 동일 프레임의 캐시된 예측, 표시 점수만 0.60으로 변경 |

모든 화면은 공개 예제의 동일한 `000000.bin` 한 프레임이다. 지면은 빨간 점, 비지면은 앱의 Uniform 점 색상으로 표시한다. 클러스터 박스와 모델 클래스 박스를 서로 다른 처리로 구분한다.

기본 수치·설정은 해당 커밋의 `config/algorithms.yaml`을 사용했다. 수동 yaw·pitch·roll·z 이동은 0, IMU leveling·ROI는 껐다. 파일의 초기 z 12% 높이 보정 이후, 근방 바닥을 참고한 Ground reference는 0.22 m다. 외부 파라미터나 정답 라벨을 측정한 값이 아니다. 객체 검출은 이 지면 분리보다 앞선 전체 정렬 점군을 받는다.

```ini
theme=light
ui_scale=1.1
inspector_width=335
color_mode=2
point_size=2
gseg3d_ground_height_m=0.22
camera_target_x=8
camera_target_y=0
camera_target_z=0
camera_yaw_rad=-0.8
camera_pitch_rad=0.85
camera_distance=55
clustering_tolerance_m=0.55
clustering_vertical_gap_m=2.5
```

화면의 점 수·평균 시간·UI fps는 캡처 시 앱 상태다. 정답 대비 정확도, 알고리즘 공정 비교, 주행·센서 검증, 실시간 성능 벤치마크로 제시하지 않는다.

## 검출 모델

- [AutowareFoundation/lidar_centerpoint](https://huggingface.co/AutowareFoundation/lidar_centerpoint/tree/494c8171def40bd36cc2feb323e0a5acbfab132b), `tiny/`의 원본 encoder·head.
- 기준 revision: `494c8171def40bd36cc2feb323e0a5acbfab132b`, 모델 카드 고지 Apache-2.0.
- 앱의 모델 설치 코드가 ONNX 파일 SHA-256을 검증한 뒤 CPUExecutionProvider로 실행했다. 별도 학습·가중치 변경 없음.
- 어댑터는 [고정 소스의 `centerpoint.py`](https://github.com/YooJuno/lidar_studio/blob/4107c96b558ec73ccb3b418c1d66f57c43472769/python/lidar_detection/centerpoint.py).
- 이 사이트에는 모델·원시 스캔을 포함하지 않고 렌더링된 예측 화면만 포함한다. 예측은 정답이 아니다.

## 예제 점군·원본 고지

- 출처: [KAIST Urban Robotics Lab, Patchwork++ 예제](https://github.com/url-kaist/patchwork-plusplus/tree/3e6903a1d5537a4cc2ace897b0bbb98a92d6014c/data), `000000.bin`.
- 파일 SHA-256: `bf272996d5b6d25cc5589e1089137cb20a98b63bd4823a7fea5631b359f6d68c`.
- 원저장소 고지: BSD 2-Clause. 아래 고지를 보존한다. 프로그램·모델·다른 블로그 자료의 라이선스까지 이 고지로 바꾸는 것은 아니다.

BSD 2-Clause License

Copyright (c) 2024, Urban Robotics Lab. @ KAIST

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
