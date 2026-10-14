import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import { getWebService } from '../../lib/webServices'
import '../../styles/pages/webservice.css'

export function GitHubMark() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.4-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.57 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.13-1.45 3.07-1.15 3.07-1.15.62 1.55.23 2.7.12 2.98.72.79 1.15 1.79 1.15 3.02 0 4.33-2.63 5.29-5.14 5.57.4.35.76 1.03.76 2.08v3.09c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" /></svg>
}

function ServiceDetail({ serviceId }) {
  useDocumentTitle()
  const service = getWebService(serviceId)
  const dialog = useRef(null)
  const [selectedScreen, setSelectedScreen] = useState(null)

  const openScreen = screen => {
    setSelectedScreen(screen)
    dialog.current.showModal()
  }

  return (
    <main className="section service-detail">
      <div className="container">
        <Link to="/web-service" className="service-back">← 웹서비스 목록</Link>
        <header className="service-detail-header">
          <div>
            <span className="service-status">{service.status}</span>
            <h1>{service.title}</h1>
            <p>{service.summary}</p>
            <div className="tag-row">{service.tech.map(technology => <span key={technology}>{technology}</span>)}</div>
          </div>
          <div className="service-actions">
            <a className="btn primary service-github" href={service.github} target="_blank" rel="noopener noreferrer"><GitHubMark /> GitHub 저장소 <span aria-hidden="true">↗</span></a>
            {service.site ? <a className="btn service-live" href={service.site} target="_blank" rel="noopener noreferrer">서비스 열기 ↗</a> : <p className="service-deployment-note">배포 주소는 확정 후 추가합니다.</p>}
            <a className="service-text-link" href="#screens">화면 보기 ↓</a>
          </div>
        </header>

        <section className="service-section service-overview" aria-label="프로젝트 개요">
          {service.overview.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </section>

        <section className="service-section" id="screens" aria-labelledby="screens-heading">
          <div className="service-section-heading"><h2 id="screens-heading">화면 정의</h2><p>이미지를 누르면 원본 크기로 확인할 수 있습니다.</p></div>
          <div className="service-screen-grid">
            {service.screens.map(screen => (
              <figure className="service-screen" key={screen.id}>
                <div className="service-screen-heading"><span>{screen.id}</span><h3>{screen.title}</h3></div>
                <button className="service-screen-image" onClick={() => openScreen(screen)} aria-label={`${screen.title} 화면 확대`}>
                  <img src={screen.image} width={screen.width} height={screen.height} alt={screen.alt} loading="lazy" decoding="async" />
                  <span>확대 ↗</span>
                </button>
                <figcaption>{screen.caption}</figcaption>
                <ol>{screen.annotations.map(annotation => <li key={annotation}>{annotation}</li>)}</ol>
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

        <section className="service-section" id="api" aria-labelledby="api-heading">
          <div className="service-section-heading"><h2 id="api-heading">{service.apiTitle || 'API 명세'}</h2><p>{service.apiNote}</p></div>
          <div className="service-api-scroll" role="region" aria-label="API 명세 표" tabIndex="0">
            <table className="service-api"><thead><tr><th scope="col">동작</th><th scope="col">인터페이스·역할</th><th scope="col">입력 → 출력</th><th scope="col">접근·주의사항</th></tr></thead><tbody>{service.api.map(endpoint => <tr key={`${endpoint.method}-${endpoint.path}`}><td><span className={`service-method method-${endpoint.method.toLowerCase()}`}>{endpoint.method}</span></td><td><code>{endpoint.path}</code><p>{endpoint.description}</p></td><td><span className="service-api-label">입력</span><p>{endpoint.request}</p><span className="service-api-label">출력</span><p>{endpoint.response}</p></td><td>{endpoint.access}</td></tr>)}</tbody></table>
          </div>
        </section>

        <div className="service-notes-grid">
          <section className="service-section" aria-labelledby="design-heading"><div className="service-section-heading"><h2 id="design-heading">설계 포인트</h2></div>{service.decisions.map(decision => <article className="service-decision" key={decision.title}><h3>{decision.title}</h3><p>{decision.description}</p></article>)}</section>
          <section className="service-section" aria-labelledby="limits-heading"><div className="service-section-heading"><h2 id="limits-heading">검증 범위와 한계</h2></div><ul className="service-limit-list">{service.limitations.map(limitation => <li key={limitation}>{limitation}</li>)}</ul></section>
        </div>

        <section className="service-section service-sources" aria-labelledby="source-heading"><div className="service-section-heading"><h2 id="source-heading">소스 코드</h2><p>확인일 {service.inspectedAt}{service.revision ? ` · 기준 커밋 ${service.revision}` : ''}</p></div><div className="service-source-links">{service.sources.map(source => <a key={source.path} href={`${service.github}/blob/${service.revision || 'main'}/${source.path}`} target="_blank" rel="noopener noreferrer" title={source.path}>{source.label} ↗</a>)}</div></section>
      </div>

      <dialog className="service-lightbox" ref={dialog} aria-labelledby="lightbox-heading" onClick={event => { if (event.target === dialog.current) dialog.current.close() }}>
        <div className="service-lightbox-toolbar"><h2 id="lightbox-heading">{selectedScreen?.title || '화면 확대'}</h2><button type="button" onClick={() => dialog.current.close()} aria-label="확대 화면 닫기">닫기 ×</button></div>
        {selectedScreen && <><img src={selectedScreen.image} width={selectedScreen.width} height={selectedScreen.height} alt={selectedScreen.alt} /><p>{selectedScreen.caption}</p></>}
      </dialog>
    </main>
  )
}

export default ServiceDetail
