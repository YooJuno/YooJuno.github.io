import { Link } from 'react-router-dom'
import useReveal from '../../hooks/useReveal'

function WebService() {
  useReveal()
  return (
    <main className="section">
      <div className="container is-visible" data-reveal>
        <div className="section-head">
          <h2>웹서비스</h2>
          <p>서비스별 핵심 기능과 구조를 요약해둔 페이지 모음입니다.</p>
        </div>
        <div className="project-grid one service-list">
          <article className="project-card compact service-card">
            <div className="service-row">
              <div className="service-main">
                <h3>블로그(전체 사이트 정리)</h3>
                <p className="summary">
                  사이트 전체 구조와 기능을 문서화한 요약 페이지.
                </p>
                <div className="meta-row">
                  <span className="badge">운영중</span>
                  <span>범위: 전체 사이트</span>
                </div>
              </div>
              <Link className="btn ghost" to="/web-service/blog">페이지 보기</Link>
            </div>
          </article>
          <article className="project-card compact service-card">
            <div className="service-row">
              <div className="service-main">
                <h3>CCTV Streaming</h3>
                <p className="summary">장거리 환경에서도 안정적인 영상 모니터링.</p>
                <div className="meta-row">
                  <span className="badge">프로토타입</span>
                  <span>엣지/스트리밍</span>
                </div>
              </div>
              <Link className="btn ghost" to="/web-service/cctv-streaming">페이지 보기</Link>
            </div>
          </article>
          <article className="project-card compact service-card">
            <div className="service-row">
              <div className="service-main">
                <h3>Video Chatting</h3>
                <p className="summary">브라우저 기반 실시간 영상 통화.</p>
                <div className="meta-row">
                  <span className="badge">설계/구현 중</span>
                  <span>WebRTC</span>
                </div>
              </div>
              <Link className="btn ghost" to="/web-service/video-chatting">페이지 보기</Link>
            </div>
          </article>
          <article className="project-card compact service-card">
            <div className="service-row">
              <div className="service-main">
                <h3>Bitcoin Auto Trader</h3>
                <p className="summary">전략 추천부터 자동매매 실행까지 통합.</p>
                <div className="meta-row">
                  <span className="badge">설계/구현 중</span>
                  <span>Upbit API</span>
                </div>
              </div>
              <Link className="btn ghost" to="/web-service/bitcoin-auto-trader">페이지 보기</Link>
            </div>
          </article>
        </div>
      </div>
    </main>
  )
}

export default WebService
