---
title: "CMake·OpenCV·Eigen 개발 환경"
slug: "cmake-opencv-eigen"
date: "2026-11-15"
updated: "2026-11-15"
category: "개발 환경·배포"
tags: [CMake, OpenCV, Eigen]
summary: "라이브러리 검색·타깃 연결·버전 충돌과 빌드 진단."
---

라이브러리 설치, 컴파일러의 헤더 검색, 링커 연결, 실행 시 공유 라이브러리 검색은 서로 다른 단계다. 오류가 발생한 단계를 먼저 구분한다.

## 1. 설치 방식과 버전

Ubuntu에서 배포판 패키지를 사용할 수 있는 프로젝트라면 다음처럼 시작한다.

```bash
sudo apt update
sudo apt install build-essential cmake pkg-config libopencv-dev libeigen3-dev
pkg-config --modversion opencv4
pkg-config --modversion eigen3
```

패키지 관리자로 설치한 OpenCV와 `/usr/local`의 소스 빌드, Conda·pip의 `cv2`는 서로 다른 설치일 수 있다. Python의 `cv2.__version__`만으로 C++ 프로젝트에 연결된 OpenCV 버전을 판단하지 않는다.

특정 OpenCV 버전이 필요하면 별도 prefix에 설치하고 프로젝트에서 선택한다. `opencv`와 `opencv_contrib`의 버전·태그는 맞춘다. 시스템 패키지를 와일드카드로 일괄 제거하는 작업은 피한다. [OpenCV 소스 빌드](https://docs.opencv.org/4.x/d7/d9f/tutorial_linux_install.html).

## 2. 최소 CMake 예제

`CMakeLists.txt`:

```cmake
cmake_minimum_required(VERSION 3.16)
project(vision_check LANGUAGES CXX)

find_package(OpenCV 4 REQUIRED COMPONENTS core)
find_package(Eigen3 3.3 REQUIRED NO_MODULE)

add_executable(vision_check main.cpp)
target_compile_features(vision_check PRIVATE cxx_std_17)
target_include_directories(vision_check PRIVATE ${OpenCV_INCLUDE_DIRS})
target_link_libraries(vision_check PRIVATE ${OpenCV_LIBS} Eigen3::Eigen)
```

`main.cpp`:

```cpp
#include <Eigen/Core>
#include <opencv2/core.hpp>
#include <iostream>

int main() {
    const Eigen::Vector3d position(1.0, 2.0, 3.0);
    const cv::Mat image = cv::Mat::zeros(2, 3, CV_8UC1);
    std::cout << CV_VERSION << '\n';
    std::cout << position.norm() << ' ' << image.total() << '\n';
}
```

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build --parallel 2
./build/vision_check
```

Eigen는 헤더 기반 라이브러리지만 CMake 타깃을 통해 include·사용 조건을 전달할 수 있다. GUI 없는 서버에서도 위 예제는 OpenCV core만 사용하므로 창을 띄울 필요가 없다. [OpenCV CMake 연동](https://docs.opencv.org/4.x/db/df5/tutorial_linux_gcc_cmake.html), [Eigen CMake](https://libeigen.gitlab.io/eigen/docs-nightly/TopicCMakeGuide.html).

## 3. 오류 단계 구분

| 오류 | 우선 확인 |
| --- | --- |
| `OpenCVConfig.cmake` 없음 | 개발 패키지·`OpenCV_DIR`·`CMAKE_PREFIX_PATH` |
| `opencv2/...` 헤더 없음 | include 디렉터리·선택된 설치 버전 |
| `undefined reference` | 링크 타깃·심벌·라이브러리 ABI |
| 실행 시 `.so` 없음 | 런타임 검색 경로·실제 설치 파일 |
| IDE에만 오류 표시 | compile database·IDE가 선택한 컴파일러 |

Linux에서 실행 의존성은 신뢰하는 자신의 바이너리에 `ldd ./build/vision_check`를 실행해 확인할 수 있다. macOS는 `otool -L`을 사용한다. 다른 버전의 `.so`를 이름만 바꿔 심볼릭 링크하는 것은 ABI 호환성 해결이 아니다.

## 4. macOS·Apple Silicon

Homebrew·소스 빌드 중 프로젝트가 사용하는 설치를 하나 선택한다. arm64 프로그램에 x86_64 라이브러리를 연결하지 않도록 터미널·컴파일러·prefix를 확인한다. [OpenCV macOS 빌드](https://docs.opencv.org/4.x/d0/db2/tutorial_macos_install.html).

VS Code에서는 include 경로를 수동으로 계속 복사하기보다 `CMAKE_EXPORT_COMPILE_COMMANDS=ON`으로 만든 `compile_commands.json`을 사용한다. IDE 설정 오류와 실제 컴파일 실패를 구분한다.

## 5. 빌드 기록

재현에 필요한 항목은 OS·아키텍처·컴파일러·CMake·라이브러리 버전·소스 commit·주요 옵션이다. 메모리가 적은 장치에서 `--parallel`을 과도하게 높이면 OOM으로 빌드가 중단될 수 있으므로 작업 수를 조절한다.
