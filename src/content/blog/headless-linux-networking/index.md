---
title: "모니터 없는 Linux 장치의 Wi-Fi·SSH 연결"
slug: "headless-linux-networking"
date: "2025-03-01"
updated: "2025-03-01"
category: "시스템 통합"
tags: [Linux, NetworkManager, SSH]
summary: "nmcli 연결·IP 확인·원격 접속 실패 점검."
---

모니터 없는 Jetson·Raspberry Pi 등의 장치는 네트워크를 바꾸면 기존 SSH 연결이 끊길 수 있다. **새 네트워크 준비와 장치에 다시 접근할 수단**을 먼저 마련한다. 아래 `nmcli` 예시는 NetworkManager가 네트워크를 관리하는 Linux 기준이다.

## 1. 장치·연결 상태

```bash
nmcli device status
nmcli connection show
nmcli -f IN-USE,SSID,SIGNAL,SECURITY device wifi list
ip -br address
ip route
```

인터페이스 이름은 `wlan0`·`wlp...` 등 장치마다 다르다. 무선 장치가 없거나 `unmanaged`이면 드라이버·rfkill·다른 네트워크 관리 서비스부터 확인한다. [nmcli](https://networkmanager.dev/docs/api/latest/nmcli.html).

## 2. Wi-Fi 연결

아래 이름은 예시다. 실제 SSID를 넣고 비밀번호는 대화형으로 입력한다.

```bash
nmcli --ask device wifi connect "example-network"
```

명령줄에 비밀번호를 직접 적으면 셸 이력이나 실행 기록에 남을 수 있다. 접속 중인 네트워크를 바꾸는 작업은 유선·시리얼 등 복구 경로가 있는 상태에서 진행한다.

주변에 아직 없는 네트워크는 프로필만 미리 만들 수 있다. 다음은 WPA-PSK 환경 예시이며 기업용 인증·캡티브 포털과는 다르다.

```bash
nmcli connection add type wifi ifname wlan0 con-name field-wifi ssid "example-network"
nmcli connection modify field-wifi wifi-sec.key-mgmt wpa-psk
nmcli connection modify field-wifi connection.autoconnect no
nmcli --ask connection up field-wifi
```

마지막 줄이 실제 연결 전환이다. 기존 연결을 즉시 끊는 명령과 저장만 하는 명령을 구분한다. 자동 연결 설정은 현장에서 접속을 확인한 뒤 조정한다.

## 3. 주소를 모를 때

| 방법 | 전제·한계 |
| --- | --- |
| 공유기 DHCP 임대 목록 | 공유기 관리 권한 필요 |
| DHCP 예약 | 동일 공유기에서 일정한 주소 사용 |
| `robot.local` 같은 mDNS | 장치 지원·같은 링크·멀티캐스트 허용 필요 |
| 장치의 `hostname -I`·`ip address` | 시리얼·로컬 콘솔 접근 가능 |

같은 SSID에 연결됐어도 AP client isolation이나 VLAN 때문에 장치 간 통신이 차단될 수 있다. ping 응답이 없다는 이유만으로 장치가 꺼졌다고 단정하지 않는다. 무단으로 다른 네트워크를 스캔하지 말고 관리하는 망의 DHCP·장치 정보부터 확인한다.

Raspberry Pi는 Imager의 OS 사용자 지정에서 호스트 이름·사용자·Wi-Fi·SSH를 준비할 수 있다. 기본 사용자 이름을 가정하지 말고 생성한 계정으로 접속한다. [Raspberry Pi 원격 접속](https://www.raspberrypi.com/documentation/computers/remote-access.html).

## 4. SSH 진단

```bash
ssh -v robot@robot.local
systemctl status ssh
ss -ltn
```

첫 줄은 클라이언트, 뒤의 두 줄은 장치 콘솔에서 실행한다. `robot`과 호스트 이름은 실제 계정·주소로 바꾼다.

- **이름 해석 실패:** IP 직접 접속과 DNS·mDNS 확인.
- **시간 초과:** 경로·격리·방화벽·장치 연결 확인.
- **연결 거부:** 해당 주소에 SSH 서버가 실행·대기 중인지 확인.
- **인증 실패:** 사용자·키·서버 정책 확인. 비밀번호·키를 로그와 함께 공유하지 않는다.

## 5. 포트포워딩과 외부 접속

포트포워딩은 공유기의 외부 주소·포트를 내부 주소·포트로 연결하는 설정이다. 포트 `8080`이 특정 프로토콜을 자동으로 의미하지 않으며, TCP·UDP도 서비스에 맞춰 구분한다.

외부 접근에는 공인 주소·상위 NAT·방화벽·인증이 모두 관계된다. CGNAT 환경에서는 공유기 설정만으로 외부에서 접속되지 않을 수 있다. SSH·관리 페이지를 인터넷 전체에 직접 노출하기보다 인증된 VPN 등 접근 경로를 우선 검토한다. 내부 주소·공인 주소·MAC·Wi-Fi 자격증명은 예제와 스크린샷에서 제거한다.
