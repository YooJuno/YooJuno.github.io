---
title: "Ubuntu 24.04에서 Fcitx 5 설치와 한/영 키 설정"
slug: "ubuntu-korean-input"
date: "2025-03-25"
updated: "2026-11-24"
category: "개발 환경·배포"
tags: [Ubuntu, Fcitx5]
summary: "Ubuntu 24.04에서 Fcitx 5 한글 입력기를 설치하고 한/영 키나 오른쪽 Alt로 전환하는 방법."
---

Ubuntu 24.04 GNOME에서 Fcitx 5 한글 입력기를 설치하고 한/영 키로 전환하는 방법이다.

## 1. Fcitx 5 설치

터미널에서 `fcitx5`와 한글 조합을 담당하는 `fcitx5-hangul`을 설치한다. Ubuntu의 기본 APT 설정에서는 권장 패키지인 `im-config`와 `fcitx5-config-qt`도 함께 설치된다. [Ubuntu Fcitx 5 패키지 정보](https://packages.ubuntu.com/noble/fcitx5), [한글 엔진 패키지 정보](https://packages.ubuntu.com/noble/fcitx5-hangul)

```bash
sudo apt update
sudo apt install fcitx5 fcitx5-hangul
```

로그인할 때 사용할 입력기를 Fcitx 5로 지정한 뒤 로그아웃하고 다시 로그인한다. [Fcitx 5 공식 설정 안내](https://fcitx-im.org/wiki/Setup_Fcitx_5)

```bash
im-config -n fcitx5
```

## 2. 한글 입력기와 전환 키 설정

터미널에서 Fcitx 5 설정을 연다.

```bash
fcitx5-configtool
```

1. **Input Method(입력기)** 탭에서 현재 목록에 영문 키보드(예: **Keyboard - English (US)**)와 **Hangul(한글)**이 있는지 확인한다.
2. **Hangul**이 없으면 **Only Show Current Language(현재 언어만 표시)**를 해제하고 오른쪽 목록에서 `Hangul`을 검색한다. 항목을 더블클릭하거나 왼쪽 화살표로 현재 목록에 추가한다.
3. **Global Options(전역 옵션) → Hotkey(단축키) → Trigger Input Method(입력기 전환)**에서 전환 키를 등록한다. 설정 칸을 클릭하고 키보드의 한/영 키를 누른다. 오른쪽 Alt로 전환하려면 [다음 절](#3-오른쪽-alt를-한영-키로-사용)에서 키를 먼저 매핑한다.
4. **Trigger Input Method**에 `Hangul`만 남기고 `Ctrl+Space` 등 다른 키를 지운다. **Temporally switch between first and current Input Method**에서도 기본값인 **Left Shift**를 지운다. 다른 전환 단축키도 등록돼 있다면 **Enumerate Input Method Forward/Backward**와 **Activate/Deactivate Input Method**를 비운 뒤 **Apply(적용)**를 누른다. [Fcitx 5 전환 키 기본값](https://github.com/fcitx/fcitx5/blob/5.1.7/src/lib/fcitx/globalconfig.cpp)
5. 텍스트 편집기에서 `abc`를 입력하고 오른쪽 Alt를 누른 뒤, 두벌식 기준으로 `gksrmf`를 입력한다. `한글`이 나오고 오른쪽 Alt를 다시 누르면 영어로 돌아오는지 확인한다. Shift를 단독으로 눌렀을 때는 입력 언어가 바뀌지 않아야 한다.

[Fcitx 5 설정 도구 안내](https://fcitx-im.org/wiki/Configtool_(Fcitx_5))

## 3. 오른쪽 Alt를 한/영 키로 사용

GNOME에서 오른쪽 Alt를 `Hangul` 키로 매핑한 뒤, Fcitx 5에서 그 키를 **Trigger Input Method**에 등록한다. 왼쪽 Alt는 기존 Alt 단축키에 쓸 수 있다. 이 매핑은 오른쪽 Alt의 AltGr 기능을 대체한다.

### GNOME에서 키 매핑 켜기

Ubuntu 24.04의 GNOME X11과 Wayland는 같은 키보드 옵션을 사용한다. 다음 명령으로 현재 옵션을 확인한다. 이미 `korean:ralt_hangul`이 있으면 키 확인 단계로 넘어간다. [GNOME Shell의 키보드 설정 처리](https://github.com/GNOME/gnome-shell/blob/46.0/js/ui/status/keyboard.js)

```bash
gsettings get org.gnome.desktop.input-sources xkb-options
```

출력이 `@as []` 또는 `[]`라면 아래 명령으로 오른쪽 Alt 매핑을 켠다. 일반 사용자 터미널에서 실행한다.

```bash
gsettings set org.gnome.desktop.input-sources xkb-options "['korean:ralt_hangul']"
```

기존 옵션이 있다면 **GNOME Tweaks(기능 개선)**의 **Keyboard → Additional Layout Options → Korean Hangul/Hanja keys → Make right Alt a Hangul key**만 켠다. 필요한 경우 `sudo apt install gnome-tweaks`로 설치한다. 이 방법은 다른 키보드 옵션을 함께 유지한다. [GNOME Tweaks 키보드 설정](https://github.com/GNOME/gnome-tweaks/blob/46.0/gtweak/tweaks/tweak_group_keyboard.py)

### 오른쪽 Alt가 Hangul로 들어오는지 확인하기

터미널에서 `echo "$XDG_SESSION_TYPE"`을 실행한다. `x11`이면 `xev`(패키지 `x11-utils`), `wayland`면 `wev`(패키지 `wev`)를 실행한다. 열린 작은 창을 클릭하고 오른쪽 Alt를 눌러 키 이름을 확인한다. [Ubuntu wev 매뉴얼](https://manpages.ubuntu.com/manpages/noble/man1/wev.1.html)

| 표시되는 키 | 확인할 설정 |
| --- | --- |
| `Hangul` | 매핑이 적용됐다. Fcitx 5에서 **Trigger Input Method**에 오른쪽 Alt를 다시 등록한다. |
| `ISO_Level3_Shift` 또는 `Multi_key` | 오른쪽 Alt가 AltGr 또는 Compose로 쓰이고 있다. GNOME Tweaks에서 오른쪽 Alt에 지정된 **Key to choose the 3rd level** 또는 **Compose key** 항목을 해제하고 다시 확인한다. |
| `Alt_R` | GNOME에서 `korean:ralt_hangul`을 확인한다. 이미 켜져 있으면 GNOME Tweaks에서 **Make right Alt a Hangul key**만 껐다가 다시 켠다. |

키 이름이 `Hangul`인데도 텍스트 편집기에서 전환이 안 되면 `fcitx5-remote`로 입력기가 실행 중인지 확인한다. `1`은 입력기가 실행 중이고 한글 모드가 비활성 상태, `2`는 활성 상태다. Fcitx 5 입력기 목록에 **Hangul**이 있고 **Trigger Input Method**에 `Hangul`이 저장돼 있는지 확인한다.

## 4. 특정 앱에서만 입력이 안 될 때

Wayland 세션에서는 앱마다 Wayland에 직접 연결하거나 XWayland를 통해 실행될 수 있다. Ubuntu 22.04 GNOME에서 텍스트 편집기와 ChatGPT 데스크톱 앱의 전환 동작이 달랐을 때, XWayland의 키 맵에서 오른쪽 Alt가 `Alt_R`로 남아 있었다. 위 GNOME 옵션을 껐다 켠 뒤 `xev`에서도 `Hangul`이 확인됐고, Fcitx 5에 `Hangul`만 남긴 뒤 ChatGPT 입력창에서 오른쪽 Alt 전환을 확인했다.

매핑을 다시 적용한 뒤에도 특정 앱에서만 문제가 있으면 앱을 완전히 종료하고 다시 열어 확인한다. Wayland 세션에서는 `wev`로 Wayland 앱 경로를, `xev`로 XWayland 앱 경로를 확인할 수 있다. [Fcitx 5의 GNOME Wayland 연동 안내](https://fcitx-im.org/wiki/Using_Fcitx_5_on_Wayland#GNOME)

| 증상 | 확인할 항목 |
| --- | --- |
| 모든 앱에서 한글 조합 불가 | 입력기 실행·Hangul 엔진·세션 재로그인 |
| 한·영 키가 앱 메뉴를 엶 | 키가 Alt로 전달되는지, 전환 단축키 충돌 |
| Chrome·Electron 등 특정 앱만 실패 | 앱 버전, X11/XWayland/Wayland 실행 방식 |
| Qt 앱에서만 실패 | 해당 Qt 입력기 모듈·앱 번들 구성 |

`GTK_IM_MODULE`·`QT_IM_MODULE`·`XMODIFIERS`를 무조건 모두 고정하면 다른 세션의 정상 동작을 방해할 수 있다. 디스플레이 서버와 앱 툴킷에 맞춰 설정한다. [Fcitx5 Wayland 연동](https://fcitx-im.org/wiki/Using_Fcitx_5_on_Wayland).

입력 문제 때문에 오래된 브라우저를 내려받아 보안 업데이트를 계속 막는 방식은 피한다. 지원되는 최신 업데이트를 유지하면서 입력기·세션 설정을 분리해 진단한다.
