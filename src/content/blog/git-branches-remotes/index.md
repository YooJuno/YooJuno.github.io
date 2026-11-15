---
title: "[Git] 브랜치와 원격 저장소"
slug: "git-branches-remotes"
date: "2026-11-15"
updated: "2026-11-15"
category: "개발 환경·배포"
tags: [Git, Branch, Workflow]
summary: "fetch·pull·merge·push와 브랜치 생성·변경·정리."
---

브랜치는 특정 커밋을 가리키는 이름이다. 로컬 `main`, 원격 추적 참조 `origin/main`, 서버의 `main`은 역할이 다르다.

## 1. 로컬과 원격

| 명령 | 변경 범위 |
| --- | --- |
| `git fetch origin` | 원격 커밋과 추적 참조를 가져옴; 작업 브랜치는 그대로 |
| `git merge origin/main` | 현재 브랜치에 가져온 이력을 통합 |
| `git pull` | fetch 후 merge 또는 rebase 등 설정된 방식으로 통합 |
| `git push` | 로컬 이력을 서버 브랜치에 전달 |

`origin/main`은 서버를 실시간으로 보는 이름이 아니라 **마지막으로 가져온 원격 상태를 나타내는 로컬 참조**다. fetch 후 차이를 확인한다. [Git pull](https://git-scm.com/docs/git-pull).

```bash
git status
git remote -v
git fetch origin --prune
git log --oneline --graph --decorate --all -20
git diff main..origin/main
```

`--prune`은 서버에서 사라진 원격 추적 참조를 정리한다. 로컬 작업 브랜치까지 삭제하는 명령은 아니다.

## 2. 작업 브랜치 생성

아래는 로컬 `main`을 원격과 fast-forward로 맞춘 뒤 새 작업을 시작하는 예시다. 커밋하지 않은 변경이 있으면 먼저 보관하거나 커밋한다.

```bash
git switch main
git pull --ff-only origin main
git switch -c feature/scan-filter
git add src/filter.cpp
git commit -m "feat: add scan range filter"
git push -u origin feature/scan-filter
```

`--ff-only`가 실패하면 로컬·원격에 서로 다른 커밋이 있다는 뜻이다. 자동으로 덮어쓰지 말고 merge·rebase 중 어떤 방식이 필요한지 이력을 확인한다. `-u`는 추적 브랜치를 연결한다.

## 3. merge와 rebase

- **merge:** 두 이력을 합친다. 필요하면 병합 커밋을 남겨 분기 구조를 보존한다.
- **rebase:** 커밋을 다른 기준 위에 다시 적용한다. 재작성된 커밋의 ID가 바뀐다.

이미 여러 사람이 사용하는 브랜치의 이력을 재작성하면 다른 작업자의 기반이 달라진다. 팀 규칙이 없다면 공유 브랜치에서는 병합을 우선 검토한다. 충돌은 파일 내용을 확인해 해결하고 검사한 뒤 완료한다.

## 4. 이름 변경과 삭제

현재 로컬 브랜치의 이름을 바꾸고 새 이름으로 서버에 올리는 예시다.

```bash
git branch -m feature/scan-validation
git push -u origin feature/scan-validation
```

이 명령만으로 서버의 이전 이름이 사라지지는 않는다. PR·기본 브랜치·CI 참조를 확인한 뒤 이전 원격 브랜치를 삭제한다.

```bash
git push origin --delete feature/scan-filter
```

병합된 로컬 작업 브랜치는 다른 브랜치로 이동한 뒤 정리한다.

```bash
git switch main
git branch --merged main
git branch -d feature/scan-validation
```

`-d`는 안전 조건을 확인하고, `-D`는 강제 삭제한다. 다만 로컬 `-d`의 보호가 서버의 원격 브랜치 삭제에도 적용되는 것은 아니다. 삭제할 브랜치와 병합 상태를 직접 확인한다. [Git branch](https://git-scm.com/docs/git-branch).

## 5. 커밋 메시지

`type: subject`는 팀에서 정하는 형식이지 Git의 필수 문법이 아니다. 제목에는 변경 목적을 짧게 적고, 본문에는 이유·제약·영향을 남긴다.

```text
fix: reject scans with missing timestamps

Skip incomplete frames before queue insertion to preserve ordering.
```

`feat`·`fix`·`docs`·`refactor`·`test` 등은 저장소에서 일관되게 사용한다. 글자 수 제한도 팀 규칙에 따른다.

서로 관련 없는 이력이라는 오류를 강제 푸시로 해결하면 원격 기록을 잃을 수 있다. 원격 주소·기준 브랜치가 맞는지 먼저 확인하고, 실제로 이력을 교체해야 하는 상황인지 구분한다.
