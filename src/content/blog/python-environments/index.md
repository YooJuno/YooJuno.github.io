---
title: "[Python] 실행 환경과 의존성"
slug: "python-environments"
date: "2026-11-15"
updated: "2026-11-15"
category: "개발 환경·배포"
tags: [Python, venv, Conda]
summary: "인터프리터·pip·venv·Conda 환경 분리와 재현."
---

Python 환경 문제는 실행한 인터프리터와 패키지를 설치한 위치가 다른 경우부터 확인한다. OS가 사용하는 Python은 유지하고 프로젝트별 환경을 분리한다.

## 1. 실행 경로 확인

```bash
python3 --version
python3 -c "import sys; print(sys.executable)"
python3 -m pip --version
```

`pip`만 실행하기보다 `python -m pip` 형태를 사용하면 해당 인터프리터에 연결된 pip를 호출할 수 있다. Ubuntu의 `/usr/bin/python3`를 임의의 다른 버전으로 교체하면 시스템 도구와 패키지 의존성이 깨질 수 있다.

## 2. venv

설치된 Python으로 프로젝트의 패키지 공간을 분리할 때 사용한다. `venv` 자체가 다른 버전의 Python을 내려받는 것은 아니다. [venv 동작](https://docs.python.org/3/library/venv.html).

Linux·macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install numpy
python -m pip freeze > requirements.txt
deactivate
```

Windows PowerShell에서는 환경 생성 후 `.\.venv\Scripts\Activate.ps1`을 사용한다. 실행 정책 때문에 활성화가 막혀도 시스템 전체의 보안 설정을 낮출 필요는 없다. `.\.venv\Scripts\python.exe -m pip ...`처럼 실행 파일을 직접 지정할 수 있다.

새 환경의 복원은 `python -m pip install -r requirements.txt`다. `.venv` 폴더는 Git에 넣지 않고 재생성한다. `freeze` 결과에는 OS·Python 버전에 종속된 패키지가 포함될 수 있어, 다른 플랫폼에서의 설치까지 보장하는 잠금 파일은 아니다.

## 3. Conda

Python 버전과 네이티브 라이브러리를 함께 관리할 때 사용한다. 다음은 Python 3.11 환경 예시이며, 버전은 사용할 패키지의 지원 범위에 맞춘다.

```bash
conda create -n vision-study python=3.11
conda activate vision-study
conda install numpy
conda env list
conda list
conda env export --from-history > environment.yml
conda deactivate
```

복원은 `conda env create -f environment.yml`이다. `--from-history`는 직접 지정한 의존성 중심으로 기록하므로 플랫폼 간 이식에 유리하지만, 전이 의존성까지 정확히 고정하지는 않는다. [Conda 환경 관리](https://docs.conda.io/projects/conda/en/stable/user-guide/tasks/manage-environments.html).

pip 패키지가 필요하면 Conda 의존성을 먼저 설치한 뒤, **활성화된 환경의** `python -m pip`를 사용한다. 패키지 관리자를 번갈아 무작정 업데이트하기보다 환경 파일로 새 환경을 만들어 확인한다.

## 4. 환경별 주의점

| 환경 | 확인 항목 |
| --- | --- |
| Ubuntu·ROS 2 | 배포판 Python·apt 패키지와 가상환경 혼용 여부 |
| Windows | `py -0p`로 설치된 인터프리터 확인, PowerShell과 WSL 구분 |
| Apple Silicon | arm64·x86_64 패키지와 터미널 아키텍처 일치 |
| PyTorch·CUDA | Python·드라이버·프레임워크 지원 조합 |

Apple Silicon의 PyTorch GPU 실행은 CUDA가 아니라 MPS 지원 여부를 확인한다. Conda 사용이나 특정 구버전 Python이 항상 필수인 것은 아니다. 설치 방식은 해당 PyTorch 버전의 안내를 따른다. [PyTorch MPS](https://docs.pytorch.org/docs/stable/notes/mps.html).

Python 2는 지원이 종료된 레거시 환경이다. 필요한 프로젝트는 OS 기본 환경과 분리하고 외부 노출·의존성 위험을 별도로 관리한다.
