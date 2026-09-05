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
  const lightboxCloseRef = useRef(null)
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

    // 열기 전 포커스를 기억했다가 닫을 때 되돌린다.
    const previouslyFocused = document.activeElement
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setLightbox(null)
        return
      }
      // 대화상자 안에서 이동 가능한 요소는 닫기 버튼 하나뿐이므로
      // Tab 이 배경으로 빠져나가지 않게 붙잡아 둔다.
      if (event.key === 'Tab') {
        event.preventDefault()
        lightboxCloseRef.current?.focus()
      }
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    lightboxCloseRef.current?.focus()

    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = prevOverflow
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
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
                        <a className="btn ghost" href="https://drive.google.com/file/d/1TZL7Uzh63LOdcYgKJznvCYh8l3yT4oa0/view?usp=drive_link" aria-label="포트폴리오 PDF (새 창)" target="_blank" rel="noreferrer">포트폴리오 PDF</a>
                        <a className="btn ghost" href="https://drive.google.com/file/d/1y7LPIIS0l29_i8YyJnJLn30aqanMp_hG/view?usp=drive_link" aria-label="이력서 PDF (새 창)" target="_blank" rel="noreferrer">이력서 PDF</a>
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
                            <p>
                              한강에서 배달 음식을 받으려면 먼 거리를 걸어가야 하는 불편을 해결하기 위해,
                              야외에서 카메라 기반으로 자율주행하는 배달 로봇을 만들었습니다. 6인 팀에서
                              팀장이자 PM 으로 자율주행 로봇 개발을 맡았습니다.
                            </p>
                            <ul>
                              <li>Jetson Orin Nano 에 최적화된 Isaac ROS Visual-SLAM 으로 온디바이스 위치 추정</li>
                              <li>RealSense D435i 로 Point Cloud 를 얻어 주행 환경 지도를 미리 생성</li>
                              <li>주행 환경의 GPS 정보를 SLAM 좌표와 매핑해 GPS &lt;-&gt; SLAM 실시간 변환</li>
                              <li>가까운 고객 순으로 경로를 만들고 Pure-Pursuit 로 추종</li>
                              <li>FaceNet 으로 사전 등록 사진과 실시간 이미지를 비교해 수령자 확인</li>
                              <li>실시간 영상을 base64 로 변환해 MQTT 로 송신, 관리자·고객 화면에서 확인</li>
                            </ul>

                            <div className="detail-note">
                              <h4>설계 변경</h4>
                              <p>
                                <strong>gRPC 에서 REST + SSE 로</strong> protobuf 직렬화가 빨라 영상 전송에 유리하다고 보고 gRPC 로 설계했습니다. 서버와 로봇 사이는 잘 동작했지만, 브라우저에서 gRPC 를 쓰려면 별도 프로토콜과 envoy proxy 중계가 필요했고 Vue 의 Vite 와 호환되지 않아 전체를 REST 와 SSE 구조로 바꿨습니다.
                              </p>
                              <p>
                                <strong>WebRTC 에서 MQTT 로</strong> 실시간 스트리밍을 위해 C++ ffmpeg 파이프라인을 설계했으나 백엔드의 OpenVIDU 와 호환되지 않았고 WebRTC Signaling 을 직접 구현할 시간이 부족했습니다. 이미지를 base64 로 변환해 MQTT 토픽으로 보내는 방식으로 기능을 완성했습니다.
                              </p>
                            </div>

                            <div className="tag-row">
                              <span>ROS2</span><span>Isaac ROS VSLAM</span><span>MQTT</span><span>FaceNet</span><span>Docker</span>
                            </div>
                            <div className="detail-links">
                              <a className="chip-link github icon-link" href="https://github.com/YooJuno/LiNKY" aria-label="한강 자율주행 배달 로봇 LiNKY GitHub (새 창)" target="_blank" rel="noreferrer">GitHub</a>
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
                            <p>
                              산업·협동 로봇 수요가 늘고 안전사고 예방이 중요해지는 흐름에 맞춰, 로봇팔의
                              모션 제어를 웹에서 수행하는 자동화 공정과 디지털 트윈을 만들었습니다. 3인 팀에서
                              팀장이자 PM 으로 ROS2 시스템과 서버, 영상처리, Dobot 모션 제어를 맡았습니다.
                            </p>
                            <ul>
                              <li>카메라 영상에서 Coordinate Board 를 Perspective Transformation 해 원근 제거</li>
                              <li>원근이 제거된 RoI 를 실시간 웹 스트리밍하고, 화면 클릭으로 로봇 목적지 지정</li>
                              <li>슬라이드 바로 세밀 제어, 채팅창에 대화식으로 입력하면 ChatGPT API 가 로봇 명령으로 변환</li>
                              <li>컨베이어 위 객체를 감지하면 벨트를 구동하고 YOLOv5 로 불량품(빨간색) 분류</li>
                              <li>같은 시나리오를 RoboDK 디지털 트윈으로 동시 시뮬레이션</li>
                            </ul>

                            <div className="detail-note">
                              <h4>문제 해결</h4>
                              <p>
                                <strong>문제</strong> 로봇의 End-Effector 위치가 실제 흡착 부위인 Suction-Cup 이 아니라 마지막 관절 위치로 반영됐습니다.
                              </p>
                              <p>
                                <strong>해결</strong> 마지막 관절부터 Suction-Cup 까지의 거리를 직접 측정하고, 정기구학(FK)으로 End-Effector 위치를 계산해 보정했습니다.
                              </p>
                            </div>

                            <div className="detail-note">
                              <h4>서버 구조</h4>
                              <p>
                                메인 스레드의 Web API 외에 ROS2(Dobot·영상처리 노드), TCP1(컨베이어 벨트 라즈베리파이5), TCP2(RoboDK 실행 PC) 를 각각 별도 스레드로 두어 실시간 비동기 통신을 처리했습니다.
                              </p>
                              <p>
                                클라이언트 수가 동적으로 변하지 않고 리소스에 주는 영향도 크지 않다고 판단해, 비동기 이벤트 루프 대신 멀티 스레드로 더 안정적인 구조를 택했습니다.
                              </p>
                            </div>

                            <div className="detail-note">
                              <h4>회고</h4>
                              <ul>
                                <li>실시간 스트리밍 속도 개선을 위해서는 RTP 도입이 필요합니다.</li>
                                <li>Perspective Transformation 으로 원근은 제거했지만, 지면에서 솟아 있는 객체는 옆면이 함께 보이는 한계가 남습니다.</li>
                              </ul>
                            </div>

                            <div className="tag-row">
                              <span>ROS2</span><span>YOLOv5</span><span>RoboDK</span><span>OpenCV</span><span>Flask</span>
                            </div>
                            <div className="detail-links">
                              <a className="chip-link github icon-link" href="https://github.com/YooJuno/SSAFY-Smart_Factory" aria-label="스마트 팩토리 로봇팔 자동화 & 디지털 트윈 GitHub (새 창)" target="_blank" rel="noreferrer">GitHub</a>
                              <a className="chip-link youtube icon-link" href="https://www.youtube.com/watch?v=G8R1HWxcDtk" aria-label="스마트 팩토리 로봇팔 자동화 & 디지털 트윈 Demo Video (새 창)" target="_blank" rel="noreferrer">Demo Video</a>
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
                            <p>
                              서버 분산 처리 수요가 커지는 흐름에 맞춰, 로봇이 보낸 영상을 서버에서 처리하고
                              그 결과를 웹으로 내보내는 시스템을 1인으로 만들었습니다. Full Stack 으로 웹
                              인터페이스와 서버 통신 시스템, 영상처리를 모두 담당했습니다.
                            </p>
                            <ul>
                              <li>로봇(Raspberry Pi)이 센서 값과 영상을 서버로 송신</li>
                              <li>서버가 영상을 로컬의 YOLO 서버로 넘기고 결과를 받아 웹 서버로 전달</li>
                              <li>모든 중계를 비동기로 처리해 통신 성능 확보</li>
                              <li>프런트에서 센서 데이터를 실시간 차트로, 검출 결과와 영상을 함께 표시</li>
                            </ul>

                            <div className="detail-note">
                              <h4>회고</h4>
                              <ul>
                                <li>실시간 스트리밍 속도 개선을 위해 RTP 도입이 필요합니다.</li>
                                <li>서버에 로드 밸런싱을 적용하면 분산 처리 기능을 확장할 수 있을 것으로 보입니다.</li>
                                <li>Log 저장 기능은 구현했지만 쓰임이 애매해 데모에서 활용하지 못했습니다. DB 를 활용하는 방향으로 보완이 필요합니다.</li>
                                <li>라즈베리파이 카메라 고장으로 실시간 촬영 대신 별도 동영상으로 대체해 시연했습니다.</li>
                              </ul>
                            </div>

                            <div className="tag-row">
                              <span>Vue.js</span><span>Node.js</span><span>YOLOv9</span><span>MySQL</span><span>Nginx</span>
                            </div>
                            <div className="detail-links">
                              <a className="chip-link github icon-link" href="https://github.com/YooJuno/SSAFY-Web" aria-label="로봇 센서·영상 실시간 분석 웹 GitHub (새 창)" target="_blank" rel="noreferrer">GitHub</a>
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
                            <p>
                              유선 연결이 어려운 곳에도 CCTV 를 설치할 수 있도록, 여러 노드에서 촬영한 영상을
                              실시간 웹 스트리밍하는 시스템을 4인 팀으로 구축했습니다. 임베디드 프로그래밍과
                              영상처리, gRPC 통신 개발을 맡았습니다.
                            </p>
                            <ul>
                              <li>CCTV 노드와 게이트웨이를 직접 설치하고 라즈베리파이에 Wi-Fi HaLow 모듈 연동</li>
                              <li>gRPC 로 영상 송신 — protobuf 직렬화가 일반 TCP 보다 빨라 영상 전송에 유리</li>
                              <li>Crontab 으로 CCTV 노드를 자동 실행하고 이상 발생 시 대처</li>
                            </ul>

                            <div className="detail-note">
                              <h4>Wi-Fi HaLow 를 선택한 이유</h4>
                              <p>
                                900MHz 대역이라 통신 속도는 느리지만 도달 거리가 약 900m 에 이릅니다. 건물 외부의 CCTV 노드와 내부 게이트웨이를 잇는 원거리 무선 구간에 적합하다고 판단했습니다.
                              </p>
                            </div>

                            <div className="tag-row">
                              <span>gRPC</span><span>Wi-Fi HaLow</span><span>Raspberry Pi</span><span>Crontab</span>
                            </div>
                            <div className="detail-links">
                              <a className="chip-link github icon-link" href="https://github.com/InternetOfTough/CCTV_HaLow" aria-label="무선 CCTV 웹 스트리밍 (Wi-Fi HaLow) GitHub (새 창)" target="_blank" rel="noreferrer">GitHub</a>
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
                            <p>
                              범죄 현장에서 용의자의 인상착의를 특정하기 어렵다는 문제에서 출발해, CCTV 영상
                              한 장으로 용의자의 키를 추정했습니다. GMD SOFT 산학 과제로 5인이 참여했고
                              선행 연구 조사와 Single View Geometry 기반 높이 추정 알고리즘 개발을 맡았습니다.
                            </p>
                            <ul>
                              <li>PyQT 로 X, Y, Z 방향별 평행선을 두 개씩 입력받아 방향별 Vanishing Point 생성</li>
                              <li>X, Y 방향의 Vanishing Point 를 이어 수평선에 해당하는 Vanishing Line 생성</li>
                              <li>실제 길이를 아는 Reference Line 과 Z Vanishing Point 로 비율을 계산해 대상 높이 산출</li>
                            </ul>

                            <div className="detail-note">
                              <h4>실측 결과</h4>
                              <p>
                                높이를 아는 사물함을 Reference 로 삼아 표지판과 사람의 키를 측정했고, 오차는 각각 +1.7cm 와 +1cm 였습니다.
                              </p>
                            </div>

                            <div className="detail-note">
                              <h4>한계와 회고</h4>
                              <ul>
                                <li>현장에서 기준이 될 물체의 높이를 알 수 있다면 용의자의 키를 특정할 수 있습니다.</li>
                                <li>반대로 X, Y, Z 방향의 평행선을 잡을 수 없는 환경이면 Vanishing Point 를 만들 수 없어 추정이 불가능합니다.</li>
                                <li>사용자가 GUI 에서 마우스로 점을 찍을 때 생기는 오차를 줄이는 전처리가 필요합니다.</li>
                              </ul>
                            </div>

                            <div className="detail-note">
                              <h4>성과</h4>
                              <ul>
                                <li>산학 과제 계약 연장</li>
                                <li>방학 기간 인턴십 기회 확보</li>
                              </ul>
                            </div>

                            <div className="tag-row">
                              <span>OpenCV</span><span>Single View Geometry</span><span>PyQT</span>
                            </div>
                            <div className="detail-links">
                              <span className="chip-link muted">보안상 공개 불가</span>
                              <a className="chip-link youtube icon-link" href="https://www.youtube.com/watch?v=-ZYTrtNs5Vk" aria-label="CCTV 영상 내 객체 높이 추정 Demo Video (새 창)" target="_blank" rel="noreferrer">Demo Video</a>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/portfolio/cctv-height/single-view.jpg" alt="Single View Metrology" loading="lazy" decoding="async" />
                                <figcaption>Single View Metrology</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/cctv-height/sign.jpg" alt="표지판 높이 추정 (오차 +1.7cm)" loading="lazy" decoding="async" />
                                <figcaption>표지판 높이 추정 (오차 +1.7cm)</figcaption>
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
                            <p>
                              차량 사고 중 상당수가 과속을 입증하기 어렵다는 문제에서 출발해, CCTV 에 찍힌
                              차량의 주행 속도를 추정했습니다. GMD SOFT 산학 과제로 5인이 참여했고 경쟁사
                              제품 알고리즘 분석과 속도 추정 알고리즘 개발, 데모 데이터 수집을 맡았습니다.
                            </p>
                            <ul>
                              <li>차량이 주행하는 지면의 직사각형 길이를 현장에서 직접 측정</li>
                              <li>해당 구간을 직접 주행하며 속도별 데이터셋 촬영(청테이프로 구간 표시)</li>
                              <li>Perspective Transformation 으로 원근이 제거된 직사각형 영역 추출</li>
                              <li>차량이 영역에 들어오면 미리 그은 기준선을 클릭해 시점별 위치 저장</li>
                              <li>이전 시점과의 위치·시간 차로 속도 추정</li>
                            </ul>

                            <div className="detail-note">
                              <h4>문제 해결</h4>
                              <p>
                                <strong>문제</strong> 원근 제거를 위한 Affine &amp; Metric Rectification 은 연산량이 많고 결과가 직각으로 제대로 나오지 않았습니다.
                              </p>
                              <p>
                                <strong>해결</strong> 정해진 기한을 지키기 위해 더 단순하고 직관적인 Perspective Transformation 으로 방법을 바꿨습니다. 특정 RoI 에 대해서만 수행하면 사각형 복원이 가능합니다.
                              </p>
                            </div>

                            <div className="detail-note">
                              <h4>결과</h4>
                              <ul>
                                <li>13 km/h 구간: 추정 12.4 km/h (오차 -0.6)</li>
                                <li>16 km/h 구간: 추정 16.1 km/h (오차 +0.1)</li>
                                <li>18 km/h 구간: 추정 17.9 km/h (오차 -0.1)</li>
                                <li>주어진 데이터셋 기준 평균 오차 0.5 km/h</li>
                              </ul>
                            </div>

                            <div className="detail-note">
                              <h4>한계와 회고</h4>
                              <ul>
                                <li>촬영 여건상 고속 데이터셋을 찍지 못해 고속 주행에서의 성능은 보장할 수 없습니다.</li>
                                <li>상용화하려면 RoI 밖 영역까지 원근을 제거해야 하므로 Affine &amp; Metric Rectification 이 필요합니다.</li>
                                <li>다만 원근을 제거한 영상에서 속도 측정이 가능함을 입증한 데 의미가 있습니다.</li>
                              </ul>
                            </div>

                            <div className="detail-note">
                              <h4>성과</h4>
                              <ul>
                                <li>산학 과제 계약 연장</li>
                                <li>방학 기간 인턴십 기회 확보</li>
                              </ul>
                            </div>

                            <div className="tag-row">
                              <span>OpenCV</span><span>Perspective Transform</span><span>Dataset</span>
                            </div>
                            <div className="detail-links">
                              <span className="chip-link muted">보안상 공개 불가</span>
                              <a className="chip-link youtube icon-link" href="https://www.youtube.com/watch?v=v-8i_FkTkIU" aria-label="CCTV 영상 내 차량 속도 추정 Demo Video (새 창)" target="_blank" rel="noreferrer">Demo Video</a>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/portfolio/cctv-speed/perspective.jpg" alt="원근 제거 과정" loading="lazy" decoding="async" />
                                <figcaption>원근 제거 과정</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/cctv-speed/result.jpg" alt="16km/h 구간 추정 결과" loading="lazy" decoding="async" />
                                <figcaption>16km/h 구간 추정 결과</figcaption>
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
                            <p>
                              단속 카메라가 없는 사고 구간에서 과속 여부를 가리기 위해, 블랙박스
                              영상만으로 차량 속도를 추정했습니다. GMD SOFT 인턴 기간에 1인으로
                              진행했습니다.
                            </p>
                            <ul>
                              <li>블랙박스 영상을 마스킹 전처리한 뒤 COLMAP 으로 3D 재구성</li>
                              <li>현실 1m 가 재구성 공간에서 몇 픽셀인지(Real-to-Pixel) 계산</li>
                              <li>프레임 간 이동 거리와 시간 차로 실제 속도 산출</li>
                            </ul>

                            <div className="detail-note">
                              <h4>문제 해결</h4>
                              <p>
                                <strong>문제</strong> 3D 재구성이 불규칙하게 이루어져 Point Cloud
                                품질이 나빴습니다.
                              </p>
                              <p>
                                <strong>원인</strong> 영상 상단의 블랙박스 정보 표시와 하단의 차량
                                보닛이 매 프레임 같은 자리에 찍혀 재구성에 노이즈로 작용했습니다.
                              </p>
                              <p>
                                <strong>해결</strong> 해당 영역을 마스킹해 제거하자 훨씬 안정적인
                                Point Cloud 를 얻었습니다.
                              </p>
                            </div>

                            <div className="detail-note">
                              <h4>스케일 산출 방법</h4>
                              <ul>
                                <li>구간 내 눈에 띄는 랜드마크(주로 가로등 간격)를 골라 지도로 실제 길이 측정</li>
                                <li>재구성한 공간에서 같은 랜드마크의 픽셀 길이 측정</li>
                                <li>두 값의 비율로 m 당 픽셀 수를 구해 프레임 간 속도 계산에 사용</li>
                              </ul>
                            </div>

                            <div className="detail-note">
                              <h4>결과와 한계</h4>
                              <p>
                                주행 영상 세 편 모두 일정 구간에서는 ±3 km/h 수준의 오차를 보였고, 그
                                구간은 대부분 랜드마크를 측정한 지점 근처였습니다. 반면 랜드마크에서
                                멀어질수록 오차가 커져 후방 카메라에서는 250 km/h 까지 벌어졌습니다.
                              </p>
                              <p>
                                <strong>원인 분석</strong> COLMAP 은 사실적인 재구성에 강하지만, 직선
                                주행 영상에서는 카메라가 이동하면서 재구성 공간의 스케일 자체가
                                달라집니다. 이것이 Real-to-Pixel 변환에 그대로 오차로 반영됩니다.
                              </p>
                              <p>
                                <strong>회고</strong> 3D 재구성을 어떻게 수행하느냐에 따라 결과가 크게
                                바뀝니다. COLMAP 을 더 깊이 다루거나 다른 재구성 도구를 쓰면 정밀도를
                                높일 여지가 있습니다.
                              </p>
                            </div>

                            <div className="tag-row">
                              <span>COLMAP</span><span>SfM</span><span>OpenCV</span>
                            </div>
                            <div className="detail-links">
                              <span className="chip-link muted">보안상 공개 불가</span>
                              <a className="chip-link youtube icon-link" href="https://www.youtube.com/watch?v=_HwGZA1f8t0" aria-label="블랙박스 영상 속도 추정 후방 Demo 1 (새 창)" target="_blank" rel="noreferrer">후방 Demo 1</a>
                              <a className="chip-link youtube icon-link" href="https://www.youtube.com/watch?v=oEf1EfqPtWA" aria-label="블랙박스 영상 속도 추정 후방 Demo 2 (새 창)" target="_blank" rel="noreferrer">후방 Demo 2</a>
                              <a className="chip-link youtube icon-link" href="https://www.youtube.com/watch?v=cIEgDyLUE0I" aria-label="블랙박스 영상 속도 추정 전방 Demo (새 창)" target="_blank" rel="noreferrer">전방 Demo</a>
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
                            <p>
                              자율주행 경기장 운용이 모두 수작업으로 이루어지던 것을 자동화했습니다. 자이트론
                              인턴 기간에 1인 프로젝트로 ROS2 시스템 구축과 PyQT5 상황판, ESP32 펌웨어를
                              모두 개발했습니다.
                            </p>
                            <ul>
                              <li>라즈베리파이를 AP 모드로 띄워 ESP32 기기들이 접속하게 하고 Micro-ROS Agent 로 ROS 환경 구성</li>
                              <li>경기 시작과 미션 점검, 시간 측정을 상황판 GUI 에서 주관</li>
                              <li>초음파 노드: 센서 값을 토픽으로 발행하고 미션 성공 시 LED 점등과 함께 신호 송신(Service)</li>
                              <li>신호등 노드: 출발 신호를 받아 릴레이 모듈로 점멸을 제어하고 결과 반환(Service)</li>
                            </ul>

                            <div className="detail-note">
                              <h4>문제 해결</h4>
                              <p>
                                <strong>문제</strong> PyQT 와 ROS2 스레드 간 동기화 문제로 프로그램이 간헐적으로 종료됐습니다.
                              </p>
                              <p>
                                <strong>해결</strong> PyQT 는 반드시 메인 스레드에서 동작해야 함을 확인하고, 메인 스레드에서 돌던 ROS2 를 멀티 스레드로 옮겼습니다. ROS2 의 spin() 은 보통 메인 스레드에서 동작하지만 GUI 나 API 서버와 함께 쓸 때는 분리해야 한다는 것을 알게 됐습니다.
                              </p>
                            </div>

                            <div className="detail-note">
                              <h4>회고</h4>
                              <ul>
                                <li>멀티 스레드를 다룰 때는 해당 라이브러리의 특성을 이해하는 것이 중요합니다.</li>
                                <li>임베디드 보드의 ROS 운용은 확장 가능성이 크고 다양한 분야에 쓰일 수 있어 보입니다.</li>
                                <li>ROS1 에는 없던 Interface(Service, Action)로 ROS2 에서 더 간편하고 안전한 통신이 가능합니다.</li>
                              </ul>
                            </div>

                            <div className="tag-row">
                              <span>ROS2</span><span>Micro-ROS</span><span>ESP32</span><span>PyQT</span>
                            </div>
                            <div className="detail-links">
                              <span className="chip-link muted">보안상 공개 불가</span>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/portfolio/zytron/architecture.jpg" alt="시스템 구성" loading="lazy" decoding="async" />
                                <figcaption>시스템 구성</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/zytron/gui.jpg" alt="상황판 GUI" loading="lazy" decoding="async" />
                                <figcaption>상황판 GUI</figcaption>
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
                            <p>
                              자율주행 시장 확대에 맞춰 카메라만으로 차량을 자율 주차시키는 프로그램을
                              만들었습니다. 자이트론 인턴 기간의 1인 프로젝트로 Camera Calibration 부터
                              경로 생성·추종 알고리즘과 PyGame GUI 까지 담당했습니다.
                            </p>
                            <ul>
                              <li>Camera Calibration 으로 얻은 Intrinsic Parameter 로 입력 영상의 왜곡 제거</li>
                              <li>왜곡을 제거한 이미지에서 AR-Tag 를 식별해 카메라의 현재 Pose 추정</li>
                              <li>Quintic-Polynomial 로 현재 Pose 에서 도착 Pose 까지의 경로 생성</li>
                              <li>Pure-Pursuit 로 경로를 추종하도록 제어하고 PyGame 으로 2D 시각화</li>
                            </ul>

                            <div className="detail-note">
                              <h4>문제 해결</h4>
                              <p>
                                <strong>문제</strong> AR-Tag 위치 추정이 제대로 되지 않고 오차가 5cm 이상 생기는 지점이 있었습니다.
                              </p>
                              <p>
                                <strong>해결</strong> Camera Calibration 의 입력 이미지가 부족했다고 판단해 30~40 장에서 80~100 장으로 두 배 이상 늘렸습니다. Calibration 에 한 시간 넘게 걸렸지만 오차 증상은 사라졌습니다.
                              </p>
                            </div>

                            <div className="detail-note">
                              <h4>회고</h4>
                              <ul>
                                <li>차량의 특성과 주행 환경을 고려한 경로 생성·추종 알고리즘 선택이 중요합니다.</li>
                                <li>모든 영상 처리 프로젝트의 시작은 Camera Calibration 이며, 그 시작이 가장 중요하다고 느꼈습니다.</li>
                              </ul>
                            </div>

                            <div className="tag-row">
                              <span>OpenCV</span><span>AR-Tag</span><span>Path Planning</span><span>Pygame</span>
                            </div>
                            <div className="detail-links">
                              <span className="chip-link muted">보안상 공개 불가</span>
                              <a className="chip-link youtube icon-link" href="https://www.youtube.com/watch?v=-GKsm9lfCZk" aria-label="자율 주차 프로그램 개발 Demo Video (새 창)" target="_blank" rel="noreferrer">Demo Video</a>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/portfolio/autopark/paths.jpg" alt="Pose 별 생성 경로" loading="lazy" decoding="async" />
                                <figcaption>Pose 별 생성 경로</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/autopark/sim.jpg" alt="2차원 시뮬레이션" loading="lazy" decoding="async" />
                                <figcaption>2차원 시뮬레이션</figcaption>
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
                            <p>
                              End-to-End 자율주행 모델인 PilotNet 의 단점을 보완하고 성능을 높이는 연구입니다.
                              앤씨앤 기술 자문으로 5인이 참여했고, 서버 기반 Visual-SLAM 개발과 YOLO·PilotNet
                              결합을 맡았습니다.
                            </p>
                            <ul>
                              <li>정확한 SLAM 처리를 위한 어안렌즈 Calibration</li>
                              <li>PilotNet 으로 경로를 학습해 조향값 예측</li>
                              <li>ORB-SLAM3 로 경로 지도를 만들고 실시간 위치 추정, 이후 주행에서 Relocalization</li>
                              <li>YOLO 로 보행자를 탐지하면 정지, 지정 경로를 벗어나면 정지</li>
                            </ul>

                            <div className="detail-note">
                              <h4>구조 개선</h4>
                              <p>
                                기존에는 차량용 노트북에서 모든 연산을 실행했습니다. 전방 영상을 TCP 로 서버에 보내 Visual-SLAM 을 수행하고 좌표만 회신받는 서버-클라이언트 구조로 바꿔 차량의 부하를 줄였고, 그 결과 실시간 자율주행이 가능해졌습니다.
                              </p>
                            </div>

                            <div className="tag-row">
                              <span>PilotNet</span><span>ORB-SLAM3</span><span>YOLOv5</span><span>TCP</span>
                            </div>
                            <div className="detail-links">
                              <a className="chip-link github icon-link" href="https://github.com/YooJuno/Autonomous-Driving_E2E_SLAM" aria-label="PilotNet 성능 향상을 위한 SLAM + YOLO GitHub (새 창)" target="_blank" rel="noreferrer">GitHub</a>
                              <a className="chip-link" href="https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11522374" aria-label="PilotNet 성능 향상을 위한 SLAM + YOLO 논문 (새 창)" target="_blank" rel="noreferrer">논문</a>
                              <a className="chip-link youtube icon-link" href="https://www.youtube.com/playlist?list=PLg3p47m-psINqF_8QVGMixhW7zAv6Ir2F" aria-label="PilotNet 성능 향상을 위한 SLAM + YOLO Demo Playlist (새 창)" target="_blank" rel="noreferrer">Demo Playlist</a>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/portfolio/pilotnet/architecture.jpg" alt="서버-클라이언트 구조" loading="lazy" decoding="async" />
                                <figcaption>서버-클라이언트 구조</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/pilotnet/slam-map.jpg" alt="ORB-SLAM3 3D 맵" loading="lazy" decoding="async" />
                                <figcaption>ORB-SLAM3 3D 맵</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/pilotnet/vehicle.jpg" alt="주행에 사용한 전동차" loading="lazy" decoding="async" />
                                <figcaption>주행에 사용한 전동차</figcaption>
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
                            <p>
                              공장 규모가 커지면서 작업자 관리 필요성이 높아진 배경에서, 영상만으로 작업자의
                              실시간 이동 경로를 확인했습니다. 포항산업과학기술원 산학 과제로 4인이 참여했고
                              Feature Extraction 과 Matching 알고리즘 최적화를 맡았습니다.
                            </p>
                            <ul>
                              <li>작업자 안전모에 부착한 360° 파노라마 카메라의 천장·전면 이미지로 위치 추정</li>
                              <li>현재 이미지와 이전 이미지를 매칭해 특징점이 움직인 거리 벡터로 이동 경로 계산</li>
                              <li>노이즈로 인한 오차를 보완하기 위해 사전 촬영한 DB 이미지와 비교해 위치 갱신</li>
                            </ul>

                            <div className="detail-note">
                              <h4>문제 해결</h4>
                              <p>
                                <strong>문제</strong> 공장은 빛이 적고 주변 모습이 서로 비슷해, 실제로 같은 위치가 아닌 엉뚱한 곳의 Feature 가 계속 매칭됐습니다.
                              </p>
                              <p>
                                <strong>해결</strong> 작업자의 이동 속도가 빠르지 않아 연속된 입력 이미지의 차이가 크지 않다는 점에 착안했습니다. 이전 이미지에서 추출한 Feature 위치의 일정 반경 안에서만 현재 Feature 를 찾는 Radius Matching 을 고안해 적용했고, 무분별하던 매칭쌍이 크게 줄어 유의미한 결과만 남았습니다.
                              </p>
                            </div>

                            <div className="detail-note">
                              <h4>성과</h4>
                              <ul>
                                <li>공장 내 특정 구간에서 실시간 추정한 위치가 실제 경로와 비슷한 양상을 보였습니다.</li>
                                <li>산학 과제 재계약 달성</li>
                              </ul>
                            </div>

                            <div className="tag-row">
                              <span>SIFT</span><span>RANSAC</span><span>Feature Matching</span>
                            </div>
                            <div className="detail-links">
                              <span className="chip-link muted">보안상 공개 불가</span>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/portfolio/rist/odometry.jpg" alt="Visual Odometry" loading="lazy" decoding="async" />
                                <figcaption>Visual Odometry</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/rist/radius-matching.jpg" alt="Radius Matching" loading="lazy" decoding="async" />
                                <figcaption>Radius Matching</figcaption>
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
                            <p>
                              가상화폐 거래 시장이 커지는 흐름에 맞춰, 사람의 개입 없이 수익을 내는 자동
                              매매 프로그램을 만들었습니다. 4인 팀의 팀장으로 주제 제안과 매매 조건·전략
                              수립, 딥러닝 모델 선정과 학습을 맡았습니다.
                            </p>
                            <ul>
                              <li>시계열 예측에 적합한 LSTM 으로 이전 데이터를 활용하지 못하는 RNN 의 단점 보완</li>
                              <li>학습 방식을 4가지로 나눠 비교 (1분봉 500·2000개, 10분봉 500개, 100분봉 2000개, Train:Test = 9:1)</li>
                              <li>전날 변동폭에 따라 매매하는 변동성 돌파 전략으로 높은 등락에 대비</li>
                              <li>10분 단위로 모델을 새로 학습하며 Upbit API 로 매매 실행</li>
                            </ul>

                            <div className="detail-note">
                              <h4>결과</h4>
                              <p>
                                리플은 이익, 도지는 손해를 봤습니다. 변동성 돌파 전략은 변동성이 클수록 유리한 특성이 있어, 변동성이 더 큰 리플에서 이익이 난 것으로 보입니다.
                              </p>
                            </div>

                            <div className="detail-note">
                              <h4>회고</h4>
                              <ul>
                                <li>암호화폐와 이 매매 전략의 특성상 높은 수익률을 기대하기는 어렵습니다.</li>
                                <li>종목의 호재·악재를 반영하기 어렵습니다.</li>
                                <li>종목마다 특성 차이가 뚜렷합니다.</li>
                                <li>암호화폐는 종가가 없어 변동성 돌파 전략을 적용하는 데 한계가 있습니다.</li>
                              </ul>
                            </div>

                            <div className="tag-row">
                              <span>LSTM</span><span>Upbit API</span><span>Python</span>
                            </div>
                            <div className="detail-links">
                              <a className="chip-link github icon-link" href="https://github.com/YooJuno/Upbit-Auto-Trader" aria-label="딥러닝 가상화폐 자동 매매 GitHub (새 창)" target="_blank" rel="noreferrer">GitHub</a>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/portfolio/trader/lstm.jpg" alt="LSTM 모델 구성" loading="lazy" decoding="async" />
                                <figcaption>LSTM 모델 구성</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/trader/strategy.jpg" alt="변동성 돌파 전략" loading="lazy" decoding="async" />
                                <figcaption>변동성 돌파 전략</figcaption>
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
                            <p>
                              서버 비동기 처리 방식의 수요가 늘어나는 흐름에서, 다중 사용자가 함께 플레이하는
                              온라인 Pacman 을 2인으로 만들었습니다. 게임 인터페이스 제작과 클라이언트 비동기
                              통신 설계를 맡았습니다.
                            </p>
                            <ul>
                              <li>서버: io_context 기반 이벤트 루프, 클라이언트별 Session 클래스로 연결 유지</li>
                              <li>비동기로 들어오는 키 입력을 처리하고 게임 상태를 브로드캐스트</li>
                              <li>클라이언트: 방향키 입력을 서버로 보내고 응답에 따라 OpenCV 로 UI 갱신</li>
                              <li>UI 와 네트워크 로직을 모듈로 분리해 유지보수성 확보</li>
                            </ul>

                            <div className="detail-note">
                              <h4>한계</h4>
                              <ul>
                                <li>메시지 패킷의 직렬화·압축이 없어 클라이언트가 많아지면 지연이 생길 수 있습니다.</li>
                                <li>단일 맵의 이동과 점수 처리만 구현했고 Ghost AI, 충돌, 레벨은 없습니다.</li>
                                <li>strand 만으로 동기화해 IOCP 기반의 고성능 확장성은 고려하지 않았습니다.</li>
                                <li>OpenCV UI 는 그래픽 성능과 애니메이션이 제한적이라 OpenGL 이나 SDL 로 확장할 여지가 있습니다.</li>
                              </ul>
                            </div>

                            <div className="tag-row">
                              <span>Boost ASIO</span><span>TCP</span><span>OpenCV</span>
                            </div>
                            <div className="detail-links">
                              <a className="chip-link github icon-link" href="https://github.com/YooJuno/PacmanGame-BoostASIO" aria-label="Online Pacman (Boost ASIO) GitHub (새 창)" target="_blank" rel="noreferrer">GitHub</a>
                              <a className="chip-link youtube icon-link" href="https://www.youtube.com/watch?v=2uh6XcFZric" aria-label="Online Pacman (Boost ASIO) Demo Video (새 창)" target="_blank" rel="noreferrer">Demo Video</a>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/portfolio/pacman/game.jpg" alt="게임 화면" loading="lazy" decoding="async" />
                                <figcaption>게임 화면</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/pacman/multi.jpg" alt="다중 클라이언트 동시 접속" loading="lazy" decoding="async" />
                                <figcaption>다중 클라이언트 동시 접속</figcaption>
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
                            <p>
                              딜레이 없는 건반과 스피커, LED 를 갖춘 임베디드 피아노 모듈을 4인 팀으로
                              만들었습니다. 피아노 회로 제작과 DMA+SPI 통신 개발을 맡아 LED 모듈 타이밍에
                              맞는 DMA 제어와 Bit Map Setup 을 담당했습니다.
                            </p>
                            <ul>
                              <li>mbed OS 로 STM32(NUCLEO-F411RE) 펌웨어 개발</li>
                              <li>건반을 누르면 WS2812 LED 가 해당 색으로 점등되고 피에조 부저에서 음 출력</li>
                              <li>PWM 으로 건반별 음을 생성</li>
                            </ul>

                            <div className="detail-note">
                              <h4>DMA 를 쓴 이유</h4>
                              <p>
                                일반적인 SPI 통신은 CPU 버스를 거치기 때문에 딜레이가 큽니다. SPI 에 DMA 를 결합해 CPU 개입 없이 LED 모듈로 데이터를 보내면서 실시간에 가까운 응답을 얻었습니다.
                              </p>
                            </div>

                            <div className="tag-row">
                              <span>STM32</span><span>mbed OS</span><span>DMA</span><span>SPI</span>
                            </div>
                            <div className="detail-links">
                              <a className="chip-link github icon-link" href="https://github.com/YooJuno/STM32-MBED/tree/main/Final" aria-label="STM32 기반 LED 피아노 GitHub (새 창)" target="_blank" rel="noreferrer">GitHub</a>
                              <a className="chip-link youtube icon-link" href="https://www.youtube.com/watch?v=sW-dLjTRV7A" aria-label="STM32 기반 LED 피아노 Demo Video (새 창)" target="_blank" rel="noreferrer">Demo Video</a>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/portfolio/stm32/architecture.jpg" alt="시스템 구성" loading="lazy" decoding="async" />
                                <figcaption>시스템 구성</figcaption>
                              </figure>
                              <figure className="media-tile">
                                <img src="/content/portfolio/stm32/board.jpg" alt="피아노 회로" loading="lazy" decoding="async" />
                                <figcaption>피아노 회로</figcaption>
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
                            <p>
                              객체를 인식해 그 앞까지 자율 주행하는 드론을 1인으로 만들었습니다. 객체 인식과
                              제어 최적화를 맡아, 대상을 정확히 인식하고 그 앞까지 자연스럽게 주행하도록
                              다듬었습니다.
                            </p>
                            <ul>
                              <li>OpenCV 의 HSV 변환과 Edge 검출로 대상 인식</li>
                              <li>YOLO 로 객체를 인식해 회피 주행</li>
                              <li>PID 제어로 객체 앞까지의 접근을 부드럽게 조절</li>
                              <li>Djitellopy 와 UDP 로 Tello 드론을 원격 조작</li>
                            </ul>
                            <div className="tag-row">
                              <span>OpenCV</span><span>YOLO</span><span>PID</span><span>djitellopy</span>
                            </div>
                            <div className="detail-links">
                              <span className="chip-link muted">보안상 공개 불가</span>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/portfolio/drone/tello.jpg" alt="사용한 Tello 드론" loading="lazy" decoding="async" />
                                <figcaption>사용한 Tello 드론</figcaption>
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
                            <p>
                              자이트론이 주관한 대회에서 카메라 영상만으로 트랙을 자율 주행했습니다. 3인 팀에서
                              조향 알고리즘 최적화를 맡아 부드러운 조향으로 주어진 트랙을 성공적으로 완주했습니다.
                            </p>
                            <ul>
                              <li>OpenCV 의 Hough 변환으로 차선 인식</li>
                              <li>PID 로 직선과 코너 모두에서 차선 중앙 주행 유지</li>
                              <li>YOLO 로 객체를 인식해 회피 주행</li>
                            </ul>
                            <div className="tag-row">
                              <span>OpenCV</span><span>PID</span><span>YOLO</span>
                            </div>
                            <div className="detail-links">
                              <span className="chip-link muted">보안상 공개 불가</span>
                            </div>
                            <div className="media-grid">
                              <figure className="media-tile">
                                <img src="/content/portfolio/modelcar/car.jpg" alt="모형차" loading="lazy" decoding="async" />
                                <figcaption>모형차</figcaption>
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
                          <a className="chip-link" href="https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11522374" aria-label="논문 링크 (새 창)" target="_blank" rel="noreferrer">논문 링크</a>
                          <a className="chip-link" href="/content/portfolio/pdfs/PilotNet 성능향상을 위한 SLAM과 YOLO 활용.pdf" aria-label="논문 PDF (새 창)" target="_blank" rel="noreferrer">논문 PDF</a>
                        </div>
                      </div>
                      <div className="mini-card">
                        <h3>수상</h3>
                        <p>캡스톤 디자인 페스티벌 우수상 (한동대학교, 2023.05)</p>
                        <a className="chip-link" href="/content/portfolio/pdfs/캡스톤 경진대회.pdf" aria-label="상장 PDF (새 창)" target="_blank" rel="noreferrer">상장 PDF</a>
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
                        <a className="btn ghost github icon-link" href="https://github.com/YooJuno" aria-label="유준호 GitHub (새 창)" target="_blank" rel="noreferrer">GitHub</a>
                        <a className="btn ghost youtube icon-link" href="https://youtube.com/@yoojuno" aria-label="유준호 YouTube (새 창)" target="_blank" rel="noreferrer">YouTube</a>
                        <a className="btn ghost" href="https://www.notion.so/1a9302636cd781059263e5b57e11fc70" aria-label="유준호 Notion 이력서 (새 창)" target="_blank" rel="noreferrer">Notion 이력서</a>
                      </div>
                    </div>
                  </div>
                </section>
              </main>
              {lightbox && (
                <div
                  className="lightbox"
                  role="dialog"
                  aria-modal="true"
                  aria-label={lightbox.alt || '이미지 확대 보기'}
                >
                  <div
                    className="lightbox-backdrop"
                    onClick={() => setLightbox(null)}
                    aria-hidden="true"
                  />
                  <figure className="lightbox-content">
                    <button
                      className="lightbox-close"
                      type="button"
                      ref={lightboxCloseRef}
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

