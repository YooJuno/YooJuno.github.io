import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'
import profile from '../content/portfolio/profile.json'
import '../styles/pages/home.css'

function Home() {
  useDocumentTitle()
  return (
    <main className="home-main" id="main-content" tabIndex={-1}>
      <section className="home-intro" aria-labelledby="home-heading">
        <div className="container">
          <div className="home-copy">
            <h1 id="home-heading">{profile.name}</h1>
            <p className="home-role">{profile.role}</p>
            <div className="home-description">
              {profile.intro.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <nav className="home-actions" aria-label="주요 페이지">
              <Link className="btn primary home-primary" to="/portfolio">포트폴리오 보기 <span aria-hidden="true">→</span></Link>
              <Link className="home-secondary" to="/blog">블로그</Link>
              <Link className="home-secondary" to="/web-service">웹서비스</Link>
            </nav>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
