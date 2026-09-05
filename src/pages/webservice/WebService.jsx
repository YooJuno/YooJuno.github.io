import { Link } from 'react-router-dom'
import useReveal from '../../hooks/useReveal'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import '../../styles/pages/webservice.css'

const services = [
  {
    to: '/web-service/blog',
    title: 'Portfolio & Blog',
    description: '포트폴리오와 기술 기록을 관리하는 현재 사이트입니다.',
    status: '운영 중',
    tech: 'React · Vite',
    statusClass: 'badge-running',
  },
  {
    to: '/web-service/cctv-streaming',
    title: 'CCTV Streaming',
    description: '장거리 무선 환경을 위한 영상 모니터링 서비스입니다.',
    status: '개발 중',
    tech: 'HaLow · Streaming',
    statusClass: 'badge-dev',
  },
  {
    to: '/web-service/video-chatting',
    title: 'Video Chatting',
    description: '브라우저 기반 실시간 영상 통화 서비스입니다.',
    status: '개발 중',
    tech: 'WebRTC',
    statusClass: 'badge-dev',
  },
  {
    to: '/web-service/bitcoin-auto-trader',
    title: 'Bitcoin Auto Trader',
    description: '전략 설정과 자동매매 실행을 연결한 서비스입니다.',
    status: '개발 중',
    tech: 'Upbit API',
    statusClass: 'badge-dev',
  },
]

function WebService() {
  useReveal()
  useDocumentTitle()

  return (
    <main className="section">
      <div className="container is-visible" data-reveal>
        <div className="section-head">
          <h1>웹서비스</h1>
          <p>개발하거나 운영 중인 서비스입니다.</p>
        </div>
        <div className="project-grid one service-list">
          {services.map((service) => (
            <Link
              className="project-card compact service-card service-link"
              to={service.to}
              key={service.to}
            >
              <div className="service-row">
                <div className="service-main">
                  <h2>{service.title}</h2>
                  <p className="summary">{service.description}</p>
                  <div className="meta-row">
                    <span className={`badge ${service.statusClass}`}>{service.status}</span>
                    <span>{service.tech}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

export default WebService
