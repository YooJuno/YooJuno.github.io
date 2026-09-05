import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal'
import useDocumentTitle from '../hooks/useDocumentTitle'
import '../styles/pages/home.css'

function Home() {
  useReveal()
  useDocumentTitle()
  return (
    <main className="home-main">
      <section className="site-hero">
        <div className="container hero-grid">
          <div className="hero-text" data-reveal>
            <p className="eyebrow">Robotics · Computer Vision · Embedded</p>
            <h1>유준호</h1>
            <p className="lead">
              ROS2 자율주행, 컴퓨터 비전, 임베디드 시스템을 개발합니다.
            </p>
            <div className="hero-actions">
              <Link className="btn primary" to="/portfolio">프로젝트</Link>
              <Link className="btn ghost" to="/blog">블로그</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
