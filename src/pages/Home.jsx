import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal'
import useDocumentTitle from '../hooks/useDocumentTitle'
import profile from '../content/portfolio/profile.json'
import '../styles/pages/home.css'

function Home() {
  useReveal()
  useDocumentTitle()
  return (
    <main className="home-main">
      <section className="site-hero">
        <div className="container hero-grid">
          <div className="hero-text" data-reveal>
            <p className="eyebrow">{profile.role}</p>
            <h1>{profile.name}</h1>
            <p className="lead">
              {profile.intro.join(' ')}
            </p>
            <div className="hero-actions">
              <Link className="btn ghost" to="/portfolio">포트폴리오</Link>
              <Link className="btn ghost" to="/blog">블로그</Link>
              <Link className="btn ghost" to="/webservice">웹서비스</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
