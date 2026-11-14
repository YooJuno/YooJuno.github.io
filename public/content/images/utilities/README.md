# 유틸리티 화면 자료

그림으로 재구성한 UI가 아니라 실제 프로그램을 렌더링하거나 공개 저장소의 원본 캡처를 사용했습니다. 테마·색상은 앱이 지원하는 범위에서 유지합니다. 캡처가 실기기 연결·성능 측정을 뜻하지 않도록 각 상세 페이지에 조건을 표시합니다.

| 프로그램 | 자료·조건 |
| --- | --- |
| LiDAR Studio | 4107c96b558ec73ccb3b418c1d66f57c43472769의 CPU 빌드를 Linux/Xvfb 라이트 테마에서 실행한 점군·파노라마·ROI 내보내기. 공개 Patchwork++ 예제만 사용. KITTI ROI와 검출 영상 프레임은 lidar-studio/README.md에 원본·라이선스 별도 표기 |
| Map Editor | 공개 office 예제를 사용한 밝은 웹앱 화면과 9dd0a6803c13bf0da86efcffcad623404d352e31 배포의 모바일 속성 시트. desktop.png는 3cbe3147343cb99e20a9ffca413abfb70ee89655의 docs/light.png. 로그인·클라우드 쓰기 없이 캡처 |
| Ubuntu Status Bar | 34e6f3accfe1bbaaa9bc153ec3b0f743bf6c8e56의 docs/menu.png·topbar.png·settings.png. GNOME 46 테스트 세션이며 센서 수치는 당시 장치의 순간값 |
| Volidge | 로컬 HEAD 6aba351b707c273a30a5ea855fd4fe530ce0d34a와 작업본의 실제 ControlPanel SwiftUI 뷰. 예시 장치·진단 값을 주입하고 밝은 제어부만 렌더링. AudioRouter·드라이버·마이크 미사용. 화면의 8.0 ms는 예시이며 실측 지연 아님. 작업본 SHA-256은 volidge.json의 sourceSnapshot에 기록 |
| Capture Viewer | b540049585949252dfc4e4048ae532eb3d6472c4의 실제 PySide6 창·도움말. 격리한 설정과 장치 미사용 데모 신호로 생성 |
| WiFi Analyzer | 공개 codex/professional-analyzer 브랜치 4ea5e260738a1f7abb0ffb1b02d475f96e052f4c의 tools/capture_preview.py. Linux/Xvfb의 실제 Tkinter GUI에 예시 AP·시계열을 연결해 5개 탭 캡처. Wi-Fi 스캔·위치 권한·개인 SSID/BSSID 미사용 |

스크린샷의 알고리즘 결과·수신 FPS·자원 사용률·무선 진단을 일반적인 정확도나 성능 보장으로 해석하지 않습니다. 배포 파일의 검증 범위는 각 프로그램의 워크플로·README와 소개 페이지의 한계를 따릅니다.
