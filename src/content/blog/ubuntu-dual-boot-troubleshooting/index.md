---
title: "Ubuntu 듀얼부팅: GRUB과 시간 설정"
slug: "ubuntu-dual-boot-troubleshooting"
date: "2026-11-15"
category: "개발 환경·배포"
tags: [Ubuntu, UEFI, GRUB]
summary: "UEFI 부팅 항목·GRUB 복구 전 점검과 RTC 시간 설정."
---

Windows로 바로 부팅되는 현상과 GRUB 자체가 손상된 현상은 구분해야 한다. 부트로더 복구 전에는 중요한 파일과 디스크 복구 키를 백업한다. 암호화된 Windows는 부팅 설정 변경 후 복구 키를 요구할 수 있다.

## 1. 부팅 경로 확인

UEFI 환경의 일반적인 흐름은 **펌웨어 부팅 항목 → EFI 실행 파일 → GRUB → 운영체제**다. Windows Boot Manager가 먼저 선택되면 Ubuntu가 남아 있어도 GRUB 메뉴를 보지 못할 수 있다.

Ubuntu를 실행할 수 있다면 다음 항목을 조회한다.

```bash
test -d /sys/firmware/efi && echo UEFI || echo Legacy
lsblk -f
findmnt /boot/efi
sudo efibootmgr -v
```

디스크·파티션 이름은 PC마다 다르다. 다른 사람의 `/dev/sda`·`/dev/nvme0n1p1`을 그대로 복구 대상으로 사용하지 않는다. Ubuntu는 UEFI 환경에서 서명된 shim·GRUB 등으로 부팅하는 구성을 지원한다. [Ubuntu UEFI Secure Boot](https://documentation.ubuntu.com/security/security-features/platform-protections/secure-boot/).

## 2. 증상별 조치

| 증상 | 우선 확인 |
| --- | --- |
| Windows로 바로 부팅 | 펌웨어의 Ubuntu 부팅 항목과 순서 |
| Ubuntu는 실행되지만 메뉴에 Windows가 없음 | GRUB 설정·OS 검색 정책·Windows 설치 모드 |
| `grub rescue>` 또는 EFI 파일 누락 | 루트 파티션·ESP·부트로더 파일 상태 |
| Windows 업데이트 후 순서 변경 | 기존 Ubuntu 항목이 남아 있는지 |

Ubuntu가 정상 실행되고 설정 변경을 반영하는 상황이라면 `sudo update-grub`로 메뉴 구성을 갱신할 수 있다. 이 명령이 손상된 EFI 파일을 재설치하거나 모든 디스플레이 문제를 해결하는 것은 아니다.

## 3. 라이브 USB와 복구 도구

설치된 Ubuntu를 실행할 수 없다면 라이브 USB의 **Try Ubuntu**로 진입한다. 설치된 OS와 같은 UEFI·Legacy 모드로 부팅했는지 확인하고, 먼저 디스크와 파티션을 식별한다.

Boot-Repair는 진단·복구를 돕는 도구다. 자동 복구도 디스크 구성을 확인한 뒤 선택해야 하며, RAID·암호화·다중 디스크에서는 추가 확인이 필요하다. 진단 보고서에는 장치 정보가 포함될 수 있으므로 외부 업로드 전에 내용을 검토한다. [Boot-Repair 프로젝트](https://sourceforge.net/p/boot-repair/home/Home/).

파티션·마운트 지점이 확인되지 않은 상태에서 `grub-install` 명령을 일괄 실행하지 않는다. 복구 절차는 사용 중인 Ubuntu 버전과 실제 저장장치 구성에 맞춘다.

## 4. Windows·Linux 시간 차이

RTC는 메인보드의 하드웨어 시계이고, 타임존은 시스템에서 표시할 지역 시간 규칙이다. 두 OS가 RTC를 서로 다른 기준으로 해석하면 OS를 바꿀 때 시간이 어긋날 수 있다.

```bash
timedatectl status
```

먼저 타임존·NTP 동기화·RTC 기준을 확인한다. 일반적으로 UTC 기준으로 통일하는 방식을 검토하며, Linux에서 로컬 RTC를 쓰는 것은 일광절약시간 등에서 제약이 있다. [timedatectl](https://www.freedesktop.org/software/systemd/man/latest/timedatectl.html).

Windows의 `RealTimeIsUniversal` 레지스트리 설정은 RTC를 UTC로 해석하도록 하는 변경이다. 관리자 권한·복원 방법을 확인한 뒤 적용하고, Linux 쪽 RTC 설정과 반대 방향의 변경을 동시에 하지 않는다.

## 관련 글

[부팅 디스크 없이 Ubuntu 설치](/blog/ubuntu-without-usb-disk)는 설치 절차를 다룬다. 이 글은 설치 후 부팅 경로와 시간 문제를 구분하는 점검 노트다.
