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
3. **Global Options(전역 옵션) → Hotkey(단축키) → Trigger Input Method(입력기 전환)**에서 설정 칸을 클릭하고 키보드의 **한/영 키**를 누른다. `Hangul`로 표시되면 **Apply(적용)**를 누른다.
4. 텍스트 편집기에서 `abc`를 입력한 뒤, 한/영 키를 누르고 두벌식 기준으로 `gksrmf`를 입력한다. 화면에 `한글`이 나오면 전환과 한글 조합이 모두 동작한다.

[Fcitx 5 설정 도구 안내](https://fcitx-im.org/wiki/Configtool_(Fcitx_5))

## 3. GNOME X11에서 오른쪽 Alt를 한/영 키로 사용

한/영으로 쓰려는 키가 일반 오른쪽 Alt로 동작한다면 `echo "$XDG_SESSION_TYPE"`으로 세션 유형을 확인한다. `x11`이면 터미널에서 `xev`를 실행하고 작은 창에 포커스를 둔 상태로 오른쪽 Alt를 눌러 확인한다. 이미 `Hangul`로 처리된다면 위의 Fcitx 5 단축키 설정만 적용하면 된다.

세션 유형이 `x11`이고 키가 `Alt_R`로 나온다면 현재 GNOME 키보드 옵션을 확인한다.

```bash
gsettings get org.gnome.desktop.input-sources xkb-options
```

옵션이 비어 있어 출력이 `@as []` 또는 `[]`라면 아래 명령을 실행한다.

```bash
gsettings set org.gnome.desktop.input-sources xkb-options "['korean:ralt_hangul']"
```

기존 옵션이 있으면 명령의 대괄호 안에 기존 항목을 모두 적고 `'korean:ralt_hangul'`을 쉼표로 구분해 추가한다. 매핑을 적용하면 오른쪽 Alt는 한/영 키로 동작한다. `xev`에서 `Hangul`로 잡히는지 확인하고 Fcitx 5의 **Trigger Input Method**에 등록한다.

## 4. 특정 앱에서만 입력이 안 될 때

| 증상 | 확인할 항목 |
| --- | --- |
| 모든 앱에서 한글 조합 불가 | 입력기 실행·Hangul 엔진·세션 재로그인 |
| 한·영 키가 앱 메뉴를 엶 | 키가 Alt로 전달되는지, 전환 단축키 충돌 |
| Chrome·Electron 등 특정 앱만 실패 | 앱 버전, X11/XWayland/Wayland 실행 방식 |
| Qt 앱에서만 실패 | 해당 Qt 입력기 모듈·앱 번들 구성 |

`GTK_IM_MODULE`·`QT_IM_MODULE`·`XMODIFIERS`를 무조건 모두 고정하면 다른 세션의 정상 동작을 방해할 수 있다. 디스플레이 서버와 앱 툴킷에 맞춰 설정한다. [Fcitx5 Wayland 연동](https://fcitx-im.org/wiki/Using_Fcitx_5_on_Wayland).

입력 문제 때문에 오래된 브라우저를 내려받아 보안 업데이트를 계속 막는 방식은 피한다. 지원되는 최신 업데이트를 유지하면서 입력기·세션 설정을 분리해 진단한다.
