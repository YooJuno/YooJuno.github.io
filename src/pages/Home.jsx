import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal'

function Home() {
  useReveal()
  return (
    <main className="home-main">
      <section className="site-hero">
        <div className="container hero-grid">
          <div className="hero-text" data-reveal>
            <p className="eyebrow">Robotics ? Computer Vision ? Embedded</p>
            <h1>
              ??? ??? ??? ???? ????<br />
              ??? ??? ??? <span className="accent">???</span>
            </h1>
            <p className="lead">
              ROS2 ?? ????, SLAM, ??? ????, ???? ????
              ???? ???? ??? ???? ??????.
            </p>
            <div className="hero-actions">
              <Link className="btn primary" to="/portfolio">????? ??</Link>
              <Link className="btn ghost" to="/blog">?? ???</Link>
            </div>
          </div>
          <div className="hero-panel" data-reveal>
            <div className="panel-card">
              <h2>?? ??</h2>
              <ul>
                <li>???? ?? ??? ??</li>
                <li>????? ?? ?? ??</li>
                <li>????????? ??</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
