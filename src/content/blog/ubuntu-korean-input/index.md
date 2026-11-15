---
title: "Ubuntu 한글 입력과 한·영 키 설정"
slug: "ubuntu-korean-input"
date: "2026-11-15"
category: "개발 환경·배포"
tags: [Ubuntu, IBus, Fcitx5]
summary: "IBus·Fcitx5와 X11·Wayland 입력 문제 구분."
---

한글 입력 문제는 입력기 엔진, 한·영 전환 키, 앱과 디스플레이 서버의 연동을 나눠 확인한다. 아래는 Ubuntu GNOME 환경 기준이며 메뉴 이름은 버전에 따라 다를 수 있다.

## 1. 세션 확인

```bash
echo "$XDG_SESSION_TYPE"
locale
```

`x11`과 `wayland`는 키 매핑·앱 입력기 연동 방식이 다르다. X11용 설정을 Wayland 전체에 그대로 적용하지 않는다.

## 2. GNOME 기본 입력기: IBus

```bash
sudo apt update
sudo apt install ibus-hangul
```

설정의 키보드·입력 소스에서 **Korean (Hangul)**을 추가한다. 단순한 한국어 키보드 배열과 한글 조합 엔진은 다르다. 항목이 바로 나타나지 않으면 로그아웃 후 다시 로그인한다.

한글 입력기 설정에서 전환 키를 확인한다. 오른쪽 Alt를 사용하는 키보드는 해당 키가 `Hangul`로 인식되는지, 일반 Alt로 처리되는지 구분한다. [GNOME 입력 소스 안내](https://help.gnome.org/gnome-help/keyboard-layouts.html).

## 3. Fcitx5 사용

```bash
sudo apt install fcitx5 fcitx5-hangul fcitx5-config-qt im-config
im-config
```

입력기 선택에서 Fcitx5를 지정하고 다시 로그인한다. `fcitx5-configtool`에서 영문 키보드와 Hangul 입력기를 추가하고 전환 키를 설정한다. IBus·Fcitx5를 동시에 강제로 실행하기보다 사용할 입력 프레임워크를 하나 정한다. [Fcitx5 설정](https://fcitx-im.org/wiki/Setup_Fcitx_5/en).

GNOME X11에서 오른쪽 Alt 매핑이 필요한 경우에만 키보드의 XKB 옵션을 확인한다.

```bash
gsettings get org.gnome.desktop.input-sources xkb-options
```

`korean:ralt_hangul` 같은 옵션을 적용할 때 기존 옵션 목록을 덮어쓰지 않도록 주의한다. 키보드마다 물리 키·펌웨어가 다르므로 모든 장치에 같은 설정이 필요한 것은 아니다.

## 4. 특정 앱에서만 입력이 안 될 때

| 증상 | 확인할 항목 |
| --- | --- |
| 모든 앱에서 한글 조합 불가 | 입력기 실행·Hangul 엔진·세션 재로그인 |
| 한·영 키가 앱 메뉴를 엶 | 키가 Alt로 전달되는지, 전환 단축키 충돌 |
| Chrome·Electron 등 특정 앱만 실패 | 앱 버전, X11/XWayland/Wayland 실행 방식 |
| Qt 앱에서만 실패 | 해당 Qt 입력기 모듈·앱 번들 구성 |

`GTK_IM_MODULE`·`QT_IM_MODULE`·`XMODIFIERS`를 무조건 모두 고정하면 다른 세션의 정상 동작을 방해할 수 있다. 디스플레이 서버와 앱 툴킷에 맞춰 설정한다. [Fcitx5 Wayland 연동](https://fcitx-im.org/wiki/Using_Fcitx_5_on_Wayland).

입력 문제 때문에 오래된 브라우저를 내려받아 보안 업데이트를 계속 막는 방식은 피한다. 지원되는 최신 업데이트를 유지하면서 입력기·세션 설정을 분리해 진단한다.
