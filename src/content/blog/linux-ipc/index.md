---
title: "[Linux] IPC: 파이프·Unix 소켓·공유 메모리"
slug: "linux-ipc"
date: "2026-11-23"
category: "시스템 통합"
tags: [Linux, IPC, Unix Socket, Shared Memory]
summary: "프로세스 간 통신 방식의 선택 기준과 Unix 소켓 예제."
---

IPC(Inter-Process Communication)는 서로 다른 프로세스가 데이터를 보내거나 작업 상태를 알리는 방법이다. 같은 프로세스의 스레드는 주소 공간을 공유하지만 프로세스끼리는 기본적으로 분리된다. 공유 메모리를 쓰려면 양쪽에서 같은 영역을 명시적으로 매핑해야 한다.

## 방식 선택

| 방식 | 쓰기 좋은 경우 | 확인할 점 |
| --- | --- | --- |
| [파이프](https://man7.org/linux/man-pages/man7/pipe.7.html) | 부모가 자식 프로세스의 출력이나 로그를 읽을 때 | 단방향 바이트 스트림. 양방향이면 두 채널이 필요하다. |
| [Unix 도메인 소켓](https://man7.org/linux/man-pages/man7/unix.7.html) | 같은 장치에 있는 서비스끼리 요청·응답을 주고받을 때 | `SOCK_STREAM`은 메시지 경계가 없어 줄바꿈이나 길이 헤더로 구분한다. |
| [POSIX 메시지 큐](https://man7.org/linux/man-pages/man7/mq_overview.7.html) | 짧은 작업 요청을 보내고 수신자가 나중에 처리할 때 | 메시지 단위로 받는다. 최대 크기와 큐가 찼을 때의 동작을 확인한다. |
| [POSIX 공유 메모리](https://man7.org/linux/man-pages/man7/shm_overview.7.html) | 이미지 프레임처럼 큰 데이터를 계속 넘길 때 | 같은 버퍼를 읽으므로 전달 과정의 복사를 줄일 수 있다. 동기화와 버퍼 회수는 별도로 설계한다. |

장치 한 대에서 제어 요청을 주고받는다면 Unix 소켓부터 고려한다. 요청을 실제로 다른 장치에 보내야 할 때는 TCP 같은 네트워크 통신을 쓴다. TCP도 바이트 스트림이므로 메시지 경계는 애플리케이션에서 정한다.

## Unix 소켓 예제

`socketpair()`로 연결된 두 끝점을 만든 뒤, 부모와 자식이 하나씩 사용한다. Linux에서 저장해 `python3 ipc_demo.py`로 실행하면 `pong`이 출력된다. 포트나 소켓 파일을 만들 필요가 없다.

```python
import os
import socket

parent_socket, child_socket = socket.socketpair(socket.AF_UNIX, socket.SOCK_STREAM)
child_pid = os.fork()

if child_pid == 0:
    parent_socket.close()
    with child_socket, child_socket.makefile("rb") as requests:
        if requests.readline() == b"ping\n":
            child_socket.sendall(b"pong\n")
    os._exit(0)

child_socket.close()
with parent_socket, parent_socket.makefile("rb") as replies:
    parent_socket.sendall(b"ping\n")
    print(replies.readline().decode("ascii").rstrip("\n"))
os.waitpid(child_pid, 0)
```

줄바꿈이 요청과 응답의 끝을 표시한다. 따로 실행·재시작되는 서비스라면 보통 파일 경로에 바인딩한 Unix 소켓을 사용한다. 소켓 경로의 접근 권한과 타임아웃·재연결 방식도 정한다. [Python `socketpair()`](https://docs.python.org/3/library/socket.html#socket.socketpair).

## 큰 데이터와 공유 버퍼

센서 프레임과 제어 메시지를 꼭 같은 채널로 보낼 필요는 없다. 예를 들어 프레임은 공유 버퍼에 쓰고 소켓으로 슬롯 번호·크기·순번만 전송한다. 쓰기 완료 후에 슬롯을 알리고, 수신자가 다 읽었다고 응답하면 그 슬롯을 재사용한다. 더 쓸 슬롯이 없을 때 기다릴지, 새 프레임을 버릴지도 정해야 한다.

프로세스가 재시작됐거나 장치가 절전에서 돌아온 뒤에는 이전에 남은 값 대신 **새 요청에 대한 응답과 새 프레임**을 확인한다. 관련 점검은 [절전 복귀 후 장치와 통신 검증](/blog/linux-suspend-resume-validation)에 정리했다.
