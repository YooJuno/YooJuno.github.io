---
title: "Bash·Zsh 개발 환경 설정"
slug: "shell-development-environment"
date: "2025-03-25"
updated: "2026-02-03"
category: "개발 환경·배포"
tags: [Bash, Zsh, Linux]
summary: "시작 파일·PATH·alias와 프로젝트별 환경 분리."
---

셸 설정에는 모든 프로젝트가 공유할 설정만 둔다. ROS 배포판·Conda·CUDA 경로를 무조건 함께 불러오면 의도하지 않은 실행 파일과 라이브러리가 선택될 수 있다.

## 1. 현재 셸과 시작 파일

```bash
printf '%s\n' "$SHELL"
ps -p $$ -o comm=
```

`$SHELL`은 로그인 셸 설정이며 현재 프로세스와 다를 수 있다.

| 셸 | 대표 시작 파일 |
| --- | --- |
| Bash 대화형 non-login | `~/.bashrc` |
| Bash login | `/etc/profile` 후 `~/.bash_profile`·`~/.bash_login`·`~/.profile` 중 먼저 존재하는 파일 |
| Zsh 대화형 | `~/.zshrc` |
| Zsh login | `~/.zprofile` 등 로그인용 파일도 순서에 따라 읽음 |

터미널 설정에 따라 login 셸 여부가 달라진다. 설정이 적용되지 않으면 파일 이름부터 확인한다. [Bash 시작 파일](https://www.gnu.org/s/bash/manual/html_node/Bash-Startup-Files.html), [Zsh 시작 파일](https://zsh.sourceforge.io/Doc/Release/Files.html).

## 2. PATH와 alias

```bash
export PATH="$HOME/.local/bin:$PATH"
alias gs='git status --short --branch'
alias gd='git diff'
```

`PATH`는 실행 파일 검색 순서다. 기존 `$PATH`를 빠뜨리면 시스템 명령을 찾지 못할 수 있다. 변경 후 `command -v python3`·`command -v cmake`로 실제 선택 경로를 확인한다.

재부팅·종료·삭제처럼 영향이 큰 명령은 모호한 짧은 별칭보다 원래 명령을 명시하는 편이 안전하다.

## 3. 프로젝트 환경 함수

다음 함수는 Ubuntu의 ROS 2 Jazzy와 `~/ros2_ws`를 사용하는 Bash 예시다. 프로젝트 경로와 배포판은 자신의 환경에 맞춘다.

```bash
use_robot_workspace() {
    source /opt/ros/jazzy/setup.bash || return
    if [ -f "$HOME/ros2_ws/install/local_setup.bash" ]; then
        source "$HOME/ros2_ws/install/local_setup.bash"
    fi
}
```

Zsh에서는 대응하는 `setup.zsh`·`local_setup.zsh`를 사용한다. 함수는 환경을 추가로 읽을 뿐 이전 환경을 완전히 제거하지 않는다. 다른 ROS 배포판으로 전환할 때는 새 터미널에서 시작한다.

## 4. Zsh 플러그인

Oh My Zsh를 사용하는 경우 자동 제안·구문 강조 플러그인은 공식 저장소에서 설치 방법을 확인한다. 외부 설치 스크립트는 내용을 확인한 뒤 실행한다.

```zsh
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
```

위 목록은 플러그인이 설치되어 있다는 전제다. Oh My Zsh를 사용하지 않으면 동일한 설정만 넣어도 플러그인이 자동으로 생기지 않는다. [Oh My Zsh](https://github.com/ohmyzsh/ohmyzsh), [자동 제안](https://github.com/zsh-users/zsh-autosuggestions), [구문 강조](https://github.com/zsh-users/zsh-syntax-highlighting).

Conda의 `(base)` 표시만 숨기는 것과 자동 활성화를 끄는 것은 다르다. 전자는 프롬프트 표시 설정이고, 후자는 사용할 환경을 직접 활성화하도록 동작을 바꾸는 설정이다. 셸 시작 파일에 가상환경의 `bin` 경로를 중복 추가하기보다 Conda의 초기화·활성화 기능을 사용한다.
