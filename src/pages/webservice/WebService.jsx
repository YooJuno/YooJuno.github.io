import { Link } from 'react-router-dom'
import useReveal from '../../hooks/useReveal'

function WebService() {
  useReveal()
  return (
    <main className="section">
      <div className="container" data-reveal>
        <div className="section-head">
          <h2>웹서비스</h2>
          <p>각 서비스는 별도 페이지에서 개발 일지와 기술 스택을 정리합니다.</p>
        </div>
        <div className="project-grid two">
          <article className="project-card compact">
            <h3>블로그</h3>
            <p className="summary">개발 일지와 기술 스택을 정리하는 서비스.</p>
            <Link className="btn ghost" to="/web-service/blog">페이지 보기</Link>
          </article>
          <article className="project-card compact">
            <h3>CCTV Streaming</h3>
            <p className="summary">실시간 영상 스트리밍 서비스.</p>
            <Link className="btn ghost" to="/web-service/cctv-streaming">페이지 보기</Link>
          </article>
          <article className="project-card compact">
            <h3>Video Chatting</h3>
            <p className="summary">화상 채팅 서비스.</p>
            <Link className="btn ghost" to="/web-service/video-chatting">페이지 보기</Link>
          </article>
          <article className="project-card compact">
            <h3>Bitcoin Auto Trader</h3>
            <p className="summary">자동매매 프로젝트.</p>
            <Link className="btn ghost" to="/web-service/bitcoin-auto-trader">페이지 보기</Link>
          </article>
        </div>
      </div>
    </main>
  )
}

export default WebService
