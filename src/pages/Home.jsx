import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'
import profile from '../content/portfolio/profile.json'
import simulationImage from '../content/portfolio/projects/rail-inspection/images/b2-mujoco.webp'
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
            <p className="home-description">3D SLAM으로 지도를 만들고 로봇의 주행 경로를 설계합니다.</p>
            <nav className="home-actions" aria-label="주요 페이지">
              <Link className="btn primary home-primary" to="/portfolio">포트폴리오 보기</Link>
              <div className="home-secondary-links">
                <Link className="home-secondary" to="/blog">블로그</Link>
                <Link className="home-secondary" to="/web-service">웹서비스</Link>
                <Link className="home-secondary" to="/utilities">유틸리티</Link>
              </div>
            </nav>
          </div>
          <Link className="home-feature" to="/portfolio#proj-rail-inspection" aria-labelledby="home-feature-caption">
            <figure>
              <img src={simulationImage} width="1400" height="810" alt="실내 시험장에 배치된 사족보행 로봇 Unitree B2" />
              <figcaption id="home-feature-caption">B2 실내 주행 · MuJoCo 시뮬레이션</figcaption>
            </figure>
          </Link>
        </div>
      </section>
    </main>
  )
}

export default Home
