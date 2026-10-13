import { Fragment, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useReveal from '../hooks/useReveal'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { EXPERIENCES, PROFILE, PROFILE_FACTS, PROJECTS, SUPPLEMENTARY_RECORDS } from '../lib/portfolio'
import '../styles/pages/portfolio.css'

const SECTIONS = [
  { id: 'about', label: '소개' },
  { id: 'career', label: '경력' },
  { id: 'project-library', label: '프로젝트' },
]

const PROFILE_ICONS = {
  "github": "M12 .5C5.4.5 0 5.9 0 12.5c0 5.3 3.4 9.8 8.1 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.2-1.1-1.6-1.1-1.6-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.3-2.7-.3-5.5-1.4-5.5-6.1 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.7.2 3 .1 3.3.8.9 1.2 1.9 1.2 3.2 0 4.7-2.9 5.8-5.6 6.1.4.4.8 1 .8 2v3c0 .3.2.7.8.6 4.7-1.6 8.1-6.1 8.1-11.4C24 5.9 18.6.5 12 .5z",
  "youtube": "M23.2 7.2a3 3 0 0 0-2.1-2.1C19.2 4.6 12 4.6 12 4.6s-7.2 0-9.1.5A3 3 0 0 0 .8 7.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .8 4.8 3 3 0 0 0 2.1 2.1c1.9.5 9.1.5 9.1.5s7.2 0 9.1-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.8-4.8zM9.6 15.5v-7l6.1 3.5-6.1 3.5z",
  "notion": "M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"
}

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
  const hasDetails = Boolean(experience.summary || experience.html || experience.hardware.length)
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
            {experience.html && (
              <div className="career-responsibilities portfolio-markdown" dangerouslySetInnerHTML={{ __html: experience.html }} />
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

function ProjectEntry({ project }) {
  const { id, title, start, end, meta, html } = project
  const endLabel = start.slice(0, 4) === end.slice(0, 4) ? end.slice(5) : end.replace('-', '.')

  return (
    <details className="project-detail" id={id}>
      <summary>
        <span className="title">{title}</span>
        <span className="meta">
          <time dateTime={start}>{start.replace('-', '.')}</time>–<time dateTime={end}>{endLabel}</time> · {meta}
        </span>
      </summary>
      <div className="detail-body portfolio-markdown" dangerouslySetInnerHTML={{ __html: html }} />
    </details>
  )
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
                    <h1>{PROFILE.name} <span>{PROFILE.role}</span></h1>
                    <p className="lead">
                      {PROFILE.intro.map((line, lineIndex) => (
                        <Fragment key={lineIndex}>{lineIndex > 0 && <br />}{line}</Fragment>
                      ))}
                    </p>
                  </div>
                  <aside className="hero-contact" id="contact" aria-label="연락처 및 자료">
                    <div className="hero-contact-info">
                      <a className="hero-contact-email" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
                      <div className="hero-contact-meta">
                        <span>{PROFILE.location}</span>
                        <a href={PROFILE.phoneHref}>{PROFILE.phone}</a>
                      </div>
                    </div>
                    <div className="hero-contact-links">
                      <div className="hero-contact-documents">
                        {PROFILE.documents.map(link => (
                          <a key={link.href} href={link.href} aria-label={`${link.label} (새 창)`} target="_blank" rel="noreferrer">{link.label} <span aria-hidden="true">↗</span></a>
                        ))}
                      </div>
                      <ul className="hero-contact-profiles">
                        {PROFILE.profiles.map(link => (
                          <li key={link.href}>
                            <a href={link.href} aria-label={`${PROFILE.name} ${link.label} (새 창)`} target="_blank" rel="noreferrer">
                              {PROFILE_ICONS[link.icon] ? (
                                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={PROFILE_ICONS[link.icon]} /></svg>
                              ) : <span aria-hidden="true">↗</span>}
                              <span className="profile-tooltip" aria-hidden="true">{link.label}</span>
                            </a>
                          </li>
                        ))}
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
                      <h2>프로젝트</h2>
                      <p>최신 프로젝트부터 시간순으로 정리했습니다. 제목을 눌러 구현 과정과 결과를 확인하세요.</p>
                    </div>
                    <div className="project-list">
                      {PROJECTS.map(project => <ProjectEntry key={project.id} project={project} />)}
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

