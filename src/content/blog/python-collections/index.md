---
title: "[Python] 자료구조와 복사·정렬"
slug: "python-collections"
date: "2026-11-15"
category: "프로그래밍"
tags: [Python, Collections, Algorithms]
summary: "list·dict·set·deque·heapq와 얕은 복사·깊은 복사."
---

Python 3.11 이상에서 사용할 수 있는 예제다. 데이터의 순서·중복·조회 방식에 따라 자료구조를 선택한다.

## 1. 자료구조 선택

| 타입 | 특성 | 대표 용도 |
| --- | --- | --- |
| `list` | 순서가 있는 가변 시퀀스 | 목록·스택 |
| `tuple` | 원소 참조를 변경할 수 없는 시퀀스 | 고정된 묶음 |
| `dict` | 키 → 값, 삽입 순서 유지 | ID 조회·개수 집계 |
| `set` | 중복 없는 집합, 순서 보장 없음 | 포함 확인·교집합 |
| `collections.deque` | 양끝 삽입·삭제에 적합 | 큐·슬라이딩 버퍼 |
| `heapq` | 최소 원소를 빠르게 꺼내는 힙 연산 | 우선순위 큐 |

빈 집합은 `{}`가 아니라 `set()`이다. `{}`는 빈 딕셔너리다. `tuple` 안에 가변 객체가 들어 있으면 그 내부 객체까지 불변이 되지는 않는다. [자료구조 기본 동작](https://docs.python.org/3/tutorial/datastructures.html).

## 2. 대입·얕은 복사·깊은 복사

`copied = original`은 복사가 아니라 같은 객체에 이름을 하나 더 붙이는 대입이다. `list.copy()`와 슬라이스는 바깥 리스트만 복사한다. 내부 가변 객체까지 분리하려면 `deepcopy()`를 검토한다. [copy 모듈](https://docs.python.org/3/library/copy.html).

```python
from copy import deepcopy

original = [[1, 2], [3, 4]]
assigned = original
shallow = original.copy()
deep = deepcopy(original)

shallow[0].append(9)
assert assigned is original
assert shallow is not original
assert original[0] == [1, 2, 9]
assert deep[0] == [1, 2]
```

깊은 복사는 비용이 들고, 의도적으로 공유한 객체까지 복제할 수 있다. 필요한 구조만 새로 만드는 편이 적절한 경우도 많다.

## 3. 조회와 정렬

`list.index(value)`는 주어진 값의 첫 위치를 찾는다. 최대값 위치가 필요하면 `max()`로 값을 구한 뒤 찾거나, 인덱스를 기준으로 최대값을 구한다. 빈 리스트는 별도로 처리한다.

```python
scores = [5, 3, 8, 8]
best_index = max(range(len(scores)), key=scores.__getitem__)
assert best_index == 2

records = [("camera", 3), ("imu", 1), ("lidar", 3)]
ordered = sorted(records, key=lambda record: (-record[1], record[0]))
assert ordered == [("camera", 3), ("lidar", 3), ("imu", 1)]
assert records[0] == ("camera", 3)
```

`sorted()`는 새 리스트를 만들고, `list.sort()`는 원본을 바꾸며 `None`을 반환한다. Python 정렬은 안정 정렬이지만, `set`에서 시작한 데이터의 동일 키 순서까지 일정해지는 것은 아니다.

`dict` 조회는 보통 해시 기반 평균 O(1)이며, 리스트 포함 검색은 O(N)이다. 딕셔너리가 항상 빠른 것이 아니라 데이터 크기·해시 비용·필요한 순서에 따라 선택한다.

## 4. 큐와 최소 힙

리스트 앞에서 `pop(0)`을 반복하면 뒤의 원소를 계속 옮긴다. 큐는 `deque.popleft()`를 사용한다. [deque](https://docs.python.org/3.13/library/collections.html#collections.deque).

```python
from collections import deque
import heapq

queue = deque(["scan", "filter"])
queue.append("publish")
assert queue.popleft() == "scan"

priorities = [7, 2, 5]
heapq.heapify(priorities)
assert heapq.heappop(priorities) == 2
assert priorities[0] == 5
```

최소 힙에서는 부모가 자식보다 **작거나 같고**, 루트가 최소값이다. 힙 배열 전체가 정렬된 것은 아니다. 위 코드는 최소 힙 API를 사용한다. Python 3.14 이상에는 공개 최대 힙 API도 있으므로 사용 버전을 확인한다. [heapq](https://docs.python.org/3/library/heapq.html).

## 5. 문자열·zip·집합

```python
filename = "scan_001.bin"
assert filename.startswith("scan_") and filename.endswith(".bin")

names = ["camera", "lidar"]
ports = [5000, 6000]
mapping = dict(zip(names, ports, strict=True))
assert mapping["lidar"] == 6000
assert {"camera", "imu"} & {"imu", "lidar"} == {"imu"}
```

문자열 값 비교는 `==`이며 `is`는 객체 동일성 검사다. `zip()`은 기본적으로 짧은 입력에 맞춰 끝난다. 길이가 같아야 하는 데이터에는 Python 3.10 이상의 `strict=True`를 사용해 누락을 검출한다.

## 관련 글

[Python 실행 환경과 의존성](/blog/python-environments)에서는 인터프리터·pip·가상환경을 구분한다.
