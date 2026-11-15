---
title: "[C++] 타입 추론·템플릿·람다"
slug: "cpp-types-templates-lambdas"
date: "2025-03-01"
updated: "2026-11-15"
category: "프로그래밍"
tags: [C++, Templates, Lambda]
summary: "auto·참조·constexpr와 템플릿·람다의 사용 기준."
---

예제는 C++17 기준이다. 타입 추론은 타입을 없애는 기능이 아니라, 초기화 식에서 컴파일러가 타입을 결정하는 규칙이다.

## 1. auto와 참조

| 선언 | 의미 | 사용 예 |
| --- | --- | --- |
| `auto value = original` | 보통 값으로 복사 | 독립적으로 수정할 값 |
| `auto& value = original` | 원본의 참조 | 원소를 직접 수정 |
| `const auto& value = original` | 읽기 전용 참조 | 큰 객체를 복사 없이 조회 |

일반적인 `auto` 값 선언은 참조와 최상위 `const`를 유지하지 않는다. `const`·참조가 필요하면 선언에 명시한다. `decltype(expression)`은 표현식의 타입을 구하며, 괄호를 붙인 lvalue 표현식은 참조 타입이 될 수 있다. [C++ 타입 추론 규칙](https://eel.is/c++draft/dcl.spec.auto).

```cpp
#include <cassert>
#include <type_traits>

int main() {
    const int original = 7;
    auto copied = original;
    const auto& borrowed = original;
    copied = 12;
    static_assert(std::is_same_v<decltype(copied), int>);
    static_assert(std::is_same_v<decltype(borrowed), const int&>);
    assert(original == 7 && borrowed == 7 && copied == 12);
}
```

범위 기반 반복문도 같은 원칙이다. `for (auto value : values)`는 복사하고, `auto&`는 원소를 수정하며, `const auto&`는 읽기만 한다. 작은 정수는 값 복사가 자연스럽고, 큰 구조체·문자열은 참조가 유리하다.

## 2. constexpr

`constexpr` 함수는 조건이 맞으면 컴파일 시간 계산에 사용할 수 있다. **호출할 때마다 컴파일 시간에 실행된다는 의미는 아니다.** 런타임 입력으로도 호출할 수 있다.

```cpp
#include <cassert>

constexpr int squared(int value) {
    return value * value;
}

int main() {
    static_assert(squared(6) == 36);
    int runtime_input = 8;
    assert(squared(runtime_input) == 64);
}
```

크기·차원처럼 컴파일 시간에 필요한 값과, 센서 측정처럼 실행 중 들어오는 값을 구분한다. 큰 정수의 제곱은 범위를 넘을 수 있으므로 타입과 입력 범위도 정해야 한다.

## 3. 템플릿과 타입 별칭

템플릿은 타입 등에 따라 함수·클래스를 구체화하는 방식이다. 코드가 모든 타입에 유효해지는 것은 아니다. 아래 함수는 두 값을 `operator<`로 비교하고 복사할 수 있어야 한다.

```cpp
#include <cassert>
#include <string>
#include <vector>

template <typename Value>
Value larger(Value first, Value second) {
    return first < second ? second : first;
}

using Labels = std::vector<std::string>;

int main() {
    Labels names{"camera", "lidar"};
    assert(larger(3, 8) == 8);
    assert(names.size() == 2);
}
```

타입 별칭 `using`은 이름을 붙이는 문법이다. 새로운 독립 타입을 만들지는 않는다. 템플릿은 정의가 호출 측에 보여야 하는 경우가 많아 보통 헤더에 작성한다.

## 4. 람다와 캡처

람다는 함수 객체를 간단히 정의하는 표현식이다. 캡처 목록은 바깥 변수의 사용 방식, 매개변수는 호출할 때 받는 입력을 정한다.

```cpp
#include <algorithm>
#include <cassert>
#include <vector>

int main() {
    std::vector<int> scores{4, 9, 2};
    int threshold = 5;
    const auto accepted = std::count_if(scores.begin(), scores.end(),
        [threshold](int score) { return score >= threshold; });
    std::sort(scores.begin(), scores.end(),
        [](int first, int second) { return first > second; });
    assert(accepted == 1 && scores.front() == 9);
}
```

| 캡처 | 의미 | 주의점 |
| --- | --- | --- |
| `[threshold]` | 지정한 값을 복사 | 생성 시점의 값 |
| `[&threshold]` | 지정한 변수를 참조 | 원본 수명이 더 길어야 함 |
| `[=]` / `[&]` | 사용한 외부 변수를 기본적으로 복사 / 참조 | 비동기 콜백에서는 의존성이 흐려짐 |

함수 밖으로 반환하거나 나중에 실행할 람다에서 지역 변수를 참조로 캡처하면 수명 문제가 생길 수 있다. `this` 캡처도 객체 수명을 연장하지 않는다. 비동기 작업은 필요한 값과 소유권을 명시한다. [람다 캡처 지침](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#f53-avoid-capturing-by-reference-in-lambdas-that-will-be-used-non-locally).

## 관련 글

- [컨테이너와 문자열](/blog/cpp-containers-strings)
- [객체 수명과 스마트 포인터](/blog/cpp-memory-ownership)
