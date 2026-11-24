---
title: "Remmina로 Ubuntu의 현재 화면 공유하기"
slug: "remmina-desktop-sharing"
date: "2026-11-24"
category: "개발 환경·배포"
tags: [Ubuntu, Remmina, VNC, RDP]
summary: "Ubuntu의 현재 데스크톱을 Remmina로 공유하고, Jetson에서 HDMI 더미 없이 RDP로 접속하는 방법."
---

Ubuntu에서 모니터에 표시되는 데스크톱을 다른 PC에서 보려면 화면 공유를 켜고 접속 PC에서 Remmina로 연결한다. 일반 Xorg 데스크톱은 `x11vnc`, GNOME Wayland는 내장 원격 데스크톱을 사용한다. Jetson Xorg에서 HDMI 연결 없이 RDP를 쓸 때는 4절을 참고한다.

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

`x11`이면 2절의 VNC 화면 공유를 쓴다. Jetson에서 RDP로 접속하려면 4절을 따른다. `wayland`이고 GNOME을 사용한다면 3절의 RDP 화면 공유를 쓴다. SSH 터미널의 세션 값은 모니터에 보이는 그래픽 세션과 다를 수 있다.

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

### 화면은 보이는데 마우스와 키보드가 안 될 때

공유 PC에서 **원격 제어(Remote Control)**를 켠다. 보기 전용 상태에서는 화면 전송은 되지만 마우스 클릭과 키보드 입력이 차단된다. GNOME 원격 데스크톱을 사용하는 경우 공유 PC의 데스크톱 사용자로 아래 명령을 실행해 설정을 확인하거나 바꿀 수 있다. [Ubuntu grdctl 매뉴얼](https://manpages.ubuntu.com/manpages/noble/man1/grdctl.1.html)

```bash
gsettings get org.gnome.desktop.remote-desktop.rdp view-only
grdctl rdp disable-view-only
gsettings get org.gnome.desktop.remote-desktop.rdp view-only
```

설정값이 `false`이면 원격 제어가 켜진 상태다. Remmina에서 클릭과 입력을 확인한다. 열린 세션에서 동작하지 않으면 탭을 닫고 다시 연결한다. VNC를 쓰는 경우에는 공유 PC의 `x11vnc`를 `-viewonly` 옵션 없이 실행한다.

### 모니터를 뺀 상태에서 RDP로 연결하기

GNOME의 기본값인 `mirror-primary`는 물리 모니터에 표시되는 화면을 복제한다. 모든 모니터를 빼면 복제할 화면이 사라져 RDP 접속이 실패할 수 있다. Ubuntu 22.04의 GNOME Wayland에서 이미 로그인된 데스크톱을 계속 쓰려면 공유 PC의 데스크톱 사용자로 가상 화면 모드인 `extend`를 설정한 뒤 Remmina에서 다시 연결한다. [GNOME RDP 화면 공유 모드](https://lists.gnome.org/archives/commits-list/2022-February/msg14593.html)

```bash
gsettings set org.gnome.desktop.remote-desktop.rdp screen-share-mode extend
```

모니터를 다시 꽂고 그 화면과 같은 내용을 보고 싶다면 `mirror-primary`로 바꾼 뒤 다시 연결한다. `extend` 상태에서 물리 모니터를 연결하면 원격 화면은 같은 로그인 세션의 추가 화면이 된다. 이 설정은 이미 로그인한 데스크톱을 공유하는 기능이다. [Ubuntu 데스크톱 공유 안내](https://help.ubuntu.com/stable/ubuntu-help/sharing-desktop.html)

```bash
gsettings set org.gnome.desktop.remote-desktop.rdp screen-share-mode mirror-primary
```

## 4. Jetson Xorg에서 HDMI 없이 RDP로 접속

JetPack 6.2.1의 Jetson Orin NX에서 HDMI를 분리하면 GNOME이 모니터를 0개로 인식했다. Remmina에 접속해도 배경이 검고 창을 움직일 때 잔상이 남았다. Xorg에 1080p 모니터 정보를 지정한 뒤 기존 데스크톱의 배경과 창 갱신이 정상으로 돌아왔다. [NVIDIA Xorg 설정](https://docs.nvidia.com/jetson/archives/r36.4.4/DeveloperGuide/SD/WindowingSystems/XWindowSystem.html)

### Jetson의 사전 설정

1. 공유할 Ubuntu 계정의 자동 로그인을 설정한다. 화면 설정을 적용하기 전에 열린 작업을 저장하고 HDMI를 분리한다.
2. Robot Studio에서 **설치 → 원격 화면 → HDMI 없이 사용… → 1080p 적용**을 선택한다. Xorg 설정을 백업하고 그래픽 세션을 다시 시작한다.
3. 같은 메뉴에서 **모니터 화면 · RDP → Jetson 준비**를 실행하고 RDP 전용 비밀번호를 정한다. Jetson에 설치된 FreeRDP Shadow가 로그인된 Xorg 세션을 공유한다. [FreeRDP Shadow 매뉴얼](https://manpages.ubuntu.com/manpages/jammy/man1/freerdp-shadow-cli.1.html)

검증한 보드에서 HDMI 출력의 NVIDIA 드라이버 이름은 `DFP-0`이었다. `/etc/X11/xorg.conf`의 NVIDIA `Device` 섹션에 아래 두 설정을 적용했다. EDID 파일에는 1920×1080, 60Hz 타이밍이 들어 있다. Robot Studio는 Jetson에서 HDMI 출력을 확인해 해당 드라이버 이름을 사용한다.

```text
Option "ConnectedMonitor" "DFP-0"
Option "CustomEDID" "DFP-0:/etc/X11/robot-studio-1080p.edid"
```

실제 모니터의 해상도 감지로 돌아가려면 Robot Studio의 **HDMI 없이 사용… → 기본 설정 복원**을 선택한다. 적용 전 Xorg 설정으로 돌아가고 그래픽 세션을 다시 시작한다.

### PC에서 접속

같은 네트워크의 Remmina에서 **RDP**를 선택하고 Jetson IP를 입력한다. Jetson 계정 이름과 RDP 전용 비밀번호로 접속한다. 저장한 프로필은 비밀번호를 갱신하고 보안 모드를 **자동 협상** 또는 **NLA**로 설정한다. 화면이 잘리면 Remmina의 배율 조정을 켜서 창에 맞춘다.

Jetson의 그래픽 세션에서 화면과 RDP 서비스를 확인한다.

```bash
xrandr --listactivemonitors
systemctl status robot-studio-rdp.service --no-pager
ss -ltn '( sport = :3389 )'
```

## 5. 모니터 연결에 따라 복제와 가상 화면 자동 전환

모니터를 자주 꽂고 빼는 Ubuntu 22.04 GNOME Wayland PC에서는 사용자 서비스로 전환을 자동화할 수 있다. 물리 출력이 연결되면 기본 모니터를 복제하고, 출력이 모두 분리되면 같은 로그인 세션에 원격용 가상 화면을 만든다. 모드를 바꿀 때 RDP 서비스가 재시작되므로 열려 있던 Remmina 연결은 잠시 끊긴다.

공유 PC에서 GNOME에 로그인한 사용자로 다음을 실행한다. SSH로 설정할 때도 같은 사용자로 접속하고, 필요하면 `DBUS_SESSION_BUS_ADDRESS`를 그래픽 로그인 세션의 사용자 버스로 지정한다. `python3-gi`는 Python에서 GNOME 설정과 화면 변경 신호를 받는 데 사용한다.

```bash
sudo apt install python3-gi
mkdir -p "$HOME/.local/bin" "$HOME/.config/systemd/user"

cat > "$HOME/.local/bin/gnome-rdp-monitor-mode" <<'PY'
from pathlib import Path
import subprocess

from gi.repository import Gio, GLib


def desired_mode(drm_path):
    for connector in drm_path.glob("card*-*/status"):
        try:
            if connector.read_text().strip() == "connected":
                return "mirror-primary"
        except OSError:
            continue
    return "extend"


def main():
    settings = Gio.Settings.new("org.gnome.desktop.remote-desktop.rdp")
    displays = Gio.DBusProxy.new_for_bus_sync(
        Gio.BusType.SESSION,
        Gio.DBusProxyFlags.DO_NOT_LOAD_PROPERTIES,
        None,
        "org.gnome.Mutter.DisplayConfig",
        "/org/gnome/Mutter/DisplayConfig",
        "org.gnome.Mutter.DisplayConfig",
        None,
    )
    pending = 0

    def synchronize():
        nonlocal pending
        pending = 0
        mode = desired_mode(Path("/sys/class/drm"))
        if mode == settings.get_string("screen-share-mode"):
            return GLib.SOURCE_REMOVE
        if not settings.set_string("screen-share-mode", mode):
            raise RuntimeError("Could not set GNOME RDP sharing mode")
        Gio.Settings.sync()
        print(f"RDP sharing mode: {mode}", flush=True)
        subprocess.run(
            ["systemctl", "--user", "--no-block", "try-restart",
             "gnome-remote-desktop.service"],
            check=True,
        )
        return GLib.SOURCE_REMOVE

    def monitors_changed(_proxy, _sender, signal, _parameters):
        nonlocal pending
        if signal == "MonitorsChanged":
            if pending:
                GLib.source_remove(pending)
            pending = GLib.timeout_add(1000, synchronize)

    displays.connect("g-signal", monitors_changed)
    synchronize()
    GLib.MainLoop().run()


if __name__ == "__main__":
    main()
PY

cat > "$HOME/.config/systemd/user/gnome-rdp-monitor-mode.service" <<'UNIT'
[Unit]
Description=Select GNOME RDP sharing mode for the connected monitor
PartOf=graphical-session.target
After=gnome-session-initialized.target

[Service]
ExecStart=/usr/bin/python3 %h/.local/bin/gnome-rdp-monitor-mode
Restart=on-failure
RestartSec=2s

[Install]
WantedBy=gnome-session.target
UNIT

systemctl --user daemon-reload
systemctl --user enable --now gnome-rdp-monitor-mode.service
```

SSH에서 사용자 버스를 찾지 못한다면 아래 변수를 설정하고 사용자 서비스 명령을 다시 실행한다.

```bash
export XDG_RUNTIME_DIR="/run/user/$(id -u)"
export DBUS_SESSION_BUS_ADDRESS="unix:path=$XDG_RUNTIME_DIR/bus"
```

모니터를 꽂고 뺀 뒤 각각 `mirror-primary`와 `extend`로 바뀌는지 확인한다. 물리 모니터를 꽂았을 때 Remmina와 모니터에 같은 화면이 표시됐고, 다시 빼면 가상 화면으로 접속됐다.

```bash
gsettings get org.gnome.desktop.remote-desktop.rdp screen-share-mode
journalctl --user -u gnome-rdp-monitor-mode.service -n 10 --no-pager
```

자동 전환을 끄려면 `systemctl --user disable --now gnome-rdp-monitor-mode.service`를 실행하고 3절의 명령으로 원하는 모드를 설정한다.

### 같은 Remmina 프로필이 두 번 열릴 때

기존 탭이 자동으로 다시 연결되는 동안 같은 프로필을 새로 열면 RDP 연결이 두 개 생길 수 있다. `extend`에서는 연결마다 가상 화면이 생기므로 새 탭이 빈 데스크톱처럼 보일 수 있다. 기존 창과 작업이 보이는 탭을 두고 추가로 열린 탭을 닫는다. 다음 모니터 전환 때는 기존 탭에서 다시 연결되기를 기다린다. 직접 다시 연결해야 한다면 먼저 끊긴 탭을 닫는다.

공유 PC에서 열린 RDP 연결을 확인할 수 있다.

```bash
ss -tn state established '( sport = :3389 )'
```

## 6. 연결이 안 될 때

| 증상 | 확인할 항목 |
| --- | --- |
| RDP가 바로 연결 거부됨 | 공유 PC의 원격 데스크톱이 켜져 있는지 확인한다. 공유 PC에서 `ss -ltn '( sport = :3389 )'`로 포트가 열렸는지 확인할 수 있다. |
| VNC가 연결 거부됨 | 공유 PC에서 `x11vnc`가 실행 중인지 확인하고, 접속 PC에서 SSH 터널을 연 뒤 Remmina가 `127.0.0.1:15900`을 가리키는지 확인한다. |
| RDP 포트는 열려 있지만 연결 또는 로그인 실패 | 기존 Remmina 프로필의 사용자 이름과 비밀번호를 GNOME 원격 데스크톱 설정에 표시된 값으로 저장한다. 보안 협상은 **NLA**로 설정해 다시 연결한다. |
| Jetson에서 RDP 접속 후 검은 배경 또는 창 잔상 | `xrandr --listactivemonitors`에서 모니터가 0개라면 4절의 1080p 화면 설정을 적용한다. |
| VNC 로그인 실패 | 공유 PC에서 `x11vnc -storepasswd`로 정한 비밀번호를 입력한다. |
| 모니터와 다른 화면이 열림 | Xorg에서는 현재 그래픽 세션의 `DISPLAY`에 `x11vnc`를 연결한다. GNOME Wayland에서는 **데스크톱 공유** 메뉴를 사용한다. |

Ubuntu 22.04에서 공유 서버를 켠 뒤에도 기존 Remmina 프로필의 RDP 인증이 실패했다. GNOME에 설정된 RDP 자격 증명으로 프로필을 갱신하고 보안 협상을 NLA로 지정하자 같은 프로필로 연결됐다. 화면이 열린 뒤에는 공유 PC의 **원격 제어**를 켜서 마우스와 키보드가 모두 동작하는 것을 확인했다.
