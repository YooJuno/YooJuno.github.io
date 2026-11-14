# LiDAR Studio 화면 출처

## KITTI 자료

`roi.png`는 b291d9ac8792775cfdb52f0b6368d7be292b01e6의 docs/images 원본입니다. `detection.png`는 4107c96b558ec73ccb3b418c1d66f57c43472769의 docs/media/object-detection.mp4에서 4초 프레임을 추출한 1120×524 이미지입니다. UI·박스·수치를 재구성하지 않았습니다.

- 원본: https://github.com/YooJuno/lidar_studio/tree/b291d9ac8792775cfdb52f0b6368d7be292b01e6/docs/images
- 데이터: KITTI Raw, 2011_09_26_drive_0005_sync, Velodyne scan 0000000041.bin.
- 저자: Andreas Geiger, Philip Lenz, Christoph Stiller, Raquel Urtasun.
- 참고: Vision meets Robotics: The KITTI Dataset, IJRR, 2013.
- 데이터 출처·이용 조건: https://www.cvlibs.net/datasets/kitti/raw_data.php 및 https://www.cvlibs.net/datasets/kitti/
- 파생 이미지 라이선스: CC BY-NC-SA 3.0 — https://creativecommons.org/licenses/by-nc-sa/3.0/

ROI는 수동 영역이며, 검출 영상은 FugSeg로 지면을 숨기고 CenterPoint tiny v4.1의 Car 예측·추적 ID를 표시합니다. 영상은 스캔 20–109를 10 Hz로 재생한 자료입니다. 정답 라벨·성능 벤치마크가 아닙니다. [영상 출처·캡처 조건](https://github.com/YooJuno/lidar_studio/blob/4107c96b558ec73ccb3b418c1d66f57c43472769/docs/media/SOURCE.md). 이 이미지의 이용 조건을 사이트 전체나 프로그램 소스의 라이선스로 확장하지 않습니다.

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
