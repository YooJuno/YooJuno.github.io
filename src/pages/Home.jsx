import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'
import profile from '../content/portfolio/profile.json'
import '../styles/pages/home.css'

function Home() {
  useDocumentTitle()
  return (
    <main className="home-main" id="main-content" tabIndex={-1}>
      <div className="container">
        <h1>{profile.name}</h1>
        <nav className="home-actions" aria-label="주요 페이지">
          <Link to="/portfolio">포트폴리오</Link>
          <Link to="/blog">블로그</Link>
          <Link to="/web-service">웹서비스</Link>
          <Link to="/utilities">유틸리티</Link>
        </nav>
      </div>
    </main>
  )
}

export default Home
