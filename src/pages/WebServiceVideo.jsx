import useReveal from '../hooks/useReveal'

function WebServiceVideo() {
  useReveal()
  return (
    <main className="section">
      <div className="container" data-reveal>
        <div className="section-head">
          <h2>웹서비스 · Video Chatting</h2>
          <p>원격 협업과 소통을 위한 화상 채팅 서비스를 목표로 합니다.</p>
        </div>

        <section className="section">
          <div className="section-head">
            <h3>핵심 기능</h3>
            <p>사용자 경험을 단순하고 안정적으로 설계합니다.</p>
          </div>
          <div className="project-grid two">
            <article className="project-card compact">
              <h4>실시간 영상/음성</h4>
              <p className="summary">브라우저에서 바로 접속 가능한 실시간 통화를 목표로 합니다.</p>
            </article>
            <article className="project-card compact">
              <h4>간편한 참여</h4>
              <p className="summary">링크 기반 참여 방식으로 접근성을 높입니다.</p>
            </article>
            <article className="project-card compact">
              <h4>참여자 관리</h4>
              <p className="summary">소규모 미팅을 효율적으로 운영하도록 구성합니다.</p>
            </article>
            <article className="project-card compact">
              <h4>품질 안정화</h4>
              <p className="summary">네트워크 환경에 맞춘 품질 조정 흐름을 고려합니다.</p>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h3>기술 포인트</h3>
            <p>구현 단계에서 확정될 예정인 설계 방향입니다.</p>
          </div>
          <div className="tag-row">
            <span>WebRTC (예정)</span>
            <span>Signaling Server (예정)</span>
            <span>STUN/TURN (예정)</span>
            <span>Monitoring (예정)</span>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h3>고객 가치 · 기대효과</h3>
            <p>업무/교육/상담 등 원격 협업의 진입 장벽을 낮춥니다.</p>
          </div>
          <div className="project-info">
            <ul>
              <li>별도 설치 없이 브라우저 기반 참여</li>
              <li>회의 운영 시간을 줄이는 간단한 흐름</li>
              <li>협업 공간을 빠르게 구성할 수 있는 유연성</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  )
}

export default WebServiceVideo
