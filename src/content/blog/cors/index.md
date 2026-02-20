---
title: "CORS"
date: "2026-02-20"
category: "개발"
tags:
  - Web
  - 보안
  - HTTP
summary: "웹 브라우저가 보안상 다른 도메인(출처)의 자원 접근을 제한하는 정책(SOP)을 예외적으로 허용해주는 HTTP 기반 메커니즘"
---

# CORS(Cross-Origin Resource Sharing)

CORS는 브라우저가 다른 출처(Origin)의 리소스에 접근할 때 적용하는 보안 규칙입니다.  
핵심은 CORS가 "보안을 푸는 기능"이 아니라, **안전하게 예외를 허용하는 메커니즘**이라는 점입니다.

## 먼저: Origin이란?

Origin은 아래 3가지 조합으로 결정됩니다.

- Protocol (http / https)
- Host (domain)
- Port (3000, 443 등)

셋 중 하나라도 다르면 다른 Origin입니다.

예시:

- `https://app.example.com` -> `https://api.example.com` : Host가 달라서 교차 출처
- `http://example.com` -> `https://example.com` : Protocol이 달라서 교차 출처
- `https://example.com:3000` -> `https://example.com:443` : Port가 달라서 교차 출처

## 왜 CORS가 필요한가?

브라우저는 기본적으로 SOP(Same-Origin Policy)로 스크립트의 교차 출처 요청을 제한합니다.  
이 제한이 없으면 악성 사이트가 사용자의 인증정보를 악용해 타 사이트 API를 호출할 위험이 커집니다.

CORS는 서버가 명시적으로 "이 출처는 허용"이라고 응답할 때만 브라우저가 결과를 열어줍니다.

## CORS 동작 방식

요청은 크게 2가지로 나뉩니다.

1. Simple Request
2. Preflight Request

### 1) Simple Request

조건이 단순한 요청(`GET`, 일부 `POST`, 제한된 헤더)은 브라우저가 바로 본요청을 보냅니다.  
그 후 응답 헤더의 `Access-Control-Allow-Origin`을 확인해 자바스크립트 접근을 허용/차단합니다.

### 2) Preflight Request (OPTIONS)

`PUT`, `DELETE`, 커스텀 헤더, JSON 본문 등 조건이 복잡하면 브라우저가 먼저 `OPTIONS` 요청을 보냅니다.  
서버가 허용 정책을 응답하면 그때 본요청을 전송합니다.

즉, 프리플라이트는 "본요청 전에 권한을 확인하는 사전 협상"입니다.

## 꼭 알아야 할 CORS 헤더

- `Access-Control-Allow-Origin`: 허용할 출처 (`*` 또는 특정 Origin)
- `Access-Control-Allow-Methods`: 허용할 메서드 (`GET`, `POST`, `PUT` 등)
- `Access-Control-Allow-Headers`: 허용할 요청 헤더 (`Authorization`, `Content-Type` 등)
- `Access-Control-Allow-Credentials`: 쿠키/인증정보 포함 요청 허용 여부
- `Access-Control-Max-Age`: 프리플라이트 결과 캐시 시간

자주 놓치는 규칙:

- `Allow-Credentials: true`일 때 `Allow-Origin: *`는 사용할 수 없습니다.
- 쿠키 인증을 쓴다면 프론트의 `credentials: 'include'`와 서버 헤더 설정이 함께 맞아야 합니다.

## 실무에서 많이 발생하는 문제

- 서버는 200인데 브라우저 콘솔에서는 CORS 에러가 발생함
- 개발 환경(`localhost`)은 되는데 운영 도메인에서 막힘
- 프록시/CDN/로드밸런서를 거치며 CORS 헤더가 유실됨
- OPTIONS 요청을 라우팅/보안필터에서 차단함

중요한 포인트는 **CORS는 브라우저 보안 정책**이라는 점입니다.  
같은 요청이라도 Postman/서버 간 통신에서는 성공하고 브라우저에서만 실패할 수 있습니다.

## 안전한 운영 가이드

- 운영에서는 허용 Origin을 화이트리스트로 명시 (`*` 남용 금지)
- 필요한 메서드/헤더만 최소 허용
- 인증이 필요한 API는 Credentials 정책을 명확히 분리
- 프리플라이트 응답(OPTIONS)을 API 게이트웨이/보안 레이어까지 포함해 점검
- 환경별(로컬/스테이징/운영) Origin 설정을 분리 관리

## 디버깅 체크리스트

1. 브라우저 Network 탭에서 `OPTIONS` 요청 존재 여부 확인
2. 응답 헤더에 `Access-Control-Allow-*` 값이 정확한지 확인
3. `Origin` 요청 헤더와 서버 허용 목록이 정확히 일치하는지 확인
4. Credentials 사용 시 `Allow-Origin`이 와일드카드인지 확인
5. 프록시/CDN에서 헤더가 제거되지 않는지 확인

## 마무리

CORS는 프론트 문제처럼 보이지만 실제로는 **브라우저 + 서버 정책 설계 문제**입니다.  
동작 원리를 이해하면 에러 메시지에 끌려다니지 않고, 빠르게 원인을 좁혀 해결할 수 있습니다.
