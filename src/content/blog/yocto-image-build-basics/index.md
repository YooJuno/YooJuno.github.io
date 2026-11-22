---
title: "[Yocto] 레이어·레시피와 이미지 빌드"
slug: "yocto-image-build-basics"
date: "2026-11-23"
category: "개발 환경·배포"
tags: [Yocto, BitBake, Linux, QEMU]
summary: "레이어와 레시피의 역할을 QEMU 이미지로 확인."
---

Yocto Project는 임베디드 Linux 이미지를 만드는 도구와 메타데이터를 제공한다. BitBake는 레시피와 설정을 읽고, 의존성에 따라 빌드 작업을 실행한다. 설치된 보드에 패키지를 추가하는 대신 빌드 설정에서 이미지에 포함할 패키지를 정할 수 있다. [Yocto Project 구성 요소](https://docs.yoctoproject.org/5.0.17/overview-manual/concepts.html#yocto-project-components).

## 빌드 구성

| 구성 | 역할 |
| --- | --- |
| 레이어 | 관련 레시피와 설정을 묶는 단위. `conf/bblayers.conf`에서 사용할 레이어를 고른다. |
| 레시피 | `.bb` 파일로 소스와 빌드 방법을 정의한다. 하나의 레시피가 여러 패키지를 만들 수 있다. |
| 이미지 레시피 | 루트 파일시스템에 어떤 패키지를 넣을지 정의한다. |
| `MACHINE` | 커널과 기기별 설정이 적용될 대상. 같은 이미지 레시피도 다른 대상으로 빌드할 수 있다. |

## QEMU 이미지 예제

지원되는 Linux 호스트에서 [Yocto 5.0 Quick Build](https://docs.yoctoproject.org/5.0.17/brief-yoctoprojectqs/index.html)에 따라 호스트 의존성과 Poky 소스를 준비한다. Poky 소스 루트에서 환경을 연다.

```bash
source oe-init-build-env build-qemu
```

생성된 `conf/local.conf`에서 `MACHINE`을 지정하고, 실습용으로 `strace`를 넣는다. `:append` 값의 앞 공백도 포함한다. 이 설정은 현재 빌드 디렉터리의 다른 이미지에도 적용되므로, 특정 이미지에만 계속 넣을 패키지는 별도의 이미지 레시피로 관리한다. [이미지에 패키지 추가](https://docs.yoctoproject.org/5.0.17/dev-manual/customizing-images.html#customizing-images-using-local-conf).

```bitbake
MACHINE = "qemux86-64"
IMAGE_INSTALL:append = " strace"
```

```bash
bitbake-layers show-layers
bitbake core-image-minimal
runqemu qemux86-64 core-image-minimal ext4 nographic
```

산출물은 기본 설정에서 `tmp/deploy/images/qemux86-64/`에 생긴다. QEMU가 부팅되면 게스트에서 `strace -V`를 실행해 패키지가 실제로 들어갔는지 확인한다. 이 시험은 이미지 구성 확인용이다. 실제 보드의 부팅·장치 드라이버 검증에는 해당 보드용 BSP와 배포 절차가 필요하다. [Yocto QEMU 실행 옵션](https://docs.yoctoproject.org/5.0.17/dev-manual/qemu.html).
