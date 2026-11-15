---
title: "Jetson CUDA 개발 환경과 CMake"
slug: "jetson-cuda-development"
date: "2026-11-15"
updated: "2026-11-15"
category: "시스템 통합"
tags: [Jetson, CUDA, CMake]
summary: "JetPack·CUDA 조합과 GPU 아키텍처·빌드 진단."
---

Jetson의 CUDA 환경은 보드 모델·Jetson Linux(L4T)·JetPack의 지원 조합에 맞춘다. 일반 PC의 NVIDIA 드라이버 설치 절차를 그대로 적용하지 않는다.

## 1. 설치 상태

```bash
uname -m
cat /etc/nv_tegra_release
dpkg-query -W nvidia-jetpack
nvcc --version
```

JetPack 메타패키지가 없더라도 일부 구성요소가 개별 설치됐을 수 있다. 반대로 `nvcc`가 있다는 것만으로 모든 런타임·프레임워크의 호환성이 확인되는 것은 아니다.

지원되는 L4T와 NVIDIA 저장소가 설정된 장치에서 JetPack 구성요소를 설치할 때는 해당 버전의 공식 안내를 따른다. `nvidia-jetpack`을 설치하는 명령이 모든 보드의 펌웨어·OS를 자동으로 올려주는 절차는 아니다. [JetPack 설치 조건](https://docs.nvidia.com/jetson/jetpack/install-setup/index.html).

## 2. CUDA 경로

`nvcc`를 찾지 못하면 설치 여부와 실제 경로부터 확인한다. 필요할 때만 다음과 같이 PATH를 추가한다.

```bash
export PATH="/usr/local/cuda/bin:$PATH"
```

여러 CUDA 버전이 있으면 `/usr/local/cuda`가 가리키는 버전을 확인한다. `LD_LIBRARY_PATH`를 전역으로 계속 추가해 충돌을 덮기보다 CMake 검색 경로·설치 prefix·런타임 의존성을 구분한다.

## 3. CMake 타깃

다음은 **Jetson Orin 계열의 compute capability 8.7**을 대상으로 한 예시다. 다른 GPU에 `87`을 그대로 적용하지 않는다. CMake 3.18 이상과 CUDA 컴파일러가 필요하다.

```cmake
cmake_minimum_required(VERSION 3.18)
project(cuda_check LANGUAGES CXX CUDA)

find_package(CUDAToolkit REQUIRED)
add_executable(cuda_check main.cu)
target_compile_features(cuda_check PRIVATE cxx_std_17)
set_target_properties(cuda_check PROPERTIES CUDA_STANDARD 17 CUDA_STANDARD_REQUIRED ON CUDA_ARCHITECTURES 87)
target_link_libraries(cuda_check PRIVATE CUDA::cudart)
```

`main.cu`는 장치 존재와 메모리 할당·해제만 확인한다.

```cuda
#include <cuda_runtime.h>
#include <iostream>

int main() {
    int device_count = 0;
    const cudaError_t status = cudaGetDeviceCount(&device_count);
    if (status != cudaSuccess || device_count == 0) {
        std::cerr << "CUDA device unavailable\n";
        return 1;
    }
    void* buffer = nullptr;
    if (cudaMalloc(&buffer, 1024) != cudaSuccess) return 2;
    return cudaFree(buffer) == cudaSuccess ? 0 : 3;
}
```

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build --parallel 2
./build/cuda_check
```

이 예제가 성공해도 커널 정확도·처리량·장시간 안정성까지 검증된 것은 아니다. [CMake FindCUDAToolkit](https://cmake.org/cmake/help/v3.31/module/FindCUDAToolkit.html), [GPU compute capability](https://developer.nvidia.com/cuda-gpus).

## 4. 오류와 성능 점검

| 증상 | 확인 항목 |
| --- | --- |
| CUDA compiler 없음 | Toolkit 설치·PATH·선택된 nvcc |
| GPU에서 실행 불가 | 컴파일 대상 아키텍처·배포 장치 일치 |
| 라이브러리 로드 실패 | L4T·CUDA·프레임워크 지원 조합 |
| 빌드 중 프로세스 종료 | 메모리·병렬 작업 수·저장 공간 |
| 처리 속도 변동 | 전력 모드·온도·메모리 사용·다른 프로세스 |

`tegrastats`로 장치 사용량을 관찰할 수 있다. CPU–GPU 복사·커널 실행·동기화를 나눠 측정하고, 높은 전력 모드나 클록 고정을 무조건 기본값으로 적용하지 않는다.
