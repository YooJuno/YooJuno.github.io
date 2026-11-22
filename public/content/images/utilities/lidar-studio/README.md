# LiDAR Studio 화면 출처

## 데이터셋 시연 GIF

GIF와 PNG 미리보기는 실제 LiDAR Studio 화면에서 만들었습니다. GIF 인코딩 과정에서 크기와 색상 수를 줄였습니다.

| 데모 | 데이터와 화면 기록 |
| --- | --- |
| `object-detection` | KITTI Raw `2011_09_26_drive_0005_sync`, 스캔 82–153을 10 Hz로 기록했습니다. `23f4a09` 빌드에서 AWML ShortRange(최소 점수 0.60), 승용차·자전거 추적 ID와 최근 궤적을 켜고 FugSeg로 분리한 지면을 숨겼습니다. [캡처 설정](https://github.com/YooJuno/lidar_studio/blob/c8cd339b164f28636bb4be98e250e7d1de5bf252/docs/media/SOURCE.md). |
| `ground-segmentation` | 같은 KITTI Raw 기록의 스캔 20–109를 사용했습니다. [원본 데모와 캡처 설정](https://github.com/YooJuno/lidar_studio/blob/a97eb7dc8fd8051602a5a4e4e4e3070528f3d193/docs/media/SOURCE.md). |
| `elevator-lio-replay` | Elevator-LIO `Campus1`, Livox MID-360. ROS 2로 변환한 기록의 시작 부분을 `CustomMsg` 지원을 추가한 로컬 빌드에서 재생했습니다. |
| `urbanv2x-panorama`, `urbanv2x-clustering` | UrbanV2X `hkstp_s_02`, Hesai AT128P. 각각 앱의 141–181번과 140–185번 연속 스캔을 10 Hz 기록 시간에 맞춰 편집했습니다. |
| `roi-export`, `dataset-review` | 같은 UrbanV2X 기록의 첫 7프레임에서 도로변 ROI를 추출하고, 저장된 샘플 7개를 검수했습니다. |
| `driving-examples` | 앱에서 저장된 UrbanV2X AT128P 30초 기록을 열고 3D에서 2D로 전환했습니다. |

- **KITTI Raw** · Andreas Geiger, Philip Lenz, Christoph Stiller, Raquel Urtasun. [데이터](https://www.cvlibs.net/datasets/kitti/raw_data.php) · [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/)
- **UrbanV2X** · Qijun Qin 외, TAS Lab / The Hong Kong Polytechnic University. [데이터](https://huggingface.co/datasets/polyutaslab/UrbanV2X) · [논문](https://doi.org/10.1109/ITSC60802.2025.11423762) · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
- **Elevator-LIO Dataset** · Yifan Zhang 외. [데이터](https://huggingface.co/datasets/xiaofan0100/Elevator-LIO-Dataset) · [논문](https://arxiv.org/abs/2605.24495) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

## KITTI 자료

`roi.png`는 b291d9ac8792775cfdb52f0b6368d7be292b01e6의 docs/images 원본입니다. `detection.png`는 4107c96b558ec73ccb3b418c1d66f57c43472769의 docs/media/object-detection.mp4에서 4초 프레임을 추출한 1120×524 이미지입니다. UI·박스·수치를 재구성하지 않았습니다.

- 원본: https://github.com/YooJuno/lidar_studio/tree/b291d9ac8792775cfdb52f0b6368d7be292b01e6/docs/images
- 데이터: KITTI Raw, 2011_09_26_drive_0005_sync, Velodyne scan 0000000041.bin.
- 저자: Andreas Geiger, Philip Lenz, Christoph Stiller, Raquel Urtasun.
- 참고: Vision meets Robotics: The KITTI Dataset, IJRR, 2013.
- 데이터 출처·이용 조건: https://www.cvlibs.net/datasets/kitti/raw_data.php 및 https://www.cvlibs.net/datasets/kitti/
- 파생 이미지 라이선스: CC BY-NC-SA 3.0 — https://creativecommons.org/licenses/by-nc-sa/3.0/

ROI는 수동 영역입니다. 이 절의 `detection.png`는 해당 버전에서 스캔 20–109를 10 Hz로 재생하며 FugSeg 지면 숨김과 CenterPoint tiny v4.1의 승용차 예측·추적 ID를 표시한 기록에서 가져왔습니다. [이전 영상의 출처·캡처 조건](https://github.com/YooJuno/lidar_studio/blob/4107c96b558ec73ccb3b418c1d66f57c43472769/docs/media/SOURCE.md).

## 밝은 CPU 빌드 화면

`ground.png`, `panorama.png`, `export.png`는 4107c96b558ec73ccb3b418c1d66f57c43472769의 ROS 없는 CPU 빌드를 Linux/Xvfb에서 실행한 1600×960 캡처입니다. 앱의 Light 테마와 공개 Patchwork++ 스캔 000000.bin을 사용했습니다. 실시간 센서·물리 장치·알고리즘 정확도·처리 지연을 측정한 자료가 아닙니다. KITTI 영상에서 가져온 이미지와 구분합니다.

- 입력: [KAIST Urban Robotics Lab의 Patchwork++ 예제 스캔](https://github.com/url-kaist/patchwork-plusplus/tree/3e6903a1d5537a4cc2ace897b0bbb98a92d6014c/data), `000000.bin`.
- 원본 데이터 고지: BSD 2-Clause, 아래 전문 보존. 원본 BIN은 이 사이트에 포함하지 않습니다.

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
