import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal'

function Home() {
  useReveal()
  return (
    <main className="home-main">
      <section className="site-hero">
        <div className="container hero-grid">
          <div className="hero-text" data-reveal>
            <p className="eyebrow">Robotics · Computer Vision · Embedded</p>
            <h1>
              현장의 문제를 로봇과 비전으로 해결하는<br />
              시스템 통합형 개발자 <span className="accent">유준호</span>
            </h1>
            <p className="lead">
              ROS2 기반 자율주행, SLAM, 실시간 스트리밍과
              임베디드 연계를 통해 로봇-서버-클라이언트 전체 흐름을 설계합니다.
            </p>
            <div className="hero-actions">
              <Link className="btn primary" to="/portfolio">포트폴리오 보기</Link>
              <Link className="btn ghost" to="/blog">블로그 보기</Link>
            </div>
          </div>
          <div className="hero-panel" data-reveal>
            <div className="panel-card">
              <h2>핵심 요약</h2>
              <ul>
                <li>로보틱스 중심의 시스템 통합 설계 및 구현</li>
                <li>컴퓨터비전 기반 측정·인식 문제 해결 경험</li>
                <li>임베디드·통신까지 연결되는 엔드투엔드 구성</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
