---
title: "Remmina로 Ubuntu의 현재 화면 공유하기"
slug: "remmina-desktop-sharing"
date: "2026-11-24"
category: "개발 환경·배포"
tags: [Ubuntu, Remmina, VNC, RDP]
summary: "Ubuntu Xorg에서는 x11vnc와 SSH 터널로, GNOME Wayland에서는 RDP로 현재 화면을 공유하는 방법."
---

Ubuntu에서 모니터에 표시되는 데스크톱을 다른 PC에서 보려면 화면 공유를 켜고 접속 PC에서 Remmina로 연결한다. Xorg에서는 `x11vnc`를, GNOME Wayland에서는 내장 원격 데스크톱을 사용한다.

## 1. 접속하는 PC에 Remmina 준비

Remmina가 없다면 접속용 Ubuntu PC에서 설치한다. VNC 플러그인은 Xorg 화면 공유에, RDP 플러그인은 GNOME 원격 데스크톱 연결에 사용한다. [Ubuntu Remmina 안내](https://help.ubuntu.com/community/Remmina)

```bash
sudo apt update
sudo apt install remmina remmina-plugin-vnc remmina-plugin-rdp
```

화면을 공유할 장치의 **그래픽 데스크톱 안에서** 터미널을 열고 세션 종류를 확인한다.

```bash
echo "$XDG_SESSION_TYPE"
echo "$DISPLAY"
```

`x11`이면 2절의 VNC 화면 공유를 쓴다. `wayland`이고 GNOME을 사용한다면 3절의 RDP 화면 공유를 쓴다. SSH 터미널의 세션 값은 모니터에 보이는 그래픽 세션과 다를 수 있다.

## 2. Xorg 화면을 VNC로 공유

공유할 Ubuntu의 그래픽 데스크톱에 로그인한 상태에서 터미널을 열어 실행한다. 명령은 그 세션의 실제 `DISPLAY` 값을 사용한다. [Ubuntu x11vnc 매뉴얼](https://manpages.ubuntu.com/manpages/jammy/man1/x11vnc.1.html)

```bash
sudo apt update
sudo apt install x11vnc
x11vnc -storepasswd
x11vnc -display "$DISPLAY" -localhost -rfbport 5900 \
  -rfbauth "$HOME/.vnc/passwd" -forever -shared
```

화면을 보기만 하려면 마지막 명령에 `-viewonly`를 붙인다. VNC 서버는 공유 PC의 루프백 주소에서만 연결을 받으므로 접속 PC에서 SSH 터널을 연다. 공유 PC에는 접속 가능한 SSH 서버가 실행 중이어야 한다. `REMOTE_USER`와 `REMOTE_IP`를 실제 값으로 바꾼다.

```bash
ssh -N -o ExitOnForwardFailure=yes \
  -L 127.0.0.1:15900:127.0.0.1:5900 REMOTE_USER@REMOTE_IP
```

Remmina에서 **VNC**를 선택하고 서버에 `127.0.0.1:15900`을 넣는다. 공유 PC에서 `x11vnc -storepasswd`로 만든 VNC 비밀번호를 입력한다. 연결을 유지하는 동안 공유 PC의 `x11vnc`와 접속 PC의 SSH 터널을 실행해 둔다.

## 3. Ubuntu GNOME Wayland 화면을 RDP로 공유

Ubuntu 22.04에서 **설정 → 공유 → 원격 데스크톱**을 연다. 상단의 공유 스위치를 켜고 **원격 데스크톱**을 활성화한다. 키보드와 마우스 조작이 필요한 경우에만 **원격 제어**를 켠다. Ubuntu 24.04 GNOME에서는 **설정 → 시스템 → 원격 데스크톱 → 데스크톱 공유**를 사용한다. 공유할 사용자는 그래픽 데스크톱에 로그인해 둔다. [Ubuntu 데스크톱 공유 안내](https://help.ubuntu.com/stable/ubuntu-help/sharing-desktop.html)

접속 PC의 Remmina에서 **RDP**를 선택하고 공유 PC의 주소와 포트를 입력한다. 포트는 공유 설정 화면에서 확인한다. 검증한 Ubuntu 22.04 PC에서는 `3389`였다. 사용자 이름과 비밀번호는 원격 데스크톱 설정 화면에 표시되는 RDP 자격 증명을 사용한다. 최초 연결에서 인증서 확인 창이 표시되면 공유 PC의 인증서인지 확인한다.

## 4. 연결이 안 될 때

| 증상 | 확인할 항목 |
| --- | --- |
| RDP가 바로 연결 거부됨 | 공유 PC의 원격 데스크톱이 켜져 있는지 확인한다. 공유 PC에서 `ss -ltn '( sport = :3389 )'`로 포트가 열렸는지 확인할 수 있다. |
| VNC가 연결 거부됨 | 공유 PC에서 `x11vnc`가 실행 중인지 확인하고, 접속 PC에서 SSH 터널을 연 뒤 Remmina가 `127.0.0.1:15900`을 가리키는지 확인한다. |
| 로그인 실패 | RDP는 원격 데스크톱 설정의 자격 증명, VNC는 `x11vnc -storepasswd`로 정한 비밀번호를 확인한다. |
| 모니터와 다른 화면이 열림 | Xorg에서는 현재 그래픽 세션의 `DISPLAY`에 `x11vnc`를 연결한다. GNOME Wayland에서는 **데스크톱 공유** 메뉴를 사용한다. |

Ubuntu 22.04 테스트 PC에서는 Remmina가 이미 설치돼 있었고 공유 서버가 꺼져 있어 처음에는 접속이 거부됐다. GNOME 원격 데스크톱을 보기 전용으로 활성화한 뒤, 다른 PC의 Remmina에서 RDP로 연결해 그래픽 채널이 열리는 것을 확인했다.
