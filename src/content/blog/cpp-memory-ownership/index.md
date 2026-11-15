---
title: "[C++] 객체 수명과 스마트 포인터"
slug: "cpp-memory-ownership"
date: "2026-11-15"
updated: "2026-11-15"
category: "프로그래밍"
tags: [C++, RAII, Smart Pointers]
summary: "RAII·소유권·move·순환 참조와 콜백 수명."
---

메모리 관리에서 먼저 정할 것은 **누가 객체를 소유하고 언제 해제하는지**다. 포인터를 전달한다는 사실만으로 소유권이 이전되지는 않는다. 예제는 C++17 기준이다.

## 1. RAII와 값 객체

RAII는 자원의 획득·해제를 객체 수명에 연결하는 방식이다. 지역 객체는 정상 반환이나 예외로 범위를 벗어날 때 소멸한다. 메모리뿐 아니라 파일·잠금에도 적용한다.

일반적인 데이터는 `std::vector`·`std::string` 같은 값 객체를 우선 사용한다. 동적 할당과 포인터는 다형성·수명 분리 등 필요한 이유가 있을 때 도입한다. [자원 관리 지침](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r1-manage-resources-automatically-using-resource-handles-and-raii-resource-acquisition-is-initialization).

## 2. 소유권에 따른 포인터

| 타입 | 소유권 | 용도 |
| --- | --- | --- |
| `std::unique_ptr<T>` | 단일 소유 | 기본적인 동적 객체 관리 |
| `std::shared_ptr<T>` | 공유 소유 | 여러 주체가 수명을 함께 유지 |
| `std::weak_ptr<T>` | 소유하지 않음 | 공유 객체 관찰·순환 참조 차단 |
| `T*` / `T&` | 타입 자체로는 소유권 표현 안 함 | 호출 중 객체를 빌려 사용 |

`unique_ptr`는 복사할 수 없고 이동으로 소유권을 넘긴다. `get()`은 빌린 포인터를 반환하며, `release()`는 해제 책임까지 호출자에게 넘기므로 일반 조회에는 쓰지 않는다.

```cpp
#include <cassert>
#include <memory>
#include <utility>

struct Measurement {
    double range = 0.0;
};

int main() {
    auto producer = std::make_unique<Measurement>();
    producer->range = 2.4;
    auto consumer = std::move(producer);
    assert(!producer && consumer->range == 2.4);
}
```

`std::move()` 자체가 데이터를 옮기지는 않는다. 이동 생성자·대입 연산자를 선택할 수 있도록 표현식의 값 범주를 바꾼다. 이동 후 상태는 타입별 계약을 따른다. 위 예제의 이동된 `unique_ptr`는 비어 있지만, 다른 모든 타입도 비어 있다고 가정하면 안 된다.

## 3. 공유 소유와 순환 참조

`shared_ptr` 복사는 같은 객체를 함께 소유한다. 객체의 마지막 공유 소유자가 사라지면 객체가 소멸한다. 두 객체가 서로를 `shared_ptr`로 보관하면 소유자 수가 0이 되지 않을 수 있다. [shared_ptr 수명 규칙](https://eel.is/c++draft/util.smartptr.shared).

```cpp
#include <cassert>
#include <memory>

struct Node {
    std::shared_ptr<Node> child;
    std::weak_ptr<Node> parent;
};

int main() {
    auto root = std::make_shared<Node>();
    auto leaf = std::make_shared<Node>();
    root->child = leaf;
    leaf->parent = root;
    assert(leaf->parent.lock() == root);
    root.reset();
    assert(leaf->parent.expired());
}
```

`weak_ptr::lock()`은 객체가 살아 있으면 `shared_ptr`를, 이미 해제됐으면 빈 포인터를 반환한다. `expired()`를 확인한 뒤 별도로 접근하는 대신 `lock()`의 결과를 사용한다.

참조 카운트가 안전하게 관리되는 것과 **대상 객체의 데이터가 스레드 안전한 것**은 별개다. 공유 데이터의 동시 읽기·쓰기는 mutex 등으로 따로 동기화한다.

## 4. 클래스와 다형성

상속은 공통 인터페이스가 필요한 경우에 사용한다. 단순한 코드 재사용만 필요하면 객체를 멤버로 포함하는 합성도 검토한다.

- 기반 클래스 포인터로 파생 객체를 삭제하는 인터페이스에는 적절한 가상 소멸자가 필요하다.
- 재정의하는 함수에는 `override`를 붙여 시그니처 오류를 검출한다.
- 캡슐화는 getter·setter 개수보다 객체가 유효한 상태를 유지하도록 인터페이스를 제한하는 데 목적이 있다.

## 5. 비동기 콜백 점검

나중에 실행할 콜백은 등록 시점과 실행 시점의 객체 수명이 다르다. 지역 변수의 참조나 `this`를 캡처한 뒤 원본이 먼저 소멸하면 잘못된 메모리에 접근할 수 있다.

작업이 반드시 객체를 유지해야 하면 명시적인 공유 소유를, 객체가 없어지면 작업을 취소해도 되면 `weak_ptr`와 `lock()`을 사용한다. 소유권을 과도하게 늘려 종료가 늦어지는 경우도 함께 확인한다.
