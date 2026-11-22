---
title: "[Linux] 절전 복귀 후 장치와 통신 검증"
slug: "linux-suspend-resume-validation"
date: "2026-11-23"
category: "시스템 통합"
tags: [Linux, Suspend, IPC, TCP]
summary: "복귀 후 장치 입력과 IPC·TCP 응답 점검."
---

절전에서 깨어나도 카메라 입력이나 통신은 끊겨 있을 수 있다. 복귀 테스트는 화면이나 프로세스 상태보다 **새 데이터를 정상적으로 주고받는지**를 기준으로 잡는다.

## 절전 모드 확인

```bash
cat /sys/power/state
cat /sys/power/mem_sleep
```

`mem_sleep`이 있으면 지원하는 변형이 나열되고, `mem` 요청 시 사용할 변형이 대괄호로 표시된다. `s2idle`은 suspend-to-idle, `deep`은 suspend-to-RAM이다. 지원 여부는 커널과 보드에 따라 다르다. [Linux 커널 절전 상태](https://docs.kernel.org/admin-guide/pm/sleep-states.html).

먼저 절전 전 정상 상태를 기록한다. 복귀 조작이 가능한 시험 장치에서 작업을 저장한 뒤 `systemctl suspend`를 실행한다. SSH로만 접근할 수 있는 장치에서는 복귀 수단부터 확보한다. 명령이 반환된 시점을 복귀 완료로 계산하면 안 된다. [systemctl suspend](https://www.freedesktop.org/software/systemd/man/latest/systemctl.html#suspend).

## 복귀 판정

| 대상 | 통과 조건 |
| --- | --- |
| 센서·카메라 | 장치가 열린 뒤 복귀 후의 새 측정값이나 프레임을 받는다. |
| 프로세스 간 통신 | 새 요청을 보냈을 때 상대 프로세스에서 처리한 응답이 제한 시간 안에 돌아온다. |
| TCP | 기존 연결로 요청이 되는지와, 끊겼을 때 새 연결로 요청에 성공하는지를 따로 확인한다. |

```bash
journalctl -k -b -o short-monotonic
journalctl -b -u demo.service -o short-monotonic
```

`demo.service`는 시험 서비스 이름으로 바꾼다. 커널의 절전 진입·복귀 로그와 서비스의 첫 실패·성공 시각을 맞춰 본다. 재부팅됐다면 같은 부팅 세션의 복귀 성공과 구분한다.

같은 조건으로 반복해서 **성공 횟수와 깨움부터 첫 유효 응답까지 걸린 시간**을 남긴다. 시간을 비교할 때는 깨움 신호와 첫 응답을 같은 외부 시계로 기록한다. 실패 시 장치 입력부터 단계별로 확인해 어디서 응답이 끊겼는지 좁힌다.
