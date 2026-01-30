---
title: "SLAM, Where Am I"
date: "2024-08-30"
category: "??"
tags:
  - SLAM
  - Localization
  - Mapping
  - Robotics
  - Computer Vision
summary: "SLAM? ⇒ Where Am I? SLAM의 기본 개념과 동작 원리, Visual SLAM과 LiDAR SLAM의 차이점에 대해 알아봅니다."
---

# SLAM? ⇒ Where Am I?

| 일시 | 2024년 8월 30일 14:00 |
| --- | --- |
| 발표자 | 개발 1팀 인턴 유준호 |

# Simultaneous Localization And Mapping

**[Navigation]**

길을 잃었을 때 사람들은 네비게이션을 사용한다. GPS로 찾은 나의 위치로부터 도착 지점까지 네비게이션이 안내한다. 그런데, GPS는 비교적 약 5~10m 정도의 오차 범위를 가지며 상황에 따라 더욱 커질 수도 있다. 이로 인해 정확한 위치 추정을 필요로 하는 분야에서의 GPS 사용은 위험해 보인다. 또 다른 위치 추정 방식인 SLAM은 GPS보다 작은 오차 범위를 가지며, 그 오차 범위를 지속적으로 줄여나가 정확한 위치 추정을 하는 데에 목적을 두는 알고리즘이다.

![](SLAM%20%E2%87%92%20Where%20Am%20I/image.png)

**[So, where am i?]**

나의 위치를 정의하는 것은 얼핏 보면 쉬워 보이지만 실은 상당히 어려운 문제다. 절대적인 위치의 개념은 없으며 우리는 모두 상대적으로 정의되는 위치 개념을 사용하고 있기 때문이다. 또한 “나”의 위치는 지속적으로 변화하고 있다. 그 중 굳이 절대적인 위치 한 곳을 꼽으라면, 본인은 태어난 병원을 그 위치로 정하고 싶다. 그 절대적인 시작 지점으로부터 우리는 상대적인 위치 속에서 살아간다고 생각하기 때문이다. 아래에 나오는 SLAM의 동작 방식 또한 비슷하다.

[상대적 위치]

![](SLAM%20%E2%87%92%20Where%20Am%20I/image_1.png)

[수리적 위치 이지만 전 우주적으로 바라봤을 때는…]

![](SLAM%20%E2%87%92%20Where%20Am%20I/image_2.png)

### 실제 적용 사례

### 1. 자동차

[https://www.youtube.com/watch?v=CRKyXmlUOl0](https://www.youtube.com/watch?v=CRKyXmlUOl0)

### 2. 드론

![](SLAM%20%E2%87%92%20Where%20Am%20I/image_3.png)

### 3. 로봇 청소기

![](SLAM%20%E2%87%92%20Where%20Am%20I/image_4.png)

### 4. 물류, 서빙 로봇

**등 자율형 이동체에서 사용되고 있음**

### SLAM 을 사람에게 적용해보자면…

어느 날 자고 일어났더니 내 방이 아닌 미국의 어느 한 마을에서 눈을 뜨게 됐다. 이 순간 우리는 **“1) 여기는 어디인가”** 라는 질문과 함께 마을을 둘러볼 것이다. 내가 깨어난 지점으로부터 다녀온 길에 대해 상대적인 위치 감각이 생기게 되고 나름의 마을 **“2) 지도가 머릿속에 생성”**된다. 정처 없이 떠돌다가 **“3) 이전에 지나쳤던 곳으로 돌아오게 되면서 막연했던 머릿속 지도의 범위와 크기가 보다 더욱 견고해졌다.”** 꿈이었음을 깨달으며 잠에서 깨고, 다음 날 똑같은 장소에서 일어난다. **“4) 전 날에 와봤던 곳이기 때문에 금방 내가 어디에 있는지 알아차린다.”**

![](SLAM%20%E2%87%92%20Where%20Am%20I/image_5.png)

- **1)** 현재 위치가 어디인지 판별하는 **Localization**을 의미.
- **2)** 현재 들어오는 Input을 이용하여 실시간으로 지도를 생성하는 **Local Mapping**
- **3)** 이전에 Mapping한 곳을 다시 방문함으로써 상대적으로 뻗어나갔던 지도의 오차를 줄여주는 **Loop Cloing**.
- **4)** 이전에 생성한 지도를 참고하여 현재 자신의 위치를 지도 안에서 찾는 **Relocalization**

**[실제 SLAM이 위의 과정을 진행하는 Pipeline]**

