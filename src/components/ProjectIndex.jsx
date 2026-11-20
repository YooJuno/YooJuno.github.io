import { Link } from 'react-router-dom'
import GitHubMark from './GitHubMark'
import '../styles/components/project-index.css'

export default function ProjectIndex({ title, intro, entries }) {
  return (
    <main className="section catalog-index" id="main-content" tabIndex={-1}>
      <div className="container">
        <header className="section-head">
          <h1>{title}</h1>
          <p>{intro}</p>
        </header>
        <ul className="catalog-list" role="list">
          {entries.map(({ id, title, route, meta, github, site, siteLabel }) => (
            <li className="catalog-row" key={id}>
              <h2 className="catalog-title"><Link to={route}>{title}</Link></h2>
              <p className="catalog-meta">{meta}</p>
              <div className="catalog-actions">
                <a href={github} target="_blank" rel="noopener noreferrer" aria-label={`${title} GitHub 저장소`}>
                  <GitHubMark /> GitHub
                </a>
                {site && (
                  <a href={site} target="_blank" rel="noopener noreferrer" aria-label={`${title} ${siteLabel}`}>
                    {siteLabel}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
