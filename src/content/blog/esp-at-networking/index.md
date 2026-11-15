---
title: "ESP-AT: Wi-Fi 연결과 TCP 데이터 송수신"
slug: "esp-at-networking"
date: "2026-11-15"
updated: "2026-11-15"
category: "시스템 통합"
tags: [ESP32, ESP-AT, TCP]
summary: "AT 명령 흐름·전송 바이트 수·비동기 응답 처리."
---

ESP-AT는 호스트 MCU가 UART 등의 인터페이스로 Wi-Fi 모듈을 제어하도록 제공하는 펌웨어다. 모든 ESP32·ESP8266 제품이 같은 AT 명령과 기본 baud rate를 사용하는 것은 아니다. **칩·펌웨어 버전을 먼저 확인**한다.

## 1. 기본 명령과 응답

| 명령 | 목적 |
| --- | --- |
| `AT` | 명령 처리 가능 여부 |
| `AT+GMR` | 펌웨어 버전 |
| `AT+RST` | 모듈 재시작 |
| `AT+CWMODE?` | Wi-Fi 모드 조회 |
| `AT+CWLAP` | 주변 AP 검색 |
| `AT+CWJAP?` | 연결된 AP 조회 |

일반 AT 명령은 CR-LF로 끝낸다. 응답은 `OK`·`ERROR` 외에도 연결 상태 알림이 비동기로 끼어들 수 있다. 문자열을 한 번 읽어 `OK` 포함 여부만 검사하는 방식보다 명령별 응답 상태를 파싱한다. [ESP-AT 명령 안내](https://docs.espressif.com/projects/esp-at/en/latest/esp32/AT_Command_Set/index.html).

## 2. Station 연결

다음은 ESP32 ESP-AT의 일반 전송 모드 예시다. SSID·비밀번호는 예제 자리표시자이며 실제 값은 공개 코드에 저장하지 않는다.

```text
AT+CWMODE=1
AT+CWJAP="example-network","REPLACE_WITH_WIFI_PASSWORD"
AT+CIPSTA?
```

각 명령의 완료 응답을 확인한 뒤 다음 단계로 진행한다. Wi-Fi 연결 완료와 IP 할당 완료도 구분한다. SoftAP 모드는 장치가 AP가 되는 방식이고, Station 모드는 기존 AP에 접속하는 방식이다.

## 3. 단일 TCP 연결

실습 PC에서 TCP 서버를 열고 같은 네트워크에서 접근 가능한 상태를 만든다. 다음 `192.0.2.10`은 문서용 주소이므로 실제 실습 서버의 주소로 바꾼다.

```text
AT+CIPMUX=0
AT+CIPSTART="TCP","192.0.2.10",5000
AT+CIPSEND=4
```

`>` 프롬프트를 받은 뒤 정확히 4바이트의 `test`를 전송한다. 페이로드에 CR-LF까지 붙이면 6바이트가 되므로, 명령 전송과 데이터 전송의 줄바꿈 설정을 구분한다. `SEND OK`는 상대 애플리케이션이 처리까지 완료했다는 응답이 아니다. [공식 TCP/IP 예제](https://docs.espressif.com/projects/esp-at/en/latest/esp32/AT_Command_Examples/TCP-IP_AT_Examples.html).

수신 데이터는 일반적인 단일 연결·능동 수신 설정에서 `+IPD,길이:데이터` 형태로 전달된다. 다중 연결·상대 주소 표시·수동 수신 모드에서는 형식이 달라질 수 있다.

## 4. MCU 수신 파서

UART 읽기 한 번에 응답 전체가 도착하거나 메시지 하나만 도착한다고 가정하지 않는다.

1. 링 버퍼 등에 들어온 바이트를 누적한다.
2. 명령 응답·상태 알림·데이터 헤더를 구분한다.
3. `+IPD` 길이를 읽은 뒤 해당 바이트 수만 페이로드로 처리한다.
4. 명령별 timeout·재시도·연결 해제를 상태로 관리한다.

TCP도 메시지 경계를 보장하지 않는 바이트 스트림이다. 애플리케이션 데이터에는 길이 헤더나 구분자 등 프레이밍 규칙이 필요하다. UART 분할과 TCP 분할은 서로 다른 계층의 문제다.

## 5. 일반 모드와 투명 전송

일반 모드는 AT 명령과 지정 길이 데이터를 구분해서 다룬다. 투명 전송 모드는 입력을 데이터로 전달하는 방식이며 지원 조건·탈출 시퀀스·가드 타임이 펌웨어별로 다를 수 있다.

처음 구현할 때는 일반 모드에서 상태 전이와 오류 처리를 확인하는 편이 단순하다. 패킷 최대 크기·버퍼·다중 연결 개수는 이전 예제의 숫자를 고정하지 말고 사용하는 펌웨어 문서를 확인한다.
