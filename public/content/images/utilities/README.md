# 유틸리티 화면 자료

그림으로 재구성한 UI가 아니라 실제 프로그램을 렌더링하거나 공개 저장소의 원본 캡처를 사용했습니다. 테마·색상은 앱이 지원하는 범위에서 유지합니다. 캡처가 실기기 연결·성능 측정을 뜻하지 않도록 각 상세 페이지에 조건을 표시합니다.

| 프로그램 | 자료·조건 |
| --- | --- |
| LiDAR Studio | b291d9ac8792775cfdb52f0b6368d7be292b01e6의 docs/images 원본 3장과 docs/media/demo.mp4의 22초 export.png. KITTI 정적 화면과 Patchwork++ 데모 입력을 구분하고 출처·CC BY-NC-SA 3.0·BSD 고지를 lidar-studio/README.md에 보존 |
| Map Editor | 기존 공개 웹앱의 office 예제 캡처 4장을 재사용. desktop.png는 3cbe3147343cb99e20a9ffca413abfb70ee89655의 docs/light.png 원본. crop.png는 2026-11-14 밝은 웹앱에서 동일 공개 예제를 잘라 캡처. 로그인·클라우드 쓰기 없이 ZIP 세 레이어의 크기·원점 일치 확인 |
| Ubuntu Status Bar | 34e6f3accfe1bbaaa9bc153ec3b0f743bf6c8e56의 docs/menu.png·topbar.png·settings.png. 이름 변경 전 GNOME 46 테스트 화면이며 센서 수치는 당시 장치의 순간값 |
| Volidge | 7315cc69bb16bdb3e33760973997f11668979648의 실제 ControlPanel SwiftUI 뷰를 AppKit 밝은 외관에서 렌더링. 상단 제어부만 캡처했으며 드라이버 설치·오디오 라우팅·마이크 접근은 수행하지 않음 |
| Capture Viewer | b540049585949252dfc4e4048ae532eb3d6472c4의 실제 PySide6 창·도움말. 격리한 설정과 장치 미사용 데모 신호로 생성 |
| WiFi Analyzer | 3753d57c93b258a2807caa74fdef390dc1d21207의 tools/capture_preview.py. GitHub Actions run 43485316560, Linux/Xvfb에서 예시 AP·시계열을 실제 Tkinter GUI에 연결. Wi-Fi 스캔·위치 권한·개인 SSID/BSSID를 사용하지 않음 |

스크린샷의 알고리즘 결과·수신 FPS·자원 사용률·무선 진단을 일반적인 정확도나 성능 보장으로 해석하지 않습니다. 배포 파일의 검증 범위는 각 프로그램의 워크플로·README와 소개 페이지의 한계를 따릅니다.
