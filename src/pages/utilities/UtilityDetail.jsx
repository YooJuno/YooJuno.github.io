import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getUtility, utilities } from '../../lib/utilities'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import GitHubMark from '../../components/GitHubMark'
import UtilityGallery from './UtilityGallery'
import NotFound from '../NotFound'
import '../../styles/pages/webservice.css'
import '../../styles/pages/utilities.css'

function UtilityArticle({ utility }) {
  const location = useLocation()
  const index = utilities.indexOf(utility)
  const previous = utilities[index - 1]
  const next = utilities[index + 1]
  useDocumentTitle()

  useEffect(() => {
    if (!location.hash) return
    let id
    try { id = decodeURIComponent(location.hash.slice(1)) } catch { return }
    const target = document.getElementById(id)
    if (target?.closest('.utility-detail')) {
      if (target.matches('details')) target.open = true
      target.scrollIntoView({ behavior: 'instant', block: 'start' })
    }
  }, [location.hash])

  return (
    <main className="section utility-detail" id="main-content" tabIndex={-1}>
      <div className="container">
        <Link to="/utilities" className="utility-back">← 유틸리티 목록</Link>
        <header className="utility-header">
          <h1>{utility.title}</h1>
          <p className="utility-summary">{utility.summary}</p>
          <div className="utility-header-actions">
            {utility.site && <a className="btn primary" href={utility.site} target="_blank" rel="noopener noreferrer">웹에서 사용 ↗</a>}
            {utility.downloadUrl && <a className={`btn${utility.site ? '' : ' primary'}`} href={utility.downloadUrl} target="_blank" rel="noopener noreferrer">다운로드 ↗</a>}
            {!utility.downloadUrl && <a className="btn primary" href={utility.buildUrl} target="_blank" rel="noopener noreferrer" aria-describedby="utility-build-note">빌드 파일 ↗</a>}
            <a className="utility-repository" href={utility.github} target="_blank" rel="noopener noreferrer"><GitHubMark /> GitHub <span aria-hidden="true">↗</span></a>
          </div>
          {!utility.downloadUrl && <p className="utility-build-note" id="utility-build-note">GitHub Actions의 Artifacts에서 제공합니다. 다운로드에는 GitHub 로그인이 필요합니다.</p>}
          <dl className="utility-facts"><div><dt>지원 환경</dt><dd>{utility.platforms.join(' · ')}</dd></div><div><dt>기술</dt><dd>{utility.tech.join(' · ')}</dd></div></dl>
        </header>

        <UtilityGallery screens={utility.screens} />

        <section className="utility-section utility-purpose" aria-labelledby="purpose-heading">
          <h2 id="purpose-heading">만든 목적</h2>
          <div className="utility-section-body"><p>{utility.purpose}</p></div>
        </section>

        <section className="utility-section" aria-labelledby="examples-heading">
          <h2 id="examples-heading">사용 예시</h2>
          <div className="utility-section-body utility-examples">
            {utility.examples.map(example => (
              <article className="utility-example" key={example.title}>
                <h3>{example.title}</h3>
                <p className="utility-example-input"><strong>입력</strong>{example.input}</p>
                <ol>{example.steps.map(step => <li key={step}>{step}</li>)}</ol>
                <p className="utility-example-result"><strong>출력·동작</strong>{example.result}</p>
                <p className="utility-example-note">{example.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="utility-section" aria-labelledby="features-heading">
          <h2 id="features-heading">주요 기능</h2>
          <dl className="utility-feature-list">{utility.features.map(feature => <div key={feature.title}><dt>{feature.title}</dt><dd>{feature.description}</dd></div>)}</dl>
        </section>

        <section className="utility-section" aria-labelledby="architecture-heading">
          <h2 id="architecture-heading">구현</h2>
          <div className="utility-section-body">
            <div className="utility-overview">{utility.overview.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
            <dl className="utility-architecture">{utility.architecture.map(node => <div key={node.label}><dt>{node.label}</dt><dd>{node.detail}</dd></div>)}</dl>
            {utility.architectureNote && <p>{utility.architectureNote}</p>}
            <div className="utility-decisions">{utility.decisions.map(decision => <article key={decision.title}><h3>{decision.title}</h3><p>{decision.description}</p></article>)}</div>
            {utility.api?.length > 0 && <details className="utility-disclosure" id="api"><summary>{utility.apiTitle || '인터페이스'}</summary><p>{utility.apiNote}</p><dl className="utility-api">{utility.api.map(endpoint => <div key={`${endpoint.method}-${endpoint.path}`}><dt><span>{endpoint.method}</span><code>{endpoint.path}</code></dt><dd><strong>{endpoint.description}</strong><p>입력: {endpoint.request}</p><p>출력: {endpoint.response}</p><p>{endpoint.access}</p></dd></div>)}</dl></details>}
          </div>
        </section>

        <section className="utility-section" aria-labelledby="distribution-heading">
          <h2 id="distribution-heading">지원 환경</h2>
          <div className="utility-section-body">
            <table className="utility-compatibility"><caption className="visually-hidden">{utility.title} 플랫폼별 실행 형식과 지원 범위</caption><thead><tr><th scope="col">환경</th><th scope="col">형식</th><th scope="col">지원 범위</th></tr></thead><tbody>{utility.compatibility.map(target => <tr key={target.environment}><th scope="row">{target.environment}</th><td>{target.format}</td><td>{target.note}</td></tr>)}</tbody></table>
            <ul className="utility-limitations">{utility.limitations.map(limitation => <li key={limitation}>{limitation}</li>)}</ul>
            <details className="utility-disclosure"><summary>자동 빌드·배포</summary><p>{utility.distributionNote}</p><a href={utility.buildUrl} target="_blank" rel="noopener noreferrer">GitHub Actions 확인 ↗</a></details>
          </div>
        </section>

        <section className="utility-section utility-references" aria-labelledby="source-heading">
          <h2 id="source-heading">소스 코드</h2>
          <div className="utility-section-body">
            <div className="utility-source-links">{utility.sources.map(source => <a key={source.path} href={`${utility.github}/blob/${utility.revision}/${source.path}`} target="_blank" rel="noopener noreferrer" title={source.path}>{source.label} <span aria-hidden="true">↗</span></a>)}</div>
            <details className="utility-disclosure"><summary>검토 기준·화면 출처</summary><p><time dateTime={utility.reviewedAt}>{utility.inspectedAt}</time> 검토 · 기준 커밋 <a href={`${utility.github}/commit/${utility.revision}`} target="_blank" rel="noopener noreferrer"><code>{utility.revision.slice(0, 7)}</code> ↗</a></p>{utility.sourceNote && <p>{utility.sourceNote}</p>}<p>화면의 예시 데이터·원본 출처는 각 이미지 설명에 표시했습니다. 소스의 기능과 공개 배포본은 버전에 따라 다를 수 있습니다.</p></details>
          </div>
        </section>

        <nav className="utility-pagination" aria-label="다른 유틸리티">
          {previous && <Link to={previous.route} className="utility-previous"><span>← 이전 프로그램</span><strong>{previous.title}</strong></Link>}
          {next && <Link to={next.route} className="utility-next"><span>다음 프로그램 →</span><strong>{next.title}</strong></Link>}
        </nav>
      </div>
    </main>
  )
}

export default function UtilityDetail() {
  const { slug } = useParams()
  const utility = getUtility(slug)
  return utility ? <UtilityArticle key={utility.id} utility={utility} /> : <NotFound />
}
