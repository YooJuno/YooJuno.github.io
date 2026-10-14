---
id: "proj-stm32"
title: "STM32 기반 LED 피아노"
start: "2023-04"
end: "2023-06"
meta: "4인"
---

건반 입력에 따라 음과 LED를 출력하는 피아노 모듈을 4인 팀으로 만들었습니다. 회로 제작과 DMA+SPI 통신 개발을 맡아 WS2812 타이밍에 맞는 전송 비트 패턴을 구성했습니다.

- mbed OS 로 STM32(NUCLEO-F411RE) 펌웨어 개발
- 건반을 누르면 WS2812 LED 가 해당 색으로 점등되고 피에조 부저에서 음 출력
- PWM 으로 건반별 음을 생성

#### DMA 를 쓴 이유

CPU가 SPI 전송 데이터를 매번 공급하는 대신, DMA가 메모리의 버퍼를 SPI 주변장치로 전달하도록 구성했습니다. CPU는 전송 설정과 완료 처리를 맡고, 전송 중에는 건반 입력 등 다른 작업을 처리할 수 있습니다. DMA도 시스템 버스를 사용하므로 버스 지연이나 모든 CPU 개입이 사라지는 것은 아닙니다.

`STM32` `mbed OS` `DMA` `SPI`

[GitHub](<https://github.com/YooJuno/STM32-MBED/tree/main/Final>) [Demo Video](<https://www.youtube.com/watch?v=sW-dLjTRV7A>)

![시스템 구성](./images/architecture.jpg)
![피아노 회로](./images/board.jpg)
