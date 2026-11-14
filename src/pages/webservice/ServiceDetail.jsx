import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import { getWebService } from '../../lib/webServices'
import GitHubMark from '../../components/GitHubMark'
import ScreenLightbox from '../../components/ScreenLightbox'
import '../../styles/pages/webservice.css'

function ServiceDetail({ serviceId }) {
  useDocumentTitle()
  const location = useLocation()
  const service = getWebService(serviceId)
  const localSource = service.sourceState === 'local'
  const reviewTime = service.reviewedAt
    ? `${new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(service.reviewedAt))} KST`
    : service.inspectedAt
  const [selectedScreen, setSelectedScreen] = useState(null)

  useEffect(() => {
    if (!location.hash) return
    let id
    try { id = decodeURIComponent(location.hash.slice(1)) } catch { return }
    const target = document.getElementById(id)
    if (target?.closest('.service-detail')) target.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, [serviceId, location.hash])

  const screenImageUrl = screen => service.reviewedAt
    ? `${screen.image}${screen.image.includes('?') ? '&' : '?'}v=${encodeURIComponent(service.reviewedAt)}`
    : screen.image

  return (
    <main className="section service-detail" id="main-content" tabIndex={-1}>
      <div className="container">
        <Link to="/web-service" className="service-back">← 웹서비스 목록</Link>
        <header className="service-detail-header">
          <div>
            <span className="service-availability">{service.availability}</span>
            <h1>{service.title}</h1>
            <p>{service.summary}</p>
            <div className="tag-row">{service.tech.map(technology => <span key={technology}>{technology}</span>)}</div>
          </div>
          <div className="service-actions">
            <a className="btn primary service-github" href={service.github} target="_blank" rel="noopener noreferrer"><GitHubMark /> GitHub 저장소 <span aria-hidden="true">↗</span></a>
            {service.site && <a className="btn service-live" href={service.site} target="_blank" rel="noopener noreferrer">{service.siteLabel || '서비스 열기'} ↗</a>}
            {service.downloadUrl && <a className="btn" href={service.downloadUrl} target="_blank" rel="noopener noreferrer">배포 파일 ↗</a>}
            <a className="service-text-link" href="#screens">화면 보기 ↓</a>
          </div>
        </header>

        <section className="service-section service-overview" aria-label="프로젝트 개요">
          {service.overview.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </section>

        <section className="service-section" id="screens" aria-labelledby="screens-heading">
          <div className="service-section-heading"><h2 id="screens-heading">화면 정의</h2><p>이미지를 눌러 확대할 수 있습니다.</p></div>
          <div className="service-screen-grid">
            {service.screens.map(screen => (
              <figure className="service-screen" key={screen.id}>
                <div className="service-screen-heading"><span>{screen.id}</span><h3>{screen.title}</h3></div>
                <button className="service-screen-image" type="button" onClick={() => setSelectedScreen(screen)} aria-label={`${screen.title} 화면 확대`}>
                  <img src={screenImageUrl(screen)} width={screen.width} height={screen.height} alt={screen.alt} loading="lazy" decoding="async" />
                  <span>확대 ↗</span>
                </button>
                <figcaption>{screen.caption}</figcaption>
                {screen.annotations.length > 0 && <ol>{screen.annotations.map(annotation => <li key={annotation}>{annotation}</li>)}</ol>}
              </figure>
            ))}
          </div>
        </section>

        <section className="service-section" aria-labelledby="features-heading">
          <div className="service-section-heading"><h2 id="features-heading">주요 기능</h2></div>
          <div className="service-feature-grid">{service.features.map(feature => <article key={feature.title}><h3>{feature.title}</h3><p>{feature.description}</p></article>)}</div>
        </section>

        <section className="service-section" aria-labelledby="architecture-heading">
          <div className="service-section-heading"><h2 id="architecture-heading">시스템 구조</h2></div>
          <ul className="service-architecture">{service.architecture.map(node => <li key={node.label}><strong>{node.label}</strong><span>{node.detail}</span></li>)}</ul>
          {service.architectureNote && <p className="service-architecture-note">{service.architectureNote}</p>}
        </section>

        {service.api?.length > 0 && <section className="service-section" id="api" aria-labelledby="api-heading">
          <div className="service-section-heading"><h2 id="api-heading">{service.apiTitle || 'API 명세'}</h2><p>{service.apiNote}</p></div>
          <div className="service-api-scroll" role="region" aria-label="API 명세 표" tabIndex="0">
            <table className="service-api"><thead><tr><th scope="col">동작</th><th scope="col">인터페이스·역할</th><th scope="col">입력 → 출력</th><th scope="col">접근·주의사항</th></tr></thead><tbody>{service.api.map(endpoint => <tr key={`${endpoint.method}-${endpoint.path}`}><td><span className={`service-method method-${endpoint.method.toLowerCase()}`}>{endpoint.method}</span></td><td><code>{endpoint.path}</code><p>{endpoint.description}</p></td><td><span className="service-api-label">입력</span><p>{endpoint.request}</p><span className="service-api-label">출력</span><p>{endpoint.response}</p></td><td>{endpoint.access}</td></tr>)}</tbody></table>
          </div>
        </section>}

        <div className="service-notes-grid">
          <section className="service-section" aria-labelledby="design-heading"><div className="service-section-heading"><h2 id="design-heading">설계 포인트</h2></div>{service.decisions.map(decision => <article className="service-decision" key={decision.title}><h3>{decision.title}</h3><p>{decision.description}</p></article>)}</section>
          <section className="service-section" aria-labelledby="limits-heading"><div className="service-section-heading"><h2 id="limits-heading">검증 범위와 한계</h2></div><ul className="service-limit-list">{service.limitations.map(limitation => <li key={limitation}>{limitation}</li>)}</ul></section>
        </div>

        <section className="service-section service-sources" aria-labelledby="source-heading">
          <div className="service-section-heading">
            <h2 id="source-heading">소스 코드</h2>
            <p>최종 검토 <time dateTime={service.reviewedAt || service.inspectedAt}>{reviewTime}</time>{localSource ? ' · 로컬 수정본' : ''}{service.revision ? ` · ${localSource ? '기준 HEAD' : '기준 커밋'} ${service.revision}` : ''}</p>
          </div>
          {service.sourceNote && <p className="service-architecture-note">{service.sourceNote}</p>}
          <div className="service-source-links">
            {service.sources.map(source => localSource
              ? <span className="service-source-pending" key={source.path} title={source.path}>{source.label}<small>로컬</small></span>
              : <a key={source.path} href={`${service.github}/blob/${service.revision || 'main'}/${source.path}`} target="_blank" rel="noopener noreferrer" title={source.path}>{source.label} ↗</a>)}
          </div>
        </section>
      </div>

      <ScreenLightbox screen={selectedScreen ? { ...selectedScreen, image: screenImageUrl(selectedScreen) } : null} onClose={() => setSelectedScreen(null)} />
    </main>
  )
}

export default ServiceDetail
