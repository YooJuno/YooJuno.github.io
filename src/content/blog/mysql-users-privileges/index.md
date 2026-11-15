---
title: "MySQL 계정과 접근 권한"
slug: "mysql-users-privileges"
date: "2026-11-15"
updated: "2026-11-15"
category: "웹·보안"
tags: [MySQL, Authentication, Privileges]
summary: "user@host·최소 권한·GRANT·REVOKE·계정 삭제."
---

MySQL 계정은 사용자 이름만이 아니라 **`'user'@'host'` 조합**이다. 다음은 MySQL 8.4 기준의 관리 예시이며 권한 있는 관리자 세션에서 실행한다. 실제 비밀번호는 공개 문서에 넣지 않는다.

## 1. 접속 계정 확인

```sql
SELECT USER(), CURRENT_USER();
SHOW GRANTS;
```

`USER()`는 접속 시 제시한 사용자·호스트, `CURRENT_USER()`는 인증에 실제 사용된 계정을 나타낸다. 호스트 매칭에 따라 기대와 다른 권한이 적용되는지 확인하는 데 도움이 된다.

`localhost`와 특정 원격 호스트 계정은 별개다. 클라이언트의 소켓·TCP 연결 방식과 서버 설정도 구분한다. [계정 이름 규칙](https://dev.mysql.com/doc/refman/8.4/en/account-names.html).

## 2. 최소 권한 계정

다음 비밀번호 문자열은 반드시 새로 생성한 값으로 바꾼다. 예제 DB·테이블도 실제 접근 범위에 맞춘다.

```sql
CREATE USER 'app_reader'@'localhost'
    IDENTIFIED BY 'REPLACE_WITH_GENERATED_PASSWORD';

GRANT SELECT ON app_db.measurements TO 'app_reader'@'localhost';
SHOW GRANTS FOR 'app_reader'@'localhost';
```

서비스 계정에 `root`나 `ALL PRIVILEGES ON *.*`를 기본으로 부여하지 않는다. 읽기·쓰기·마이그레이션에 필요한 권한을 분리한다. 일반적인 `CREATE USER`·`GRANT`·`REVOKE` 사용 후에는 별도의 `FLUSH PRIVILEGES`가 필요하지 않다. [계정과 권한 관리](https://dev.mysql.com/doc/refman/8.4/en/creating-accounts.html).

## 3. 권한 변경과 계정 삭제

```sql
GRANT INSERT ON app_db.measurements TO 'app_reader'@'localhost';
REVOKE INSERT ON app_db.measurements FROM 'app_reader'@'localhost';
```

삭제할 때도 계정의 host까지 명시한다.

```sql
DROP USER 'app_reader'@'localhost';
```

`mysql.user`를 직접 `DELETE`하는 방식 대신 계정 관리 구문을 사용한다. 계정 삭제 전 해당 계정을 사용하는 서비스·작업과 객체의 `DEFINER` 의존성도 확인한다.

## 4. 원격 접근 점검

원격 접근 허용은 DB 계정 생성만으로 끝나지 않는다.

| 계층 | 확인 항목 |
| --- | --- |
| 네트워크 | 서버 주소·포트·라우팅·방화벽 |
| MySQL 서버 | 수신 인터페이스·접속 정책 |
| 계정 | 사용자·접속 host·인증 방식 |
| 권한 | 필요한 DB·테이블·연산만 허용 |
| 전송 보안 | TLS·인증서 검증·비밀 관리 |

`'user'@'%'`는 접속 host 범위를 넓히는 설정이다. MySQL 8.4는 host의 `%`·`_` 와일드카드를 사용 중단 예정(deprecated)으로 표시한다. 가능한 한 구체적인 호스트·네트워크 정책을 사용한다. DB 포트를 인터넷 전체에 노출하는 것과 애플리케이션이 DB에 접근하는 것은 별개로 설계한다.