![](SLAM%20%E2%87%92%20Where%20Am%20I/image_6.png)

⇒ **즉!** SLAM은 자신이 어디에 있는지 끊임 없이 추정함과 동시에 주변 3차원 정보를 지도로 만들어 다시 방문했을 때 빠르게 위치를 파악할 수 있도록 한다. 사전에 만들어둔 지도가 있다면 이를 사용하여 위치를 추정(**Relocalization**)하지만 없다면 처음부터 만들어 나간다. 불러온 지도에 현재 입력을 추가하여 보완할 수도 있다. 입력 데이터의 종류에 따라 이름과 동작 방식에 차이를 보이며, 크게 **Visual SLAM**과 **LiDAR SLAM**으로 나뉜다.

# Visual SLAM

### 영상 정보를 활용하는 SLAM

[https://youtu.be/DYQ9vp29D84?si=bgMvpdxRGo-uTJWC&t=22](https://youtu.be/DYQ9vp29D84?si=bgMvpdxRGo-uTJWC&t=22)

## Visual SLAM 종류

카메라의 종류에 따라 달라진다

- **Monocular** : 1개의 단안 카메라
- **Stereo** : 2개의 각도가 고정된 카메라(우리 눈과 비슷하다)
- **RGB-D** : Depth 정보를 알 수 있는 카메라

Monocular를 제외한 두 방식은 한 번의 입력으로 깊이 정보를 알 수 있다. 이와는 달리 Monocular는 연속으로 들어오는 이미지들의 관계를 이용하여 깊이 정보를 알아낼 수 있다. 아래에서 살펴볼 SLAM은 Monocular SLAM에 대한 내용이다.

## 이미지 만으로 3차원 정보를 얻는 것이 어떻게 가능한가?

### [Image Projection]

2D 세계인 이미지와 3D 세계인 실제 세계와의 관계를 설명한다. 즉 아래의 성분들을 안다면 2D ↔︎ 3D 변환이 가능하다.

![](SLAM%20%E2%87%92%20Where%20Am%20I/image_7.png)

**A : Intrinsic Parameters**

**R : Rotation**

**t : translation**

**x , y (좌항)** : 이미지 플레인 상에 투영된, 3차원 점의 2차원 좌표

**X, Y, Z (우항):** 3차원 점의 좌표

### **1. Intrinsic Parameters**

- 카메라 렌즈 **내부 정보**를 의미함
- 카메라 렌즈의 왜곡을 보정하는데에 사용됨
1. **fx, fy : 초점거리(focal length)**
    - 렌즈의 중심으로부터 이미지 센서까지의 거리
    
    ![](SLAM%20%E2%87%92%20Where%20Am%20I/image_8.png)
    

1. **cx, cy : 주점(principal point)**
    - 카메라 렌즈의 중심 즉, 핀홀에서 이미지 센서에 내린 수선의 발의 픽셀좌표.
2. **skew_c : 비대칭계수(skew coefficient)**
    - 이미지 센서의 cell array의 y축이 기울어진 정도
    - 요즘은 공정 기술이 좋아져서 대부분 0의 값을 가짐.
    
    ![](SLAM%20%E2%87%92%20Where%20Am%20I/image_9.png)
    
    image.png
    

**Intrinsic Parameters 구하는 방법.**

![](SLAM%20%E2%87%92%20Where%20Am%20I/image_10.png)

- Camera Calibration Tool, OpenCV 등 Camera Intrinsic Parameters를 구해주는 프로그램에 다양한 각도에서 찍힌 checkerboard 사진을 입력하여 알아낼 수 있다.

![](SLAM%20%E2%87%92%20Where%20Am%20I/image_11.png)

[출처] https://darkpgmr.tistory.com/32

### 2. Extrinsic Parameters

- 3차원 상에서 카메라의 회전, 이동 정보
- 초기 값은 0(혹은 단위행렬)으로 설정되며, 초기 정보에 대한 현재의 상대적인 회전, 평행 이동 정보를 갖게 된다.

### **SLAM의 목적 중 하나는 카메라의 위치와 자세를 추정하는 것.**

**즉 Extrinsic Parameters를 알아내기 위해서는 세 가지 성분이 필요하다.**

- Camera Intrinsic Parameters ⇒ 위의 체커보드로 알아낼 수 있음.
- 2D point ⇒ 이미지 상의 점의 좌표로 확인 가능
- **3D point⇒ 이미지들 간의 유사함을 이용하여 상대적인 위치를 추정해나감(Tracking).**

### [Triangulation]

서로 다른 시점에서 점 P를 바라보는 매칭쌍의 관계를 이용하여 점 P의 3차원 위치 정보를 알아낸다.

![](SLAM%20%E2%87%92%20Where%20Am%20I/image_12.png)

- 이 때 이미지 상의 점 p1, p2는 Feature Extraction으로 획득하며, Feature Matching을 통해 이 두 점이 같은 같은 Feature임을 알 수 있다.
- 이 과정을 다 수 반복하여 다수의 3차원 점을 획득한다.

### [Feature Point]

Computer Vision에서는 특징이 가지는 픽셀을 표현하고 있음.

- **Feature Extraction**
    
    이미지 상에서 특징을 보이는 픽셀을 추출하는 과정이다. 가로등의 꼭지점, 책상의 모서리 등 픽셀 주변의 밝기 변화가 급격하게 나타나는 곳을 Feature라 판단하여 추출한다. Feature는 **Descriptor** 값을 갖고 있으며, Descriptor를 통해 Feature의 구분 및 분류가 가능하다. 추출하는 방식은 다양하며 대표적으로 **ORB, SIFT** 추출 방식이 존재한다.
    
    ![](SLAM%20%E2%87%92%20Where%20Am%20I/image_13.png)
    
    - **SIFT** : 이미지 피라미드를 이용하여 특징점의 크기 변화에도 추출이 용이함.
    - **ORB** : 속도에 중점을 두는 알고리즘으로 비교적 빠른 추출 속도를 보임.
    - **Bag of words**
        
        추출한 Feature들을 군집화 “**bag**” 안에 분류되어 저장됨. 저장된 Feature는 추후에 SLAM 전반에서 사용됨. 일종의 Database라고 이해하면 쉽다.
        
- **Feature Matching**
    
    추출한 이미지의 Feature를 사용하여 이미지 간의 동일한 Feature를 검출해낸다. Feature는 다른 각도에서 보여도 그 고유함을 잃지 않기 때문에 이미지들 간의 위치 변화로 현재 위치를 추정하는 SLAM에서 빼놓을 수 없는 기술이다.
    
    ![](SLAM%20%E2%87%92%20Where%20Am%20I/image_14.png)
    
    - 위의 사진처럼 Feature 쌍을 추출하여 Triangulation을 거쳐 점 P의 좌표를 얻어낼 수 있다.

이 처럼 **feature**를 추출하여 사용하는 SLAM을 **feature-based SLAM**이라 한다. 이와는 다르게 영상에서 feature를 추출하지 않고 Pixel정보를 그대로 사용하는 방식을 **Direct SLAM**이라 한다. ORB feature를 사용하는 ORB-SLAM은 feature-base SLAM 방식이며 아래에서는 ORB-SLAM에 대해 더 자세히 다룰 예정이다.

![](SLAM%20%E2%87%92%20Where%20Am%20I/image_15.png)

[https://youtu.be/GnuQzP3gty4?si=UZGX4CCgn8pb8-_x&t=134](https://youtu.be/GnuQzP3gty4?si=UZGX4CCgn8pb8-_x&t=134)

[출처]
https://bkshin.tistory.com/entry/OpenCV-27-특징-디스크립터-검출기-SIFT-SURF-ORB

https://searching-fundamental.tistory.com/63

https://blog.naver.com/dnjswns2280/222086846193

https://jaehoon-daddy.tistory.com/42

### [Perspective n Points ⇒ SolvePnP()]

**Triangulation**을 통해 알아낸 다수의 3차원 점을 사용하여 3차원 공간에서 카메라의 위치, 자세 성분을 알아낼 수 있다.

![](SLAM%20%E2%87%92%20Where%20Am%20I/image_16.png)

- 주어진 3D 점들과 이들의 2D 이미지 상의 대응점을 기반으로 초기 카메라의 회전과 위치를 추정
- 이 과정은 **“PnP를 푼다”** 라고 불린다 (OpenCV 함수 중 이를 담당하는 **SolvePnP()** 존재)
- SLAM 초기에 **Initial Pose Estimation** 과정에서 입력으로 들어오는 이미지에 대해 사용된다.

[출처]

https://jaehoon-daddy.tistory.com/48

### [**Bundle Adjustment]**

초기 위치, 자세 추정이 끝났다면 이 후에 들어오는 전체 이미지에 대한 위치, 자세를 최적화 하여 오차를 수정해야한다. SLAM 에서는 **BA** 방식을 사용하여 3D Point들의 오차와 Camera Parameter의 오차를 줄여나가 위치 및 자세를 최적화 한다.

![](SLAM%20%E2%87%92%20Where%20Am%20I/image_17.png)

## SLAM Pipeline

아래 예시는 ORB feature를 사용하는 ORB-SLAM에 대한 내용임.

### **Tracking,** **Local Mapping**, **Loop Closing 세 개의 쓰레드로 구성**

![](SLAM%20%E2%87%92%20Where%20Am%20I/image_6%201.png)

[출처] https://www.researchgate.net/figure/ORB-SLAM-system-overview-showing-all-the-steps-performed-by-the-tracking-local-mapping_fig1_271823237

### 1. Tracking

영상에서 특징점을 추출하여 Key frame을 생성하고, 카메라의 위치, 자세를 추정하는 과정

**1. Key frame 추출**

- 입력으로 들어오는 모든 frame을 사용하는 것이 아닌, 지도 생성에 유의미한 frame만을 **선별하여** 사용하는데, 이 때 사용되는 frame을 **Key frame**이라 한다.
- Key frame을 추출하는 이유
    
    일반 카메라의 경우 대부분 30fps의 frame rate(1초에 30장)로 영상을 촬영한다. 1초 동안 30장, 1분 동안 1800장, 10분 동안 18000장의 이미지를 입력 받게 되는 것이다. 모든 이미지의 정보를 사용하면 더 좋은 Map을 만들 수 있겠지만, 실제로는 연산량이 과도하게 많아져 실시간성을 보장하지 못하게 된다. 또한 Noise가 있는 이미지가 입력으로 들어오는 경우 결과에 악영향을 미치기도 한다. 이러한 이유로 Key frame을 선별하여 Map을 생성한다.
    

**2. Pose Estimation**

- 이전 frame과 현재 frame의 관계를 이용하여 현재 frame의 위치를 추정
- **Tracking Loss**?
    - 이미지의 급격한 변화로 이전 frame과 현재 frame간의 공통점이 없어 위치 추정이 불가능한 상황을 의미함.
    - 이 때에는 **Global Relocalization**을 수행하여 전체 Map에서의 위치를 다시 탐색, Tracking과정을 회복.

[출처] https://www.youtube.com/watch?v=7yH9sQx4trI&list=PLoJdZ7VvEiRNUxlIXlgy7Fh8ziyt4Hw50&index=5&t=69s

[https://youtu.be/CEC5UwPV9gY?si=71fVsdjoCI_4H7B_&t=372](https://youtu.be/CEC5UwPV9gY?si=71fVsdjoCI_4H7B_&t=372)

### 2. Local Mapping

Map에 대해 중복되는 Key frame과 Tracking 후의 point들을 최적화 하는 쓰레드.

⇒ 생성 중인 Map을 최적화 하는 단계.

1. **Key frame 입력**
    - Tracking 과정에서 생성된 Key Frame을 입력으로 받는다.
2. **Map point 선별**
    - Tracking 후에 생긴 Map Point와 삽입된 Key Frame을 비교하여 Bad points 제거
        - Bad point? : 흐릿하거나 Tracking에 도움이 되지 못하는 점을 의미
3. **새로운 Map point 생성**
    - 현재 입력 frame과 겹치는 부분이 있는 프레임들을 탐색
    - 두 frame에서 찾은 Map Point 쌍을 사용하여 Triangulation 진행
4. **Local Bundle Adjustment (Local BA)**
    - Triangulation 과정 후 생긴 Map Point 중 Mapping 과정에서 필요하지 않는 Point를 제거한다.
5. **Key frame 선별**
    - 기존의 Key frame들과 유사하지 않은 Key frame은 제거한다.

**⇒ 이 과정을 통해 Map 생성에 유의미한 Key frame만을 선별하고 Map의 error를 줄여나갈 수 있다.**

[출처] https://www.youtube.com/watch?v=KEKtvMgrDhE&list=PLoJdZ7VvEiRNUxlIXlgy7Fh8ziyt4Hw50&index=6

### 3. Loop Closing

현재 입력으로 들어오는 이미지에 대한 공간이 이전에 방문했던 곳인지 **Place recognition**으로 ****판별. 맞다면 현재 Map과 이전에 만들어둔 Map을 통합하는 쓰레드.

- **Place recognition?**
    
    **Visual vocabulary**를 사용하여 Key frame에 대한 이미지의 특징을 표현하고, 이를 **Recognition Database**와 비교하여 동일 장소인지 판단.
    
    - **Visual vocabulary** : 이미지의 특징을 표현한 Data(**Bag of words** 방법 중 하나)
    - **Recognition Database** : Visual vocabulary를 저장하는 DB

**⇒ Loop Closing을 통해 Map 생성 시에 누적되었던 오차를 줄일 수 있다.**

[https://youtu.be/pRB5YoNmsb0?si=E-h33BORQeR-v7sj&t=195](https://youtu.be/pRB5YoNmsb0?si=E-h33BORQeR-v7sj&t=195)

[https://youtu.be/5zQJG2tFnDs?si=v084hugRC9VO75Sy&t=40](https://youtu.be/5zQJG2tFnDs?si=v084hugRC9VO75Sy&t=40)

- 빨간색 점 : 현재 입력 이미지에서 뽑힌 Feature Point중 Map의 Point와 같은 점들
- 초록색(or 파란색) : 카메라의 경로를 나타내며 정확히는 Key frame의 위치다.
- 하얀색 점(or 검은색) : Map에 저장된 Map point들

[출처] https://www.youtube.com/watch?v=kupF_cQNgZ4&list=PLoJdZ7VvEiRNUxlIXlgy7Fh8ziyt4Hw50&index=7

## Visual SLAM 총 정리

- SLAM은 입력으로 들어오는 데이터를 사용하여 실시간으로 Map을 생성하고 위치를 추정한다.
- 이전의 입력과 현재 입력을 비교하여 상대적인 현재 위치를 추정한다. 현재 위치를 잃어버리면 Global relocalization을 통해 현재 위치를 지도에서 찾는다.
- 지도는 Key Frame을 선별하여 생성한다. 생성한 지도는 저장했다가 다시 불러올 수 있다.
- 이전에 방문 했던 곳을 재 방문 했을 때는 Loop Closing이 일어나며 누적된 Map의 오차를 수정한다.

# SfM과의 비교

## What is SfM?

### SfM : Structure from Motion

- SfM은 실제 세계의 객체를 가상의 3차원 공간으로 재구성하는 것이 목적이다.
- 다수의 Image에서 추출한 Feature들의 유사도를 이용하여 Point Cloud를 생성하는 것은 Visual SLAM과 비슷하나 큰 차이점들을 보인다.

|  | 입력 방식 | Real time | 주 목적 |
| --- | --- | --- | --- |
| SfM | 한 번에 입력 | X | 사실적인 3D 재구성 |
| Visual SLAM | 한 장씩 입력 | O | 카메라 위치 추정 및 지도 생성 |

![](SLAM%20%E2%87%92%20Where%20Am%20I/image_18.png)

![](SLAM%20%E2%87%92%20Where%20Am%20I/image_19.png)

**[블랙박스 영상을 활용한 봇들교 3D 복원물]**

![](SLAM%20%E2%87%92%20Where%20Am%20I/image_20.png)

![](SLAM%20%E2%87%92%20Where%20Am%20I/image_21.png)

# LiDAR SLAM

### LiDAR 센서 정보를 입력으로 사용

![](SLAM%20%E2%87%92%20Where%20Am%20I/a77d17f5-a60a-4ba4-9a3a-44af62b32bf8.png)

사진 : 벨로다인 제조사의 라이다 센서

사진 : 벨로다인 제조사의 라이다 센서

**LiDAR(Light Detection And Ranging) 설명**

- 대상물에 빛을 비추고 돌아오는 소요 시간을 측정하여 거리를 계산.
- 센서를 360도 회전 시켜 3차원 거리 정보를 얻어내는 것이 보통의 **LiDAR** 사용 방식.
- 채널 수에 따라 가격이 달라지며 기본 100만원 선에서 비싼 제품은 1000만원을 쉽게 넘어간다.
    - 채널 수가 높을 수록 더욱 촘촘한 3차원 정보를 얻을 수 있다.

## LiDAR 센서를 이용한 SLAM

![](SLAM%20%E2%87%92%20Where%20Am%20I/image_22.png)

image.png

![](SLAM%20%E2%87%92%20Where%20Am%20I/image_23.png)

image.png

![](SLAM%20%E2%87%92%20Where%20Am%20I/image_24.png)

image.png

- Visual SLAM보다 훨씬 적은 연산으로 구현이 가능하다.
- 더욱 정확한 Pose Estimation이 가능하다.