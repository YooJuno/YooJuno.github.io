import { Link } from 'react-router-dom'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import { webServices } from '../../lib/webServices'
import { GitHubMark } from './ServiceDetail'
import '../../styles/pages/webservice.css'

function WebService() {
  useDocumentTitle()

  return (
    <main className="section">
      <div className="container">
        <div className="section-head">
          <h1>웹서비스</h1>
          <p>실제 구현한 서비스의 화면·기능·API와 소스 코드를 정리했습니다.</p>
        </div>
        <div className="project-grid one service-list">
          {webServices.map(service => (
            <article className="project-card compact service-card" key={service.id}>
              <Link className="service-card-content" to={service.route}>
                <h2>{service.title}</h2>
                <p className="summary">{service.summary}</p>
                <div className="meta-row"><span className={`badge ${service.site ? 'badge-running' : 'badge-dev'}`}>{service.status}</span><span>{service.tech.slice(0, 4).join(' · ')}</span></div>
              </Link>
              <div className="service-card-links">
                <a href={service.github} target="_blank" rel="noopener noreferrer" aria-label={`${service.title} GitHub 저장소`}><GitHubMark /> GitHub ↗</a>
                {service.site && <a className="service-live" href={service.site} target="_blank" rel="noopener noreferrer" aria-label={`${service.title} 서비스 열기`}>서비스 열기 ↗</a>}
                <Link to={service.route} className="btn">구현 살펴보기 →</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}

export default WebService
