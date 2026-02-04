---
title: "부팅 디스크 없이 Ubuntu 설치"
date: "2026-02-04"
category: "개발"
tags:
    - Ubuntu
    - Installation
    - Linux

summary: "부팅 디스크 없이 Ubuntu를 설치하는 방법에 대해 설명합니다."
---
# 부팅 디스크 없이 Ubuntu 설치

## 0. Ubuntu iso 파일 다운로드

[Ubuntu Releases](https://mirror.kakao.com/ubuntu-releases/)

## 1. 기존 Ubuntu 삭제 & 새 단순 볼륨 생성

- FAT 볼륨도 삭제해야함
- FAT 포맷으로 파티션 생성

## 2. 새로 만든 볼륨에 iso 안에 있는 파일들 복붙

- 클릭하면 좀 걸림.
- 오픈 하실래요? 뜨면 ‘예’ 누르면 됨.

## 3. 리부팅 해서 BIOS 진입

## 4. BOOT 순서 설정

- **1 → UEFI OS**
- ⇒ **재부팅**

## 5. 리눅스 설치 클릭

## 6. Installation Type

- free space 클릭
- mount point → /

## 7. 새로 생긴 Unknown 클릭

- continue