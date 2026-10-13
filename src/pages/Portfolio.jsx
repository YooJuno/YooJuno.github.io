import { Children, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useReveal from '../hooks/useReveal'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { EXPERIENCES, PROFILE_FACTS, SUPPLEMENTARY_RECORDS } from '../content/portfolio'
import '../styles/pages/portfolio.css'

const SECTIONS = [
  { id: 'about', label: '소개' },
  { id: 'career', label: '경력' },
  { id: 'project-library', label: '프로젝트' },
]


const scrollToTarget = (target) => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' })
}

const getAnchorId = (hash) => {
  const id = hash.slice(1)
  try {
    return decodeURIComponent(id)
  } catch {
    return id
  }
}

// id 문자열을 CSS 선택자로 조합하지 않고 조회한다.
// querySelector(`#${id}`)는 CSS 식별자로 유효하지 않은 값(예: 숫자로 시작하는 "1")에서
// DOMException을 던지고, 이 예외가 useEffect 안에서 발생하면 앱 전체가 언마운트된다.
const findInContainer = (container, id) => {
  if (!container || !id) return null
  const target = document.getElementById(id)
  return target && container.contains(target) ? target : null
}

function ExperienceEntry({ experience }) {
  const isCurrent = !experience.end
  const hasDetails = Boolean(experience.summary || experience.responsibilities.length || experience.hardware.length)
  const Card = hasDetails ? 'details' : 'article'
  const Heading = hasDetails ? 'summary' : 'div'

  return (
    <li className={`career-entry${isCurrent ? ' is-current' : ''}`} id={experience.id === 'experience-ssafy' ? 'experience' : undefined}>
      <div className="career-period">
        <span className={`career-status${isCurrent ? ' is-current' : ''}`}>
          <span aria-hidden="true" />{isCurrent ? '재직 중' : experience.type}
        </span>
        <p>
          <time dateTime={experience.start} title={experience.start.replaceAll('-', '.')}>{experience.start.slice(0, 7).replace('-', '.')}</time>
          <span aria-hidden="true"> — </span>
          {experience.end ? <time dateTime={experience.end} title={experience.end.replaceAll('-', '.')}>{experience.end.slice(0, 7).replace('-', '.')}</time> : '현재'}
        </p>
      </div>
      <Card className="career-card" id={experience.id}>
        <Heading className="career-card-heading" data-reveal>
          <div>
            <h3>{experience.organization}</h3>
            <p className="career-team">{experience.role}</p>
          </div>
          {hasDetails && (
            <span className="career-card-action">
              <span className="career-action-closed">상세</span>
              <span className="career-action-open">접기</span>
              <span className="career-chevron" aria-hidden="true" />
            </span>
          )}
        </Heading>
        {hasDetails && (
          <div className="career-card-body">
            {experience.summary && <p className="career-summary">{experience.summary}</p>}
            {experience.responsibilities.length > 0 && (
              <div className="career-responsibilities">
                {experience.responsibilities.map((responsibility) => (
                  <div key={responsibility.title}>
                    <h4>{responsibility.title}</h4>
                    <p>{responsibility.description}</p>
                  </div>
                ))}
              </div>
            )}
            {experience.hardware.length > 0 && (
              <div className="career-hardware">
                <h4>로봇·센서 통합 경험</h4>
                <ul>
                  {experience.hardware.map((hardware) => <li key={hardware}>{hardware}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>
    </li>
  )
}

function ProjectEntry({ id, title, start, end, meta, children }) {
  const endLabel = start.slice(0, 4) === end.slice(0, 4) ? end.slice(5) : end.replace('-', '.')

  return (
    <details className="project-detail" id={id}>
      <summary>
        <span className="title">{title}</span>
        <span className="meta">
          <time dateTime={start}>{start.replace('-', '.')}</time>–<time dateTime={end}>{endLabel}</time> · {meta}
        </span>
      </summary>
      {children}
    </details>
  )
}

function ProjectLibrary({ children }) {
  const projects = Children.toArray(children).sort((left, right) => (
    right.props.start.localeCompare(left.props.start) || right.props.end.localeCompare(left.props.end)
  ))

  return <div className="project-list">{projects}</div>
}

function Portfolio() {
  const containerRef = useRef(null)
  const lightboxCloseRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [lightbox, setLightbox] = useState(null)
  const [activeSectionId, setActiveSectionId] = useState('')
  useReveal()
  useDocumentTitle()
  const getSectionClass = (id) => (
    activeSectionId === id ? 'index-link is-active' : 'index-link'
  )

  useEffect(() => {
    const navigation = containerRef.current?.querySelector('.portfolio-section-nav .container')
    const activeLink = navigation?.querySelector('[aria-current="location"]')
    if (!navigation || !activeLink || navigation.scrollWidth <= navigation.clientWidth) return
    const navigationBounds = navigation.getBoundingClientRect()
    const linkBounds = activeLink.getBoundingClientRect()
    let shift = 0
    if (linkBounds.left < navigationBounds.left + 16) {
      shift = linkBounds.left - navigationBounds.left - 16
    } else if (linkBounds.right > navigationBounds.right - 16) {
      shift = linkBounds.right - navigationBounds.right + 16
    }
    if (shift) navigation.scrollBy({ left: shift, behavior: 'instant' })
  }, [activeSectionId])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const openImage = (image) => {
      const src = image.currentSrc || image.src
      if (!src) return
      image.focus({ preventScroll: true })
      setLightbox({ src, alt: image.alt || '프로젝트 이미지', hasAlt: Boolean(image.alt) })
    }

    container.querySelectorAll('.media-tile img').forEach((image) => {
      image.tabIndex = 0
      image.setAttribute('role', 'button')
      image.setAttribute('aria-label', `${image.alt || '프로젝트 이미지'} 확대 보기`)
    })

    const navigateToTarget = (url) => {
      url.searchParams.delete('section')
      const destination = `${url.pathname}${url.search}${url.hash}`
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
      navigate(destination, { preventScrollReset: true, replace: destination === current })
    }

    const handleClick = (event) => {
      const image = event.target.closest('.media-tile img')
      if (image) {
        event.preventDefault()
        openImage(image)
        return
      }
      const summary = event.target.closest('.project-detail > summary')
      if (summary && !summary.parentElement.open && !event.defaultPrevented && event.button === 0) {
        event.preventDefault()
        const url = new URL(window.location.href)
        url.hash = summary.parentElement.id
        navigateToTarget(url)
        return
      }
      const link = event.target.closest('a[href^="#"]')
      if (!link) return
      if (event.defaultPrevented || event.button !== 0
        || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
        || link.target || link.hasAttribute('download')) return
      const href = link.getAttribute('href')
      if (!href || href.length < 2) return
      const target = findInContainer(container, getAnchorId(href))
      if (!target) return
      event.preventDefault()
      navigateToTarget(new URL(link.href))
    }

    const handleImageKey = (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      if (!event.target.matches('.media-tile img')) return
      event.preventDefault()
      openImage(event.target)
    }

    container.addEventListener('click', handleClick)
    container.addEventListener('keydown', handleImageKey)
    return () => {
      container.removeEventListener('click', handleClick)
      container.removeEventListener('keydown', handleImageKey)
    }
  }, [navigate])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    const targets = SECTIONS.map(({ id }) => findInContainer(container, id)).filter(Boolean)
    if (!targets.length) return undefined

    let animationFrame
    const updateActiveSection = () => {
      const navigation = container.querySelector('.portfolio-section-nav')
      const siteNavigation = document.querySelector('.site-nav')
      const offset = (siteNavigation?.getBoundingClientRect().bottom || 68)
        + (navigation?.getBoundingClientRect().height || 58) + 40
      const passed = targets.filter((target) => target.getBoundingClientRect().top <= offset)
      const isAtBottom = window.scrollY > 0
        && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
      const active = isAtBottom ? targets[targets.length - 1] : passed[passed.length - 1] || targets[0]
      setActiveSectionId(active.id)
      animationFrame = undefined
    }

    const scheduleUpdate = () => {
      if (animationFrame === undefined) {
        animationFrame = window.requestAnimationFrame(updateActiveSection)
      }
    }

    updateActiveSection()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame)
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
    const requestedSection = location.hash ? getAnchorId(location.hash) : params.get('section')
    const section = requestedSection === 'skills' ? 'project-library' : requestedSection
    if (!section) return undefined
    const container = containerRef.current
    if (!container) return undefined
    const target = findInContainer(container, section)
    if (!target) return undefined
    let ancestor = target.parentElement?.closest('details')
    while (ancestor) {
      ancestor.setAttribute('open', '')
      ancestor = ancestor.parentElement?.closest('details')
    }
    const disclosure = target.tagName.toLowerCase() === 'details'
      ? target : target.querySelector(':scope > details.career-card')
    let focusTimeout
    if (disclosure) {
      disclosure.setAttribute('open', '')
      disclosure.classList.add('is-focus')
      focusTimeout = window.setTimeout(() => disclosure.classList.remove('is-focus'), 1200)
    }
    const animationFrame = window.requestAnimationFrame(() => scrollToTarget(target))
    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(focusTimeout)
      disclosure?.classList.remove('is-focus')
    }
  }, [location.pathname, location.search, location.hash, location.key])

  return (
    <div className="portfolio-page" id="top" ref={containerRef}>
      <header className="site-hero portfolio-hero" id="about">
                <div className="container hero-grid">
                  <div className="hero-text" data-reveal>
                    <p className="eyebrow">Robotics & Autonomous Navigation</p>
                    <h1>유준호 <span>자율주행 로봇 개발자</span></h1>
                    <p className="lead">
                      3D SLAM과 Navigation부터 로봇·센서 통합, 배포까지.<br />
                      현장에서 동작하는 자율주행 시스템을 개발합니다.
                    </p>
                  </div>
                  <aside className="hero-contact" id="contact" aria-label="연락처 및 자료">
                    <div className="hero-contact-info">
                      <a className="hero-contact-email" href="mailto:juno980220@naver.com">juno980220@naver.com</a>
                      <div className="hero-contact-meta">
                        <span>Seoul, KR</span>
                        <a href="tel:+821037926395">010-3792-6395</a>
                      </div>
                    </div>
                    <div className="hero-contact-links">
                      <div className="hero-contact-documents">
                        <a href="https://drive.google.com/file/d/1y7LPIIS0l29_i8YyJnJLn30aqanMp_hG/view?usp=drive_link" aria-label="이력서 PDF (새 창)" target="_blank" rel="noreferrer">이력서 PDF <span aria-hidden="true">↗</span></a>
                        <a href="https://drive.google.com/file/d/1TZL7Uzh63LOdcYgKJznvCYh8l3yT4oa0/view?usp=drive_link" aria-label="포트폴리오 PDF (새 창)" target="_blank" rel="noreferrer">포트폴리오 PDF <span aria-hidden="true">↗</span></a>
                      </div>
                      <ul className="hero-contact-profiles">
                        <li>
                          <a href="https://github.com/YooJuno" aria-label="유준호 GitHub (새 창)" target="_blank" rel="noreferrer">
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 .5C5.4.5 0 5.9 0 12.5c0 5.3 3.4 9.8 8.1 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.2-1.1-1.6-1.1-1.6-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.3-2.7-.3-5.5-1.4-5.5-6.1 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.7.2 3 .1 3.3.8.9 1.2 1.9 1.2 3.2 0 4.7-2.9 5.8-5.6 6.1.4.4.8 1 .8 2v3c0 .3.2.7.8.6 4.7-1.6 8.1-6.1 8.1-11.4C24 5.9 18.6.5 12 .5z" /></svg>
                            <span className="profile-tooltip" aria-hidden="true">GitHub</span>
                          </a>
                        </li>
                        <li>
                          <a href="https://youtube.com/@yoojuno" aria-label="유준호 YouTube (새 창)" target="_blank" rel="noreferrer">
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M23.2 7.2a3 3 0 0 0-2.1-2.1C19.2 4.6 12 4.6 12 4.6s-7.2 0-9.1.5A3 3 0 0 0 .8 7.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .8 4.8 3 3 0 0 0 2.1 2.1c1.9.5 9.1.5 9.1.5s7.2 0 9.1-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.8-4.8zM9.6 15.5v-7l6.1 3.5-6.1 3.5z" /></svg>
                            <span className="profile-tooltip" aria-hidden="true">YouTube</span>
                          </a>
                        </li>
                        <li>
                          <a href="https://www.notion.so/1a9302636cd781059263e5b57e11fc70" aria-label="유준호 Notion 이력서 (새 창)" target="_blank" rel="noreferrer">
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" /></svg>
                            <span className="profile-tooltip" aria-hidden="true">Notion 이력서</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </aside>
                </div>
              </header>

              <nav className="portfolio-section-nav" aria-label="포트폴리오 목차">
                <div className="container">
                  {SECTIONS.map(({ id, label }) => (
                    <a key={id} className={getSectionClass(id)} href={`#${id}`} aria-current={activeSectionId === id ? 'location' : undefined}>
                      {label}
                    </a>
                  ))}
                </div>
              </nav>

              <main className="portfolio-main">
                <section className="section career-section" id="career" aria-labelledby="career-heading">
                  <div className="container">
                    <div className="section-head" data-reveal>
                      <p className="portfolio-kicker">EXPERIENCES</p>
                      <h2 id="career-heading">경력</h2>
                      <p>실무부터 인턴십, 연구·교육까지 이어온 경험입니다.</p>
                    </div>
                    <ol className="career-timeline">
                      {EXPERIENCES.map((experience) => <ExperienceEntry experience={experience} key={experience.id} />)}
                    </ol>
                    <div className="portfolio-supplements">
                      <details className="portfolio-supplement" id="activities">
                        <summary className="career-card-heading" data-reveal>
                          <div>
                            <h3 id="experience-publications-heading">논문·수상·활동</h3>
                            <p>연구 성과와 교육·조교 활동</p>
                          </div>
                          <span className="career-card-action">
                            <span className="career-action-closed">보기</span>
                            <span className="career-action-open">접기</span>
                            <span className="career-chevron" aria-hidden="true" />
                          </span>
                        </summary>
                        <ul className="supplement-list">
                          {SUPPLEMENTARY_RECORDS.map((record) => (
                            <li key={record.title}>
                              <span className="supplement-kind">{record.kind}</span>
                              <div>
                                <h4>{record.title}</h4>
                                {record.meta && <p className="supplement-meta">{record.meta}</p>}
                                {record.description && <p>{record.description}</p>}
                                {record.links.length > 0 && (
                                  <div className="detail-links">
                                    {record.links.map((link) => (
                                      <a className="chip-link" href={link.href} key={link.href} aria-label={link.label + ' (새 창)'} target="_blank" rel="noreferrer">{link.label}</a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </details>
                      <details className="portfolio-supplement" id="background">
                        <summary className="career-card-heading" data-reveal>
                          <div>
                            <h3>학력·기본 정보</h3>
                            <p>학력·교육, 어학·자격 및 병역</p>
                          </div>
                          <span className="career-card-action">
                            <span className="career-action-closed">보기</span>
                            <span className="career-action-open">접기</span>
                            <span className="career-chevron" aria-hidden="true" />
                          </span>
                        </summary>
                        <div className="supplement-profile">
                          <dl className="profile-facts">
                            {PROFILE_FACTS.map((fact) => (
                              <div key={fact.label}>
                                <dt>{fact.label}</dt>
                                <dd><span>{fact.value}</span><span className="profile-period">{fact.period}</span></dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      </details>
                    </div>
                  </div>
                </section>
                <section className="section" id="project-library">
                  <div className="container">
                    <div className="section-head" data-reveal>
                      <p className="portfolio-kicker">PROJECTS</p>
                      <h2>프로젝트</h2>
                      <p>최신 프로젝트부터 시간순으로 정리했습니다. 제목을 눌러 구현 과정과 결과를 확인하세요.</p>
                    </div>
                    <ProjectLibrary>
                        <ProjectEntry id="proj-hangang" title="한강 자율주행 배달 로봇 LiNKY"
                          start="2025-07" end="2025-08" meta="SSAFY · 6인 · 팀장/PM/Robotics">
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
                        </ProjectEntry>

                        <ProjectEntry id="proj-smart-factory" title="스마트 팩토리 로봇팔 자동화 & 디지털 트윈"
                          start="2025-04" end="2025-05" meta="SSAFY · 3인 · 팀장/PM">
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
                        </ProjectEntry>

                        <ProjectEntry id="proj-autopark" title="자율 주차 프로그램 개발"
                          start="2023-09" end="2023-10" meta="자이트론 · 1인">
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
                        </ProjectEntry>

                        <ProjectEntry id="proj-pilotnet" title="PilotNet 성능 향상을 위한 SLAM + YOLO"
                          start="2022-07" end="2023-06" meta="5인">
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
                        </ProjectEntry>

                        <ProjectEntry id="proj-zytron-control" title="자율주행 경기장 관제 시스템"
                          start="2023-11" end="2023-12" meta="자이트론 · 1인">
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
                        </ProjectEntry>

                        <ProjectEntry id="proj-modelcar" title="모형차 자율 주행 경진대회"
                          start="2021-07" end="2021-08" meta="3인">
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
                        </ProjectEntry>

                        <ProjectEntry id="proj-drone" title="영상 처리 기반 자율 주행 드론"
                          start="2021-11" end="2021-12" meta="1인">
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
                        </ProjectEntry>

                        <ProjectEntry id="proj-cctv-speed" title="CCTV 영상 내 차량 속도 추정"
                          start="2024-04" end="2024-06" meta="산학 과제 · 5인">
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
                        </ProjectEntry>

                        <ProjectEntry id="proj-cctv-height" title="CCTV 영상 내 객체 높이 추정"
                          start="2024-01" end="2024-04" meta="산학 과제">
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
                        </ProjectEntry>

                        <ProjectEntry id="proj-blackbox-speed" title="블랙박스 영상 속도 추정"
                          start="2024-07" end="2024-08" meta="인턴 · 1인">
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
                        </ProjectEntry>

                        <ProjectEntry id="proj-rist" title="파노라마 카메라 작업자 위치 추정"
                          start="2022-09" end="2023-02" meta="RIST 산학 · 4인">
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
                        </ProjectEntry>

                        <ProjectEntry id="proj-cctv-halow" title="무선 CCTV 웹 스트리밍 (Wi-Fi HaLow)"
                          start="2024-01" end="2024-02" meta="4인">
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
                        </ProjectEntry>

                        <ProjectEntry id="proj-stm32" title="STM32 기반 LED 피아노"
                          start="2023-04" end="2023-06" meta="4인">
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
                        </ProjectEntry>

                        <ProjectEntry id="proj-ssaweb" title="로봇 센서·영상 실시간 분석 웹"
                          start="2025-02" end="2025-03" meta="SSAFY · 1인">
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
                        </ProjectEntry>

                        <ProjectEntry id="proj-pacman" title="Online Pacman (Boost ASIO)"
                          start="2023-05" end="2023-06" meta="2인">
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
                        </ProjectEntry>

                        <ProjectEntry id="proj-trader" title="딥러닝 가상화폐 자동 매매"
                          start="2023-05" end="2023-06" meta="4인 · 팀장">
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
                        </ProjectEntry>
                    </ProjectLibrary>
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

