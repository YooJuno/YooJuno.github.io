---
title: "Docker 개발 환경: 실행·파일·포트"
slug: "docker-development-basics"
date: "2026-11-15"
updated: "2026-11-15"
category: "개발 환경·배포"
tags: [Docker, Containers, Linux]
summary: "컨테이너 수명·파일 보존·bind mount·포트 공개."
---

이미지는 실행 환경의 기반이고, 컨테이너는 그 이미지에서 생성한 실행 인스턴스다. 프로그램 종료·컨테이너 삭제·이미지 삭제는 서로 다른 작업이다.

## 1. 생성·시작·진입

```bash
docker run -it --name study-dev ubuntu:24.04 bash
```

이름 있는 컨테이너를 생성해 Bash를 실행한다. 셸을 종료한 뒤 같은 컨테이너를 다시 시작하거나, 실행 중인 컨테이너에 추가 셸로 들어가는 명령은 다르다.

```bash
docker ps -a
docker start -ai study-dev
```

```bash
docker exec -it study-dev bash
```

`run`은 새 컨테이너를 만들고, `start`는 기존 컨테이너를 시작하며, `exec`는 실행 중인 컨테이너에 새 프로세스를 만든다. 반복해서 `run`만 실행하면 같은 이름 충돌이나 불필요한 컨테이너가 생긴다. [컨테이너 실행](https://docs.docker.com/engine/containers/run/).

## 2. 파일 복사와 보존

```bash
mkdir -p ./results
docker cp study-dev:/tmp/result.txt ./results/
docker cp ./input.txt study-dev:/tmp/input.txt
```

예제의 원본 파일은 먼저 존재해야 한다. `docker cp`는 파일 복사이지 이후 변경을 자동 동기화하는 기능이 아니다. 컨테이너를 삭제하면 writable layer의 파일도 사라지므로 산출물은 마운트나 복사로 보관한다.

## 3. bind mount

소스 디렉터리를 연결할 때는 경로와 쓰기 권한을 명시한다.

```bash
docker run --rm -it \
  --mount type=bind,src="$(pwd)",dst=/workspace,readonly \
  -w /workspace ubuntu:24.04 bash
```

위 예제는 현재 폴더를 읽기 전용으로 연결한다. 컨테이너에서 파일을 생성해야 하는 개발 환경은 쓰기 가능한 별도 산출물 경로나 volume을 사용한다. bind mount는 호스트 파일을 직접 노출하므로 홈 디렉터리 전체·SSH 키·인증 정보를 불필요하게 연결하지 않는다. [Bind mounts](https://docs.docker.com/engine/storage/bind-mounts/).

Linux에서 컨테이너가 root로 생성한 파일은 호스트에서도 root 소유가 될 수 있다. UID·GID와 출력 디렉터리 권한을 미리 설계한다.

## 4. 포트 공개

웹 앱 컨테이너에서 `-p 127.0.0.1:8080:3000`은 호스트 loopback의 8080을 컨테이너 3000에 연결하는 형식이다. 컨테이너 안의 앱은 접근 가능한 인터페이스에서 대기해야 한다.

Dockerfile의 `EXPOSE`만으로 호스트 포트가 공개되는 것은 아니다. `-p 8080:3000`처럼 host 주소를 생략하면 외부 인터페이스에도 공개될 수 있으므로 개발용 서비스는 접근 범위를 명시한다. [포트 공개](https://docs.docker.com/engine/network/port-publishing/).

## 5. 재현 가능한 환경

셸에서 수동 설치한 상태만 보관하지 말고 Dockerfile에 의존성과 설정을 기록한다. 이미지 태그는 바뀔 수 있으므로 재현이 중요하면 digest와 빌드 입력도 기록한다.

`docker commit`은 특정 상태의 스냅샷일 뿐, 설치 이유와 절차가 보이는 Dockerfile을 대체하지 않는다. `pause`는 프로세스를 일시 정지하고 `stop`은 종료를 요청하는 동작으로, 환경을 배포 가능한 형태로 고정하는 기능과 다르다.

GPU·GUI·카메라·ROS 통신은 추가적인 장치·디스플레이·네트워크 구성이 필요하다. 오류를 없애기 위해 무조건 `--privileged`나 인증 없는 디스플레이 접근을 허용하는 대신 필요한 권한만 전달한다.
