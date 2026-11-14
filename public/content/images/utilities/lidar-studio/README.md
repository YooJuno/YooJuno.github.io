# LiDAR Studio 화면 출처

`ground.png`, `roi.png`, `detection.png`는 YooJuno/lidar_studio의 b291d9ac8792775cfdb52f0b6368d7be292b01e6 커밋에 포함된 실제 앱 캡처를 파일명만 바꾸어 가져왔습니다. 앱의 원래 UI와 데이터 표시를 변경하지 않았습니다.

- 원본: https://github.com/YooJuno/lidar_studio/tree/b291d9ac8792775cfdb52f0b6368d7be292b01e6/docs/images
- 데이터: KITTI Raw, 2011_09_26_drive_0005_sync, Velodyne scan 0000000041.bin.
- 저자: Andreas Geiger, Philip Lenz, Christoph Stiller, Raquel Urtasun.
- 참고: Vision meets Robotics: The KITTI Dataset, IJRR, 2013.
- 데이터 출처·이용 조건: https://www.cvlibs.net/datasets/kitti/raw_data.php 및 https://www.cvlibs.net/datasets/kitti/
- 파생 이미지 라이선스: CC BY-NC-SA 3.0 — https://creativecommons.org/licenses/by-nc-sa/3.0/

지면 분리는 FugSeg 적용 예시, ROI는 수동 영역, 객체 박스는 CenterPoint tiny 예측입니다. 정답 라벨·성능 벤치마크가 아닙니다. 이 이미지의 이용 조건을 사이트 전체나 프로그램 소스의 라이선스로 확장하지 않습니다.

## 내보내기 화면

`export.png`는 같은 커밋의 [docs/media/demo.mp4](https://github.com/YooJuno/lidar_studio/blob/b291d9ac8792775cfdb52f0b6368d7be292b01e6/docs/media/demo.mp4)에서 22초의 원본 프레임을 PNG로 추출했습니다. UI·수치·배경을 재구성하지 않았습니다. 이 영상은 KITTI가 아니라 6프레임 Quick preview를 사용합니다.

- 영상·추출 화면: CC BY-NC-SA 3.0. [영상 원본의 출처 안내](https://github.com/YooJuno/lidar_studio/blob/b291d9ac8792775cfdb52f0b6368d7be292b01e6/docs/media/SOURCE.md).
- 입력: [KAIST Urban Robotics Lab의 Patchwork++ 예제 스캔](https://github.com/url-kaist/patchwork-plusplus/tree/3e6903a1d5537a4cc2ace897b0bbb98a92d6014c/data), `000000.bin`–`000005.bin`.
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
