---
title: "Windows C++ 개발 환경: WSL·MSYS2"
slug: "windows-wsl-cpp"
date: "2026-11-15"
updated: "2026-11-15"
category: "개발 환경·배포"
tags: [Windows, WSL, C++]
summary: "Linux 개발용 WSL과 Windows 실행 파일용 도구 구분."
---

Windows에서 C++을 개발할 때는 **어느 OS에서 실행할 바이너리인지** 먼저 정한다. WSL의 Linux 바이너리와 Windows의 `.exe`는 서로 다른 산출물이다.

## 1. 환경 선택

| 환경 | 주 대상 | 주의점 |
| --- | --- | --- |
| WSL 2 + Ubuntu | Linux·ROS·서버용 개발 | Linux 경로·패키지·권한 사용 |
| MSVC + CMake | Windows 네이티브 앱 | MSVC와 의존성 ABI 일치 |
| MSYS2 UCRT64 | GCC 기반 Windows 앱 | UCRT64 터미널·패키지 계열 일치 |

Windows 라이브러리를 WSL Linux 실행 파일에 그대로 링크할 수 없다. 헤더 검색 경로뿐 아니라 라이브러리의 OS·아키텍처·컴파일러 구성이 맞아야 한다.

## 2. WSL 설치와 확인

지원되는 Windows에서 관리자 PowerShell로 설치한다. 가상화 기능이 비활성화돼 있으면 펌웨어 설정도 확인한다.

```powershell
wsl --install
wsl --update
wsl --list --verbose
```

배포판별 지원 버전과 설치 조건은 [Microsoft WSL 안내](https://learn.microsoft.com/en-us/windows/wsl/install)를 따른다. 설치 후 Ubuntu 터미널에서 Linux 사용자 계정을 만들고 개발 도구를 설치한다.

```bash
sudo apt update
sudo apt install build-essential cmake ninja-build pkg-config
g++ --version
cmake --version
```

Linux 빌드 작업은 보통 `~/workspace`처럼 Linux 파일 시스템 안에서 진행한다. Windows 경로 `/mnt/c/...`와 혼용할 때 파일 I/O·대소문자·권한 차이를 확인한다.

## 3. GUI와 OpenGL

WSLg를 지원하는 WSL 2 환경은 Linux GUI 앱을 통합 실행할 수 있다. 드라이버·WSL 버전을 먼저 확인한다. [WSL GUI 앱](https://learn.microsoft.com/en-us/windows/wsl/tutorials/gui-apps).

OpenGL 문제가 있을 때 다음처럼 **해당 프로세스에만** 소프트웨어 렌더링을 적용해 원인을 분리할 수 있다.

```bash
LIBGL_ALWAYS_SOFTWARE=1 glxinfo -B
```

`glxinfo`는 Ubuntu에서 `mesa-utils` 패키지로 제공된다. 이 설정은 GPU 가속을 우회하므로 시뮬레이터 성능이 크게 낮아질 수 있다. 셸 전체의 영구 기본값으로 넣기보다 드라이버·렌더러·실행 환경을 점검하는 진단용으로 사용한다.

## 4. MSYS2와 네이티브 GCC

MSYS2를 설치한 뒤 **UCRT64 터미널**에서 해당 계열의 GCC 도구를 사용한다. 서로 다른 환경의 `bin` 폴더를 Windows PATH에 한꺼번에 추가하지 않는다. [MSYS2 환경 구분](https://www.msys2.org/docs/environments/).

```bash
pacman -S --needed mingw-w64-ucrt-x86_64-gcc
g++ --version
g++ -std=c++17 main.cpp -o main.exe
```

명령은 x86_64 UCRT64 예시다. 다른 아키텍처·MSVC 의존성을 사용하는 프로젝트에는 다른 도구 구성이 필요하다. 오래된 MinGW 설치 화면을 그대로 따라가기보다 유지되는 도구체인과 프로젝트의 지원 조합을 선택한다.

## 5. CMake·vcpkg 연동

Windows 네이티브 의존성은 vcpkg의 triplet과 CMake toolchain을 맞춘다. `x64-windows`와 `x64-mingw-*`, Linux 패키지는 같은 바이너리가 아니다.

gRPC·OpenCV처럼 여러 라이브러리가 연결되는 프로젝트는 컴파일러·런타임·Debug/Release·아키텍처를 함께 기록한다. [gRPC·Protobuf C++ 통신](/blog/grpc-protobuf-cpp), [CMake·OpenCV·Eigen](/blog/cmake-opencv-eigen).
