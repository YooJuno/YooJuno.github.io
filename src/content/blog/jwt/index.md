---
title: "JWT"
slug: "jwt"
date: "2026-02-21"
category: "개발"
tags:
  - Web
  - 보안
  - 인증
summary: "서명·클레임 검증과 토큰 저장·갱신·폐기."
---

JWT(JSON Web Token)는 **클레임을 전달하는 토큰 형식**이다. 인증 시스템에서는 발급자·사용 대상·유효 기간을 검증하고, 저장·갱신·폐기 정책을 별도로 관리한다. [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519).

## 1. JWT·JWS·JWE

웹 API에서 흔히 보는 JWT는 JWS Compact 형식으로 서명한 형태다.

```text
base64url(header).base64url(payload).base64url(signature)
```

- **Header:** 알고리즘 식별자 `alg`, 키 식별자 `kid`, 토큰 타입 등의 메타데이터.
- **Payload:** 사용자 식별자·대상·만료 시각 등의 클레임.
- **Signature:** 앞의 두 부분을 결합한 데이터의 위변조를 검증하기 위한 값.

JWS의 payload는 Base64URL로 인코딩돼 토큰 보유자가 읽을 수 있다. 비밀번호·비밀키·불필요한 개인정보는 제외한다. 암호화된 JWT는 JWE로 표현하며, 여기서는 서명된 JWS를 다룬다. [JWT 표현 방식](https://datatracker.ietf.org/doc/html/rfc7519#section-3).

## 2. 클레임 검증

| 클레임 | 의미 | 검증·관리 항목 |
| --- | --- | --- |
| `iss` | 발급자 | 허용한 발급자와 일치 여부 |
| `sub` | 주체 식별자 | 발급자 내 사용자 식별·계정 매핑 |
| `aud` | 토큰의 사용 대상 | 현재 API의 대상 식별자 포함 여부 |
| `exp` | 만료 시각 | 만료 시각 도달 여부 |
| `nbf` | 사용 가능 시각 | 사용 가능 시각 도달 여부 |
| `iat` | 발급 시각 | 서비스의 발급 시점 정책 충족 여부 |
| `jti` | 토큰 식별자 | 중복 사용 탐지·폐기 이력 조회 |

NumericDate는 Unix epoch 기준 **초** 단위다. `Date.now()`의 밀리초 값과 구분한다. 필수 클레임은 애플리케이션의 토큰 프로파일에서 정한다. [RFC 7519 클레임](https://datatracker.ietf.org/doc/html/rfc7519#section-4).

API는 `role`·`scope`와 함께 대상 리소스의 접근 권한을 검사한다. 로그인 여부와 개별 주문의 수정 권한은 별개다.

## 3. 서버 검증 절차

검증 라이브러리에 알고리즘·키·클레임 정책을 명시한다. Payload 디코딩과 서명 검증은 별도 절차다.

1. 토큰의 크기·형식과 이 용도에서 허용하는 토큰 타입을 확인한다.
2. 서버 설정의 알고리즘 허용 목록을 적용한다. 토큰의 `alg`를 그대로 신뢰하지 않는다.
3. 신뢰한 발급자의 키로 서명을 검증한다.
4. 요구한 `iss`·`aud`·`exp`·`nbf` 등의 존재와 값을 검사한다.
5. 폐기·계정 상태·권한 정책을 적용하고, 그 후 요청을 처리한다.

`kid`는 신뢰한 발급자의 키 집합에서만 조회한다. 임의 키 URL 조회, 대칭키·비대칭키 알고리즘 혼동, 서명·만료 검증 우회를 차단한다. [JWT Best Current Practices](https://datatracker.ietf.org/doc/html/rfc8725).

## 4. Access Token·Refresh Token

![Access Token 검증과 Refresh Token 재발급, 폐기 책임을 구분한 흐름도](./jwt-lifecycle.svg)

- **Access Token:** API 접근에 사용한다. 탈취된 bearer token은 유효한 동안 다른 사람이 사용할 수 있으므로 노출을 줄인다.
- **Refresh Token:** 발급 서버에 새 Access Token을 요청하는 자격이다. 일반 리소스 API에 보내지 않으며, 반드시 JWT일 필요도 없다.

Access Token 만료 시 유효한 Refresh Token으로 갱신한다. Refresh Token도 만료·폐기됐다면 다시 인증한다. 수명·저장 위치·전송 방식은 자산 민감도와 폐기 요구에 맞춰 정한다.

OAuth 공개 클라이언트의 Refresh Token은 rotation 또는 sender-constrained 방식으로 보호한다. Rotation은 사용한 토큰을 교체하고 이전 토큰의 재사용을 탐지한다. 재사용 시 폐기 범위와 동시 갱신·네트워크 재시도 정책도 필요하다. [OAuth 2.0 Security BCP](https://datatracker.ietf.org/doc/html/rfc9700#section-4.14).

## 5. 토큰 저장·브라우저 보안

| 위치 | 장점 | 남는 문제 |
| --- | --- | --- |
| JavaScript 메모리 | 영구 저장소에 남기지 않음 | 실행 중 XSS로 악용될 수 있고 새로고침 시 유지되지 않음 |
| `localStorage`·`sessionStorage` | 구현과 접근이 간단 | 같은 출처의 악성 스크립트가 읽을 수 있음 |
| `HttpOnly` 쿠키 | JavaScript의 직접 읽기를 제한 | 브라우저가 요청에 자동으로 포함하므로 CSRF와 전송 범위를 고려 |

`HttpOnly`는 토큰의 직접 읽기를 제한한다. XSS에 의한 인증 요청 실행과 쿠키 자동 전송에 따른 CSRF는 별도 방어 대상이다. [OWASP 브라우저 저장소 보안](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html).

쿠키를 사용한다면 `Secure`, 적절한 `SameSite`, 좁은 전송 범위와 CSRF 방어를 함께 구성한다. 특히 쿠키로 Refresh Token을 보내는 재발급 endpoint도 보호 대상이다. CORS 허용 목록만으로 이 검사를 대신하지 않는다. [OWASP CSRF 방어](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html), [CORS 정리](/blog/cors).

## 6. 로그아웃·키 교체

서명 검증은 세션 저장소 조회 없이 가능하다. 토큰 폐기·계정 상태·키 배포는 별도로 관리한다.

- **로그아웃:** 클라이언트에서 토큰을 지워도 이미 복사된 Access Token은 만료 전까지 유효할 수 있다.
- **강제 폐기:** 짧은 수명, 토큰·세션 버전, denylist 등의 방식을 요구에 맞게 조합한다.
- **Refresh 관리:** 발급·회전·폐기 이력을 저장하고 재사용 탐지와 계정 잠금 정책을 연결한다.
- **키 교체:** 새 키 배포, 기존 토큰의 남은 유효 기간, 검증 서버의 키 캐시 갱신을 함께 관리한다.

즉시 폐기를 위해 중앙 상태를 조회하는 설계는 그 조회 비용도 고려한다. 토큰·쿠키 원문은 로그·분석 도구·URL에서 제외한다. [JWT 운영 시 검증 원칙](https://datatracker.ietf.org/doc/html/rfc8725), [Refresh Token 보호](https://datatracker.ietf.org/doc/html/rfc9700#section-4.14).

## 7. 세션·OAuth·OIDC

서버 세션도 저장소를 공유하면 수평 확장이 가능하다. 반대로 JWT를 선택하면 키 배포·토큰 폐기·클레임 최신성 관리가 추가된다. 단일 서비스이고 즉시 세션 종료가 중요하다면 불투명한 세션 ID가 더 단순할 수 있다.

OAuth 2.0은 위임 인가에 관한 프레임워크이고, OIDC는 그 위에 인증 계층을 정의한다. OIDC의 **ID Token은 클라이언트가 로그인 결과를 확인하는 용도**이므로, 이를 그대로 API용 Access Token처럼 사용하지 않는다. OAuth Access Token이 항상 JWT인 것도 아니다. [OIDC ID Token](https://openid.net/specs/openid-connect-core-1_0.html#IDToken).

## 참고 자료

- [RFC 7519 — JSON Web Token](https://datatracker.ietf.org/doc/html/rfc7519)
- [RFC 8725 — JWT Best Current Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [RFC 9700 — OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/html/rfc9700)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
