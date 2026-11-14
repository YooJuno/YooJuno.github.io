import { Link } from 'react-router-dom'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import { utilities } from '../../lib/utilities'
import GitHubMark from '../../components/GitHubMark'
import '../../styles/pages/utilities.css'

export default function Utilities() {
  useDocumentTitle()
  return (
    <main className="section utility-index" id="main-content" tabIndex={-1}>
      <div className="container">
        <div className="section-head"><h1>유틸리티</h1><p>직접 쓰기 위해 만든 분석·편집·시스템 관리 프로그램입니다.</p></div>
        <div className="utility-list">
          {utilities.map(utility => (
              <article className="utility-card" key={utility.id}>
                <div className="utility-copy">
                  <h2><Link to={utility.route}>{utility.title}</Link></h2>
                  <p>{utility.summary}</p>
                  <p className="utility-platforms">{utility.platforms.join(' · ')}</p>
                </div>
                <div className="utility-links">
                  <Link to={utility.route}>자세히 보기 <span aria-hidden="true">→</span></Link>
                  <a href={utility.github} target="_blank" rel="noopener noreferrer" aria-label={`${utility.title} GitHub 저장소`}><GitHubMark /> GitHub ↗</a>
                </div>
              </article>
          ))}
        </div>
      </div>
    </main>
  )
}
