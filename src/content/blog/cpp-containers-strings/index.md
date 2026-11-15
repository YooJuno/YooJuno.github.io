---
title: "[C++] 컨테이너와 문자열"
slug: "cpp-containers-strings"
date: "2026-11-15"
category: "프로그래밍"
tags: [C++, STL, Containers]
summary: "vector·array·map·set 선택과 문자열 처리."
---

컨테이너는 저장 순서, 검색 방식, 크기 변경 여부를 기준으로 고른다. 예제는 C++17 기준이다.

## 1. 컨테이너 선택

| 자료구조 | 특성 | 적합한 작업 |
| --- | --- | --- |
| `std::array<T, N>` | 크기 고정, 연속 메모리 | 고정 차원 좌표·작은 버퍼 |
| `std::vector<T>` | 크기 가변, 연속 메모리 | 프레임·포인트·측정값 목록 |
| `std::map<Key, Value>` | 키 순서 유지, 검색·삽입·삭제 O(log N) | 정렬된 키 순회·범위 검색 |
| `std::unordered_map<Key, Value>` | 해시 기반, 평균 검색 O(1), 최악 O(N) | ID 기반 조회 |
| `std::set<Key>` | 중복 없는 정렬된 키 | 순서가 필요한 집합 |
| `std::unordered_set<Key>` | 중복 없는 해시 집합 | 포함 여부 확인 |

해시 컨테이너의 순회 순서는 정렬 순서가 아니다. 작은 데이터에서는 해시 계산·할당 비용 때문에 `unordered_map`이 항상 빠르지는 않다. 실제 데이터와 접근 패턴으로 판단한다.

## 2. vector의 크기와 용량

`size()`는 현재 원소 수, `capacity()`는 재할당 없이 담을 수 있는 용량이다. `reserve()`는 용량을 확보할 뿐 원소를 만들지 않는다. `resize()`는 실제 원소 수를 바꾼다. [vector 용량 규칙](https://eel.is/c++draft/vector.capacity).

```cpp
#include <cassert>
#include <vector>

int main() {
    std::vector<double> ranges;
    ranges.reserve(100);
    assert(ranges.empty() && ranges.capacity() >= 100);
    ranges.push_back(1.2);
    ranges.resize(3, 0.0);
    assert(ranges.size() == 3 && ranges.at(1) == 0.0);
}
```

`reserve(100)` 다음에 곧바로 `ranges[0]`에 쓰면 안 된다. 아직 원소가 없기 때문이다. `at()`은 범위를 검사해 예외를 던지고, `operator[]`는 범위를 벗어나지 않는다는 전제가 필요하다.

재할당되면 기존 원소를 가리키던 포인터·참조·반복자가 무효화된다. `erase()`는 지운 위치와 그 뒤의 반복자·참조를 무효화한다. 순회하면서 지울 때는 반환된 반복자를 사용한다.

```cpp
#include <cassert>
#include <vector>

int main() {
    std::vector<int> values{2, -1, 4, -3};
    for (auto iterator = values.begin(); iterator != values.end();) {
        if (*iterator < 0) iterator = values.erase(iterator);
        else ++iterator;
    }
    assert((values == std::vector<int>{2, 4}));
}
```

## 3. map의 조회와 삽입

`operator[]`는 없는 키를 조회하면 기본값을 **삽입**한다. 읽기만 하려면 `find()`나 `at()`을 사용한다. C++17에서는 삽입 여부를 `try_emplace()`의 반환값으로 확인할 수 있다.

```cpp
#include <cassert>
#include <string>
#include <unordered_map>

int main() {
    std::unordered_map<std::string, int> counts;
    counts.try_emplace("camera", 2);
    const auto found = counts.find("lidar");
    assert(found == counts.end() && counts.size() == 1);
    assert(counts.at("camera") == 2);
}
```

`unordered_map`도 rehash가 발생하면 반복자가 무효화될 수 있다. 삽입 전에 얻은 반복자를 장기간 보관하는 설계는 주의한다.

## 4. 문자열과 숫자 변환

`std::string`은 바이트열이다. UTF-8 한글의 `size()`는 화면상의 글자 수가 아니라 바이트 수이며, 바이트 인덱스로 자르면 문자 중간이 잘릴 수 있다.

| 작업 | 함수 |
| --- | --- |
| 부분 문자열 | `substr(position, count)` |
| 검색 | `find()`; 실패하면 `std::string::npos` |
| 추가·삭제 | `append()` / `erase()` |
| 정수 → 문자열 | `std::to_string()` |
| 문자열 → 정수 | `std::stoi()` 또는 C++17 `std::from_chars()` |

`stoi("12abc")`는 앞의 숫자만 읽을 수 있다. 전체 입력이 숫자인지 확인하려면 소비한 길이나 `from_chars()`의 종료 포인터까지 검사한다.

```cpp
#include <cassert>
#include <charconv>
#include <string>
#include <system_error>

int main() {
    const std::string text = "2048";
    int count = 0;
    const auto result = std::from_chars(text.data(), text.data() + text.size(), count);
    const bool valid = result.ec == std::errc{} && result.ptr == text.data() + text.size();
    assert(valid && count == 2048);
}
```

`from_chars()`는 예외 대신 오류 코드를 반환하며, 선행 공백을 자동으로 건너뛰지 않는다. 입력 규칙에 따라 공백·부호·범위 초과도 처리한다. [정수 파싱 규칙](https://eel.is/c++draft/charconv.from.chars), [컨테이너 요구사항](https://eel.is/c++draft/container.requirements).
