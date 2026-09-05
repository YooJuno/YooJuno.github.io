import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useReveal from '../hooks/useReveal'
import useDocumentTitle from '../hooks/useDocumentTitle'
import '../styles/pages/portfolio.css'

// id 문자열을 CSS 선택자로 조합하지 않고 조회한다.
// querySelector(`#${id}`)는 CSS 식별자로 유효하지 않은 값(예: 숫자로 시작하는 "1")에서
// DOMException을 던지고, 이 예외가 useEffect 안에서 발생하면 앱 전체가 언마운트된다.
const findInContainer = (container, id) => {
  if (!container || !id) return null
  const target = document.getElementById(id)
  return target && container.contains(target) ? target : null
}

function Portfolio() {
  const containerRef = useRef(null)
  const location = useLocation()
  const [lightbox, setLightbox] = useState(null)
  const [activeProjectId, setActiveProjectId] = useState('')
  const [activeSectionId, setActiveSectionId] = useState('')
  useReveal()
  useDocumentTitle()
  const getIndexClass = (id) => (
    activeProjectId === id ? 'index-link is-active' : 'index-link'
  )

  const getSectionClass = (id) => (
    activeSectionId === id ? 'index-link is-active' : 'index-link'
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const focusDetail = (target) => {
      if (!target || target.tagName.toLowerCase() !== 'details') return
      target.setAttribute('open', '')
      target.classList.add('is-focus')
      setActiveProjectId(target.id)
      window.setTimeout(() => target.classList.remove('is-focus'), 1200)
    }

    const handleClick = (event) => {
      const image = event.target.closest('.media-tile img')
      if (image) {
        event.preventDefault()
        const src = image.currentSrc || image.src
        if (!src) return
        setLightbox({
          src,
          alt: image.alt || '프로젝트 이미지',
          hasAlt: Boolean(image.alt),
        })
        return
      }
      const link = event.target.closest('a[href^="#"]')
      if (!link) return
      const href = link.getAttribute('href')
      if (!href || href.length < 2) return
      const target = findInContainer(container, href.slice(1))
      if (!target) return
      event.preventDefault()
      focusDetail(target)
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    container.addEventListener('click', handleClick)
    return () => {
      container.removeEventListener('click', handleClick)
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    const targets = Array.from(
      container.querySelectorAll(
        '#about, #project-library, #skills, #experience, #activities, #contact'
      )
    )
    if (!targets.length) return undefined

    if (typeof IntersectionObserver === 'undefined') {
      setActiveSectionId(targets[0].id)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length) {
          setActiveSectionId(visible[0].target.id)
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.1, 0.3, 0.6] }
    )

    targets.forEach((target) => observer.observe(target))

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    const items = Array.from(
      container.querySelectorAll('#project-library .project-detail')
    )
    if (!items.length) return undefined
    setActiveProjectId(items[0].id)

    if (typeof IntersectionObserver === 'undefined') {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length) {
          setActiveProjectId(visible[0].target.id)
        }
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: [0.1, 0.35, 0.6] }
    )

    items.forEach((item) => observer.observe(item))
    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!lightbox) return undefined
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setLightbox(null)
      }
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = prevOverflow
    }
  }, [lightbox])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const section = params.get('section')
    if (!section) return
    const container = containerRef.current
    if (!container) return
    const target = findInContainer(container, section)
    if (!target) return
    if (target.tagName.toLowerCase() === 'details') {
      target.setAttribute('open', '')
      setActiveProjectId(target.id)
    }
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [location.search])

  return (
    <div ref={containerRef}>
      <header className="site-hero portfolio-hero" id="top">


                <div className="container hero-grid">
                  <div className="hero-text" data-reveal>
                    <p className="eyebrow">Portfolio</p>
                    <h1>유준호</h1>
                    <p className="lead">로보틱스 · 컴퓨터 비전 · 임베디드</p>
                    <div className="hero-actions">
                      <a className="btn primary" href="#project-library">프로젝트 보기</a>
                      <a className="btn ghost" href="#contact">연락하기</a>
                    </div>
                  </div>

                  <div className="hero-panel" data-reveal>
                    <div className="panel-card">
                      <h2>주요 경험</h2>
                      <ul>
                        <li>ROS2 자율주행 로봇</li>
                        <li>영상 기반 측정 알고리즘</li>
                        <li>임베디드·웹 실시간 통신</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </header>

              <main className="portfolio-main">
                <aside className="portfolio-index" data-reveal>
                  <h3>목차</h3>
                  <nav className="index-group">
                    <a className={getSectionClass("about")} href="#about">소개</a>
                    <a className={getSectionClass("project-library")} href="#project-library">프로젝트</a>
                    <a className={getSectionClass("skills")} href="#skills">기술 스택</a>
                    <a className={getSectionClass("experience")} href="#experience">경험</a>
                    <a className={getSectionClass("activities")} href="#activities">활동</a>
                    <a className={getSectionClass("contact")} href="#contact">연락</a>
                  </nav>
                </aside>
                <section className="section" id="about">
                  <div className="container about-grid" data-reveal>
                    <div>
                      <div className="section-head">
                        <h2>소개</h2>
                        <p>로보틱스와 컴퓨터 비전을 중심으로 개발합니다.</p>
                      </div>
                      <p className="body">
                        연구실, 인턴십, 팀 프로젝트에서 SLAM, 객체 인식, 경로 계획,
                        센서·서버 통신을 구현했습니다.
                      </p>
                    </div>
                    <div className="about-card">
                      <h3>기본 정보</h3>
                      <ul className="info-list">
                        <li><span>학력</span> 한동대학교 AI 컴퓨터공학 심화 (2018.02-2024.08)</li>
                        <li><span>교육</span> SSAFY 임베디드 로봇 트랙 (2025.01-2025.10)</li>
                        <li><span>언어</span> OPIc IM1 (2025.03)</li>
                        <li><span>자격</span> 1종보통운전면허 (2020.10)</li>
                        <li><span>병역</span> 육군 병장 만기전역 (2019.01-2020.08)</li>
                      </ul>
                      <div className="about-links">
                        <a className="btn ghost" href="https://drive.google.com/file/d/1TZL7Uzh63LOdcYgKJznvCYh8l3yT4oa0/view?usp=drive_link" target="_blank" rel="noreferrer">포트폴리오 PDF</a>
                        <a className="btn ghost" href="https://drive.google.com/file/d/1y7LPIIS0l29_i8YyJnJLn30aqanMp_hG/view?usp=drive_link" target="_blank" rel="noreferrer">이력서 PDF</a>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="section" id="project-library">
                  <div className="container">
                    <div className="section-head" data-reveal>
                      <h2>프로젝트</h2>
                      <p>항목을 선택하면 상세 내용을 볼 수 있습니다.</p>
                    </div>
                    <div className="library-grid" data-reveal>
                      <aside className="project-index">
                        <h3>프로젝트</h3>
                        <p>총 16개</p>
                        <div className="index-group">
                          <h4>로보틱스</h4>
                          <a className={getIndexClass("proj-hangang")} href="#proj-hangang">한강 자율주행 배달 로봇</a>
                          <a className={getIndexClass("proj-smart-factory")} href="#proj-smart-factory">스마트 팩토리 자동화</a>
                          <a className={getIndexClass("proj-ssaweb")} href="#proj-ssaweb">로봇 센서·영상 분석 웹</a>
                          <a className={getIndexClass("proj-zytron-control")} href="#proj-zytron-control">자율주행 경기장 관제</a>
                          <a className={getIndexClass("proj-autopark")} href="#proj-autopark">자율 주차 프로그램</a>
                          <a className={getIndexClass("proj-pilotnet")} href="#proj-pilotnet">PilotNet + SLAM + YOLO</a>
                          <a className={getIndexClass("proj-drone")} href="#proj-drone">자율 주행 드론</a>
                          <a className={getIndexClass("proj-modelcar")} href="#proj-modelcar">모형차 자율주행 대회</a>
                        </div>
                        <div className="index-group">
                          <h4>컴퓨터비전</h4>
                          <a className={getIndexClass("proj-cctv-height")} href="#proj-cctv-height">CCTV 객체 높이 추정</a>
                          <a className={getIndexClass("proj-cctv-speed")} href="#proj-cctv-speed">CCTV 차량 속도 추정</a>
                          <a className={getIndexClass("proj-blackbox-speed")} href="#proj-blackbox-speed">블랙박스 속도 추정</a>
                          <a className={getIndexClass("proj-rist")} href="#proj-rist">파노라마 작업자 위치 추정</a>
                        </div>
                        <div className="index-group">
                          <h4>임베디드/시스템</h4>
                          <a className={getIndexClass("proj-cctv-halow")} href="#proj-cctv-halow">무선 CCTV 웹 스트리밍</a>
                          <a className={getIndexClass("proj-stm32")} href="#proj-stm32">STM32 LED 피아노</a>
                        </div>
                        <div className="index-group">
                          <h4>기타</h4>
                          <a className={getIndexClass("proj-trader")} href="#proj-trader">가상화폐 자동 매매</a>
                          <a className={getIndexClass("proj-pacman")} href="#proj-pacman">Online Pacman</a>
                        </div>
                      </aside>

                      <div className="project-list">
                        <details className="project-detail" id="proj-hangang">
                          <summary>
                            <span className="title">한강 자율주행 배달 로봇 LiNKY</span>
                            <span className="meta">SSAFY · 2025.07-08 · 6인 · 팀장/PM/Robotics</span>
                          </summary>
                          <div className="detail-body">
                            <p>야외 환경에서 배달을 수행하는 자율주행 로봇 서비스. 얼굴 인식으로 인수 확인까지 진행.</p>
                            <ul>
                              <li>ROS2 노드 통합, Jetson Orin Nano에서 Isaac ROS VSLAM 실행</li>
                              <li>GPS &lt;-&gt; SLAM 좌표 실시간 변환</li>
                              <li>Pure-Pursuit 기반 경로 생성/추종</li>
                              <li>MQTT 기반 실시간 스트리밍</li>
                            </ul>
                            <div className="tag-row">
                              <span>ROS2</span><span>Isaac ROS VSLAM</span><span>MQTT</span><span>FaceNet</span><span>Docker</span>
                            </div>
                            <div className="detail-links">
                              <a className="chip-link github icon-link" href="https://github.com/YooJuno/LiNKY" target="_blank" rel="noreferrer">GitHub</a>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/portfolio/linky/front.png" alt="로봇 정면" loading="lazy" decoding="async" />
                                <figcaption>로봇 정면</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/linky/system_architecture.png" alt="시스템 아키텍처" loading="lazy" decoding="async" />
                                <figcaption>시스템 아키텍처</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/linky/ui.png" alt="관제 UI" loading="lazy" decoding="async" />
                                <figcaption>관제 UI</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/linky/slam_map.png" alt="Visual SLAM 맵" loading="lazy" decoding="async" />
                                <figcaption>Visual SLAM 맵</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/linky/face_recognition.png" alt="얼굴 인식" loading="lazy" decoding="async" />
                                <figcaption>얼굴 인식</figcaption>
                              </figure>
                            </div>
                          </div>
                        </details>

                        <details className="project-detail" id="proj-smart-factory">
                          <summary>
                            <span className="title">스마트 팩토리 로봇팔 자동화 & 디지털 트윈</span>
                            <span className="meta">SSAFY · 2025.04-05 · 3인 · 팀장/PM</span>
                          </summary>
                          <div className="detail-body">
                            <p>웹 인터페이스 기반 로봇팔 자동화 공정과 RoboDK 디지털 트윈 구현.</p>
                            <ul>
                              <li>ROS2 기반 영상처리 및 로봇 제어 시스템 구축</li>
                              <li>Perspective Transformation으로 RoI 정렬 후 YOLOv5 불량 검출</li>
                              <li>End-Effector 오프셋 문제를 FK로 보정</li>
                            </ul>
                            <div className="tag-row">
                              <span>ROS2</span><span>YOLOv5</span><span>RoboDK</span><span>OpenCV</span><span>Flask</span>
                            </div>
                            <div className="detail-links">
                              <a className="chip-link github icon-link" href="https://github.com/YooJuno/SSAFY-Smart_Factory" target="_blank" rel="noreferrer">GitHub</a>
                              <a className="chip-link youtube icon-link" href="https://www.youtube.com/watch?v=G8R1HWxcDtk" target="_blank" rel="noreferrer">Demo Video</a>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/portfolio/smart_factory/workspace.png" alt="로봇팔 작업 셀" loading="lazy" decoding="async" />
                                <figcaption>로봇팔 작업 셀</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/smart_factory/robodk.png" alt="디지털 트윈 화면" loading="lazy" decoding="async" />
                                <figcaption>디지털 트윈 화면</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/smart_factory/yolo.png" alt="검출 결과" loading="lazy" decoding="async" />
                                <figcaption>검출 결과</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/smart_factory/system_architecture.png" alt="시스템 아키텍처" loading="lazy" decoding="async" />
                                <figcaption>시스템 아키텍처</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/smart_factory/thread.png" alt="멀티 스레드 구조" loading="lazy" decoding="async" />
                                <figcaption>멀티 스레드 구조</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/smart_factory/ui.png" alt="웹 인터페이스" loading="lazy" decoding="async" />
                                <figcaption>웹 인터페이스</figcaption>
                              </figure>
                            </div>
                          </div>
                        </details>

                        <details className="project-detail" id="proj-ssaweb">
                          <summary>
                            <span className="title">로봇 센서·영상 실시간 분석 웹</span>
                            <span className="meta">SSAFY · 2025.02-03 · 1인</span>
                          </summary>
                          <div className="detail-body">
                            <p>로봇 센서/영상 데이터를 서버에서 분석하고 웹에서 실시간 시각화.</p>
                            <ul>
                              <li>Vue 기반 실시간 차트/스트리밍 UI 구현</li>
                              <li>Node.js 서버와 YOLOv9 연동</li>
                              <li>비동기 처리로 통신 성능 개선</li>
                            </ul>
                            <div className="tag-row">
                              <span>Vue.js</span><span>Node.js</span><span>YOLOv9</span><span>MySQL</span><span>Nginx</span>
                            </div>
                            <div className="detail-links">
                              <a className="chip-link github icon-link" href="https://github.com/YooJuno/SSAFY-Web" target="_blank" rel="noreferrer">GitHub</a>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/portfolio/web-pjt/ui.png" alt="웹 UI" loading="lazy" decoding="async" />
                                <figcaption>웹 UI</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/web-pjt/system_architecture.png" alt="시스템 아키텍처" loading="lazy" decoding="async" />
                                <figcaption>시스템 아키텍처</figcaption>
                              </figure>
                            </div>
                          </div>
                        </details>

                        <details className="project-detail" id="proj-cctv-halow">
                          <summary>
                            <span className="title">무선 CCTV 웹 스트리밍 (Wi-Fi HaLow)</span>
                            <span className="meta">2024.01-02 · 4인</span>
                          </summary>
                          <div className="detail-body">
                            <p>유선 연결이 어려운 환경을 위해 무선 CCTV 실시간 스트리밍 서비스 구현.</p>
                            <ul>
                              <li>Raspberry Pi 노드와 게이트웨이 구성</li>
                              <li>Wi-Fi HaLow 모듈 설치 및 통신</li>
                              <li>Crontab으로 자동 실행 및 오류 대응</li>
                            </ul>
                            <div className="tag-row">
                              <span>gRPC</span><span>Wi-Fi HaLow</span><span>Raspberry Pi</span><span>Crontab</span>
                            </div>
                            <div className="detail-links">
                              <a className="chip-link github icon-link" href="https://github.com/InternetOfTough/CCTV_HaLow" target="_blank" rel="noreferrer">GitHub</a>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/portfolio/cctv-halow/system-architecture.png" alt="시스템 아키텍처" loading="lazy" decoding="async" />
                                <figcaption>시스템 아키텍처</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/cctv-halow/cctv-module.jpeg" alt="CCTV 모듈" loading="lazy" decoding="async" />
                                <figcaption>CCTV 모듈</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/cctv-halow/gateway.jpeg" alt="게이트웨이" loading="lazy" decoding="async" />
                                <figcaption>게이트웨이</figcaption>
                              </figure>
                            </div>
                          </div>
                        </details>

                        <details className="project-detail" id="proj-cctv-height">
                          <summary>
                            <span className="title">CCTV 영상 내 객체 높이 추정</span>
                            <span className="meta">2024.01-04 · 산학 과제</span>
                          </summary>
                          <div className="detail-body">
                            <p>단일 시점 CCTV 영상에서 객체 높이를 추정하는 알고리즘 개발.</p>
                            <ul>
                              <li>Vanishing Point/Line 기반 Single View Geometry 적용</li>
                              <li>PyQT GUI로 기준선 및 참조선 입력</li>
                            </ul>
                            <div className="tag-row">
                              <span>OpenCV</span><span>Single View Geometry</span><span>PyQT</span>
                            </div>
                            <div className="detail-links">
                              <span className="chip-link muted">보안상 공개 불가</span>
                              <a className="chip-link youtube icon-link" href="https://www.youtube.com/watch?v=-ZYTrtNs5Vk" target="_blank" rel="noreferrer">Demo Video</a>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="높이 추정 결과" loading="lazy" decoding="async" />
                                <figcaption>높이 추정 결과</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="기하 보정 라인" loading="lazy" decoding="async" />
                                <figcaption>기하 보정 라인</figcaption>
                              </figure>
                            </div>
                          </div>
                        </details>

                        <details className="project-detail" id="proj-cctv-speed">
                          <summary>
                            <span className="title">CCTV 영상 내 차량 속도 추정</span>
                            <span className="meta">2024.04-06 · 산학 과제 · 5인</span>
                          </summary>
                          <div className="detail-body">
                            <p>Perspective Transformation 기반 속도 측정 파이프라인 설계.</p>
                            <ul>
                              <li>RoI 영역을 PT로 정렬하여 측정 안정성 확보</li>
                              <li>데이터셋 기준 평균 오차 0.5 km/h</li>
                            </ul>
                            <div className="tag-row">
                              <span>OpenCV</span><span>Perspective Transform</span><span>Dataset</span>
                            </div>
                            <div className="detail-links">
                              <span className="chip-link muted">보안상 공개 불가</span>
                              <a className="chip-link youtube icon-link" href="https://www.youtube.com/watch?v=v-8i_FkTkIU" target="_blank" rel="noreferrer">Demo Video</a>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="속도 추정 프레임" loading="lazy" decoding="async" />
                                <figcaption>속도 추정 프레임</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="트래킹 결과" loading="lazy" decoding="async" />
                                <figcaption>트래킹 결과</figcaption>
                              </figure>
                            </div>
                          </div>
                        </details>

                        <details className="project-detail" id="proj-blackbox-speed">
                          <summary>
                            <span className="title">블랙박스 영상 속도 추정</span>
                            <span className="meta">2024.07-08 · 인턴 · 1인</span>
                          </summary>
                          <div className="detail-body">
                            <p>COLMAP 3D 재구성 기반 Real-to-Pixel 스케일을 활용한 속도 추정.</p>
                            <ul>
                              <li>차량 보닛 마스킹으로 Point Cloud 품질 개선</li>
                              <li>구간별 ±3 km/h 수준과 큰 편차 구간을 함께 분석</li>
                            </ul>
                            <div className="tag-row">
                              <span>COLMAP</span><span>SfM</span><span>OpenCV</span>
                            </div>
                            <div className="detail-links">
                              <span className="chip-link muted">보안상 공개 불가</span>
                              <a className="chip-link youtube icon-link" href="https://www.youtube.com/watch?v=_HwGZA1f8t0" target="_blank" rel="noreferrer">후방 Demo 1</a>
                              <a className="chip-link youtube icon-link" href="https://www.youtube.com/watch?v=oEf1EfqPtWA" target="_blank" rel="noreferrer">후방 Demo 2</a>
                              <a className="chip-link youtube icon-link" href="https://www.youtube.com/watch?v=cIEgDyLUE0I" target="_blank" rel="noreferrer">전방 Demo</a>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/portfolio/gmdsoft/preprocessing.png" alt="RoI 마스크 설정" loading="lazy" decoding="async" />
                                <figcaption>RoI 마스크 설정</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/gmdsoft/result.png" alt="GPS 속도 대비 추정 결과" loading="lazy" decoding="async" />
                                <figcaption>GPS 속도 대비 추정 결과</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/gmdsoft/sfm_result.png" alt="COLMAP 3D 재구성" loading="lazy" decoding="async" />
                                <figcaption>COLMAP 3D 재구성</figcaption>
                              </figure>
                            </div>
                          </div>
                        </details>

                        <details className="project-detail" id="proj-zytron-control">
                          <summary>
                            <span className="title">자율주행 경기장 관제 시스템</span>
                            <span className="meta">자이트론 · 2023.11-12 · 1인</span>
                          </summary>
                          <div className="detail-body">
                            <p>ROS2 기반 경기 기록 측정 및 미션 확인 자동화.</p>
                            <ul>
                              <li>ESP32 노드와 Micro-ROS 통신 구성</li>
                              <li>PyQT5 GUI 상황판 구현</li>
                              <li>멀티 스레드 구조로 안정성 개선</li>
                            </ul>
                            <div className="tag-row">
                              <span>ROS2</span><span>Micro-ROS</span><span>ESP32</span><span>PyQT</span>
                            </div>
                            <div className="detail-links">
                              <span className="chip-link muted">보안상 공개 불가</span>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="관제 UI" loading="lazy" decoding="async" />
                                <figcaption>관제 UI</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="로봇 상태 맵" loading="lazy" decoding="async" />
                                <figcaption>로봇 상태 맵</figcaption>
                              </figure>
                            </div>
                          </div>
                        </details>

                        <details className="project-detail" id="proj-autopark">
                          <summary>
                            <span className="title">자율 주차 프로그램 개발</span>
                            <span className="meta">자이트론 · 2023.09-10 · 1인</span>
                          </summary>
                          <div className="detail-body">
                            <p>카메라 기반 Pose 추정 및 경로 생성/추종 시뮬레이션.</p>
                            <ul>
                              <li>Camera Calibration 및 AR-Tag 기반 Pose 계산</li>
                              <li>Quintic-Polynomial 경로 생성 + Pure-Pursuit 추종</li>
                              <li>Pygame으로 2D 시각화</li>
                            </ul>
                            <div className="tag-row">
                              <span>OpenCV</span><span>AR-Tag</span><span>Path Planning</span><span>Pygame</span>
                            </div>
                            <div className="detail-links">
                              <span className="chip-link muted">보안상 공개 불가</span>
                              <a className="chip-link youtube icon-link" href="https://www.youtube.com/watch?v=-GKsm9lfCZk" target="_blank" rel="noreferrer">Demo Video</a>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="주차 경로" loading="lazy" decoding="async" />
                                <figcaption>주차 경로</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="시뮬레이터 화면" loading="lazy" decoding="async" />
                                <figcaption>시뮬레이터 화면</figcaption>
                              </figure>
                            </div>
                          </div>
                        </details>

                        <details className="project-detail" id="proj-pilotnet">
                          <summary>
                            <span className="title">PilotNet 성능 향상을 위한 SLAM + YOLO</span>
                            <span className="meta">2022.07-2023.06 · 5인</span>
                          </summary>
                          <div className="detail-body">
                            <p>ORB-SLAM3와 YOLOv5를 결합해 자율주행 안정성 확보.</p>
                            <ul>
                              <li>SLAM을 서버에서 수행하는 클라이언트-서버 구조 설계</li>
                              <li>YOLOv5로 보행자/장애물 인식</li>
                              <li>논문 발표 (대한전자공학회 2023.06)</li>
                            </ul>
                            <div className="tag-row">
                              <span>PilotNet</span><span>ORB-SLAM3</span><span>YOLOv5</span><span>TCP</span>
                            </div>
                            <div className="detail-links">
                              <a className="chip-link github icon-link" href="https://github.com/YooJuno/Autonomous-Driving_E2E_SLAM" target="_blank" rel="noreferrer">GitHub</a>
                              <a className="chip-link" href="https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11522374" target="_blank" rel="noreferrer">논문</a>
                              <a className="chip-link youtube icon-link" href="https://www.youtube.com/playlist?list=PLg3p47m-psINqF_8QVGMixhW7zAv6Ir2F" target="_blank" rel="noreferrer">Demo Playlist</a>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="SLAM+YOLO 파이프라인" loading="lazy" decoding="async" />
                                <figcaption>SLAM+YOLO 파이프라인</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="주행 데모" loading="lazy" decoding="async" />
                                <figcaption>주행 데모</figcaption>
                              </figure>
                            </div>
                          </div>
                        </details>

                        <details className="project-detail" id="proj-rist">
                          <summary>
                            <span className="title">파노라마 카메라 작업자 위치 추정</span>
                            <span className="meta">RIST 산학 · 2022.09-2023.02 · 4인</span>
                          </summary>
                          <div className="detail-body">
                            <p>360도 파노라마 영상 기반 작업자 위치 및 이동 경로 추정.</p>
                            <ul>
                              <li>SIFT Feature + RANSAC으로 매칭 안정화</li>
                              <li>Radius Matching 알고리즘으로 노이즈 감소</li>
                            </ul>
                            <div className="tag-row">
                              <span>SIFT</span><span>RANSAC</span><span>Feature Matching</span>
                            </div>
                            <div className="detail-links">
                              <span className="chip-link muted">보안상 공개 불가</span>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="파노라마 매칭" loading="lazy" decoding="async" />
                                <figcaption>파노라마 매칭</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="작업자 위치 추정" loading="lazy" decoding="async" />
                                <figcaption>작업자 위치 추정</figcaption>
                              </figure>
                            </div>
                          </div>
                        </details>

                        <details className="project-detail" id="proj-trader">
                          <summary>
                            <span className="title">딥러닝 가상화폐 자동 매매</span>
                            <span className="meta">2023.05-06 · 4인 · 팀장</span>
                          </summary>
                          <div className="detail-body">
                            <p>LSTM 기반 예측과 변동성 돌파 전략을 결합한 자동 매매 시스템.</p>
                            <ul>
                              <li>데이터 구간별 학습 전략 4종 비교</li>
                              <li>Upbit API 기반 자동 매매 구현</li>
                            </ul>
                            <div className="tag-row">
                              <span>LSTM</span><span>Upbit API</span><span>Python</span>
                            </div>
                            <div className="detail-links">
                              <a className="chip-link github icon-link" href="https://github.com/YooJuno/Upbit-Auto-Trader" target="_blank" rel="noreferrer">GitHub</a>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="매매 대시보드" loading="lazy" decoding="async" />
                                <figcaption>매매 대시보드</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="전략 흐름" loading="lazy" decoding="async" />
                                <figcaption>전략 흐름</figcaption>
                              </figure>
                            </div>
                          </div>
                        </details>

                        <details className="project-detail" id="proj-pacman">
                          <summary>
                            <span className="title">Online Pacman (Boost ASIO)</span>
                            <span className="meta">2023.05-06 · 2인</span>
                          </summary>
                          <div className="detail-body">
                            <p>비동기 TCP 통신 기반 멀티 플레이어 Pacman 게임.</p>
                            <ul>
                              <li>io_context 기반 이벤트 루프 및 세션 관리</li>
                              <li>클라이언트 입력을 서버에 송신해 실시간 UI 업데이트</li>
                            </ul>
                            <div className="tag-row">
                              <span>Boost ASIO</span><span>TCP</span><span>OpenCV</span>
                            </div>
                            <div className="detail-links">
                              <a className="chip-link github icon-link" href="https://github.com/YooJuno/PacmanGame-BoostASIO" target="_blank" rel="noreferrer">GitHub</a>
                              <a className="chip-link youtube icon-link" href="https://www.youtube.com/watch?v=2uh6XcFZric" target="_blank" rel="noreferrer">Demo Video</a>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="게임 화면" loading="lazy" decoding="async" />
                                <figcaption>게임 화면</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="네트워크 구조" loading="lazy" decoding="async" />
                                <figcaption>네트워크 구조</figcaption>
                              </figure>
                            </div>
                          </div>
                        </details>

                        <details className="project-detail" id="proj-stm32">
                          <summary>
                            <span className="title">STM32 기반 LED 피아노</span>
                            <span className="meta">2023.04-06 · 4인</span>
                          </summary>
                          <div className="detail-body">
                            <p>DMA+SPI 기반 저지연 LED 피아노 모듈 구현.</p>
                            <ul>
                              <li>mbed OS 기반 펌웨어 개발</li>
                              <li>DMA로 LED 타이밍 제어, PWM으로 음 출력</li>
                            </ul>
                            <div className="tag-row">
                              <span>STM32</span><span>mbed OS</span><span>DMA</span><span>SPI</span>
                            </div>
                            <div className="detail-links">
                              <a className="chip-link github icon-link" href="https://github.com/YooJuno/STM32-MBED/tree/main/Final" target="_blank" rel="noreferrer">GitHub</a>
                              <a className="chip-link youtube icon-link" href="https://www.youtube.com/watch?v=sW-dLjTRV7A" target="_blank" rel="noreferrer">Demo Video</a>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="LED 피아노 보드" loading="lazy" decoding="async" />
                                <figcaption>LED 피아노 보드</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="패턴 출력" loading="lazy" decoding="async" />
                                <figcaption>패턴 출력</figcaption>
                              </figure>
                            </div>
                          </div>
                        </details>

                        <details className="project-detail" id="proj-drone">
                          <summary>
                            <span className="title">영상 처리 기반 자율 주행 드론</span>
                            <span className="meta">2021.11-12 · 1인</span>
                          </summary>
                          <div className="detail-body">
                            <p>객체 인식과 PID 제어를 결합한 드론 주행.</p>
                            <ul>
                              <li>OpenCV 기반 HSV/Edge 처리</li>
                              <li>YOLO 기반 회피 주행</li>
                            </ul>
                            <div className="tag-row">
                              <span>OpenCV</span><span>YOLO</span><span>PID</span><span>djitellopy</span>
                            </div>
                            <div className="detail-links">
                              <span className="chip-link muted">보안상 공개 불가</span>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="드론 주행" loading="lazy" decoding="async" />
                                <figcaption>드론 주행</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="객체 추적" loading="lazy" decoding="async" />
                                <figcaption>객체 추적</figcaption>
                              </figure>
                            </div>
                          </div>
                        </details>

                        <details className="project-detail" id="proj-modelcar">
                          <summary>
                            <span className="title">모형차 자율 주행 경진대회</span>
                            <span className="meta">2021.07-08 · 3인</span>
                          </summary>
                          <div className="detail-body">
                            <p>차선 인식 기반 주행 및 회피 알고리즘 최적화.</p>
                            <ul>
                              <li>Hough 기반 차선 인식</li>
                              <li>PID 조향 최적화 및 부드러운 주행</li>
                              <li>객체 인식 및 회피 주행 적용</li>
                            </ul>
                            <div className="tag-row">
                              <span>OpenCV</span><span>PID</span><span>YOLO</span>
                            </div>
                            <div className="detail-links">
                              <span className="chip-link muted">보안상 공개 불가</span>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="차선 인식" loading="lazy" decoding="async" />
                                <figcaption>차선 인식</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/placeholder.svg" alt="주행 테스트" loading="lazy" decoding="async" />
                                <figcaption>주행 테스트</figcaption>
                              </figure>
                            </div>
                          </div>
                        </details>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="section" id="skills">
                  <div className="container" data-reveal>
                    <div className="section-head">
                      <h2>기술 스택</h2>
                      <p>로보틱스 중심의 실전 경험을 기반으로 기술을 구성합니다.</p>
                    </div>
                    <div className="stack-grid">
                      <div className="stack-card">
                        <h3>Robotics & Autonomy</h3>
                        <div className="chip-list">
                          <span>ROS2</span><span>Nav2</span><span>Pure-Pursuit</span><span>Path Planning</span><span>RoboDK</span><span>Dobot</span>
                        </div>
                      </div>
                      <div className="stack-card">
                        <h3>Computer Vision</h3>
                        <div className="chip-list">
                          <span>Isaac ROS VSLAM</span><span>ORB-SLAM3</span><span>RTAB-MAP</span><span>YOLOv5/9</span><span>COLMAP</span><span>OpenCV</span>
                        </div>
                      </div>
                      <div className="stack-card">
                        <h3>Embedded & Hardware</h3>
                        <div className="chip-list">
                          <span>Jetson Orin Nano</span><span>ESP32</span><span>STM32</span><span>Raspberry Pi</span><span>nRF52840</span><span>RealSense D435i</span>
                        </div>
                      </div>
                      <div className="stack-card">
                        <h3>Networking & Web</h3>
                        <div className="chip-list">
                          <span>MQTT</span><span>gRPC</span><span>TCP/UDP</span><span>Vue.js</span><span>Node.js</span><span>Express</span><span>MySQL</span><span>Nginx</span>
                        </div>
                      </div>
                      <div className="stack-card">
                        <h3>Languages & Tools</h3>
                        <div className="chip-list">
                          <span>C++</span><span>Python</span><span>Docker</span><span>Linux</span><span>Git</span><span>Jira</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="section" id="experience">
                  <div className="container" data-reveal>
                    <div className="section-head">
                      <h2>경험</h2>
                      <p>교육, 연구, 인턴십 이력입니다.</p>
                    </div>
                    <div className="timeline">
                      <div className="timeline-item">
                        <span className="time">2025.01-10</span>
                        <div>
                          <h3>SSAFY 임베디드 로봇 트랙</h3>
                          <p>웹·로봇 프로젝트 수행, 자동화 시스템 설계 및 로봇팔 제어 경험.</p>
                        </div>
                      </div>
                      <div className="timeline-item">
                        <span className="time">2024.07-09</span>
                        <div>
                          <h3>GMD SOFT 인턴 · 영상 포렌식</h3>
                          <p>경쟁사 조사, gRPC 기반 분산 처리 시스템 설계, Visual-SLAM 세미나 진행.</p>
                        </div>
                      </div>
                      <div className="timeline-item">
                        <span className="time">2022.07-2024.06</span>
                        <div>
                          <h3>한동대학교 CGV LAB 학부 연구생</h3>
                          <p>컴퓨터비전/로보틱스 연구 프로젝트 수행.</p>
                        </div>
                      </div>
                      <div className="timeline-item">
                        <span className="time">2023.09-12</span>
                        <div>
                          <h3>자이트론 인턴 · 자율주행 교육/제품 개발</h3>
                          <p>자율주행 교육 강의 보조·진행, 경기장 관제 시스템 및 자율 주차 프로그램 개발.</p>
                        </div>
                      </div>
                    </div>

                    <div className="split-cards">
                      <div className="mini-card">
                        <h3>논문 · 발표</h3>
                        <p>PilotNet 성능 향상을 위한 SLAM과 YOLO 활용 (대한전자공학회, 2023.06)</p>
                        <div className="detail-links">
                          <a className="chip-link" href="https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11522374" target="_blank" rel="noreferrer">논문 링크</a>
                          <a className="chip-link" href="/content/portfolio/pdfs/PilotNet 성능향상을 위한 SLAM과 YOLO 활용.pdf" target="_blank" rel="noreferrer">논문 PDF</a>
                        </div>
                      </div>
                      <div className="mini-card">
                        <h3>수상</h3>
                        <p>캡스톤 디자인 페스티벌 우수상 (한동대학교, 2023.05)</p>
                        <a className="chip-link" href="/content/portfolio/pdfs/캡스톤 경진대회.pdf" target="_blank" rel="noreferrer">상장 PDF</a>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="section" id="activities">
                  <div className="container" data-reveal>
                    <div className="section-head">
                      <h2>활동</h2>
                      <p>교육 및 조교 활동입니다.</p>
                    </div>
                    <div className="activity-grid">
                      <article>
                        <h3>상상이상 사이언스 상상교사</h3>
                        <p>포스코 1% 나눔재단 (2022.06-2023.07)</p>
                        <p>중학교 대상 과학·IT 체험 교육 8개 학교 진행. AR/코딩 체험 수업 설계.</p>
                      </article>
                      <article>
                        <h3>컴퓨터비전 전공 조교</h3>
                        <p>수업 자료 정리 및 학습 지원. 피처 매칭 알고리즘 이해 심화.</p>
                      </article>
                    </div>
                  </div>
                </section>

                <section className="section" id="contact">
                  <div className="container" data-reveal>
                    <div className="contact-card">
                      <div>
                        <h2>연락처</h2>
                        <p>프로젝트 및 채용 문의</p>
                        <div className="contact-info">
                          <span>Seoul, KR</span>
                          <span>juno980220@naver.com</span>
                          <span>010-3792-6395</span>
                        </div>
                      </div>
                      <div className="contact-actions">
                        <a className="btn primary" href="mailto:juno980220@naver.com">메일 보내기</a>
                        <a className="btn ghost github icon-link" href="https://github.com/YooJuno" target="_blank" rel="noreferrer">GitHub</a>
                        <a className="btn ghost youtube icon-link" href="https://youtube.com/@yoojuno" target="_blank" rel="noreferrer">YouTube</a>
                        <a className="btn ghost" href="https://www.notion.so/1a9302636cd781059263e5b57e11fc70" target="_blank" rel="noreferrer">Notion 이력서</a>
                      </div>
                    </div>
                  </div>
                </section>
              </main>
              {lightbox && (
                <div className="lightbox" role="dialog" aria-modal="true">
                  <div
                    className="lightbox-backdrop"
                    onClick={() => setLightbox(null)}
                    aria-hidden="true"
                  />
                  <figure className="lightbox-content">
                    <button
                      className="lightbox-close"
                      type="button"
                      onClick={() => setLightbox(null)}
                      aria-label="닫기"
                    >
                      ×
                    </button>
                    <img src={lightbox.src} alt={lightbox.alt} />
                    {lightbox.hasAlt && <figcaption>{lightbox.alt}</figcaption>}
                  </figure>
                </div>
              )}
    </div>
  )
}

export default Portfolio

