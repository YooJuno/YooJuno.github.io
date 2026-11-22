---
title: "[Jetson] 부팅 시간과 서비스 준비 시간"
slug: "jetson-boot-time-analysis"
date: "2026-11-23"
category: "시스템 통합"
tags: [Jetson, Linux, systemd, 부팅]
summary: "전원 인가부터 첫 유효 응답까지 구간별 측정."
---

장치가 언제 쓸 수 있는지 알려면 부팅 완료 기준부터 정해야 한다. 로그인 화면이 뜬 시각, 서비스 프로세스가 시작된 시각, 클라이언트가 첫 응답을 받은 시각은 서로 다를 수 있다.

## 측정 구간

| 구간 | 볼 항목 |
| --- | --- |
| 전원 인가 → 첫 커널 로그 | 펌웨어·부트로더와 커널의 첫 출력까지 걸린 시간. 전원 인가 시점과 시리얼 로그를 같은 외부 시계로 기록한다. |
| 커널 → systemd 목표 도달 | `systemd-analyze time`과 부팅 로그로 커널·initrd·사용자 공간을 구분한다. 출력되는 구간은 환경에 따라 다르다. |
| 서비스 시작 → 첫 유효 응답 | 서비스 로그와 실제 요청 결과를 본다. 예를 들어 외부 클라이언트에서 첫 정상 응답을 받으면 준비 완료로 기록한다. |

전원 인가부터 첫 유효 응답까지의 전체 시간은 두 시각을 같은 시계로 기록해서 구한다. Jetson Orin의 부트로더 단계는 [NVIDIA 부팅 흐름 문서](https://docs.nvidia.com/jetson/archives/r36.5/DeveloperGuide/AR/BootArchitecture/JetsonOrinSeriesBootFlow.html)에서 확인할 수 있다.

## systemd에서 지연 확인

`demo.service` 대신 측정할 서비스 이름을 넣는다.

```bash
systemd-analyze time
systemd-analyze critical-chain demo.service
journalctl -b -u demo.service -o short-monotonic
```

`critical-chain`으로 대상 서비스가 기다리는 시작 순서를 본다. 서비스는 병렬로 시작할 수 있으므로 `blame`에서 가장 오래 걸린 항목을 줄여도 전체 부팅 시간이 줄지 않을 수 있다. [systemd-analyze 매뉴얼](https://www.freedesktop.org/software/systemd/man/latest/systemd-analyze.html).

프로세스 시작과 준비 완료를 구분해야 한다면, 애플리케이션이 초기화를 마친 뒤 `READY=1`을 보내도록 구현하고 서비스에 `Type=notify`를 쓸 수 있다. 준비 신호를 구현하지 않은 서비스의 타입만 바꾸면 시작이 완료되지 않는다. 실제 사용 가능 여부는 클라이언트 요청으로 한 번 더 확인한다. [systemd 서비스 준비 신호](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html#Type=).

## 이미지 변경 전후 비교

같은 보드·저장장치·주변기기에서 전원 인가 시험을 반복한다. 새 이미지의 최초 부팅은 초기 설정 작업을 포함할 수 있으니 이후 부팅과 분리한다. 커널 구간이 줄었는지, 실제 서비스 준비까지 빨라졌는지는 따로 기록한다.
