import useReveal from '../hooks/useReveal'

function WebServiceVideo() {
  useReveal()
  return (
    <main className="section">
      <div className="container" data-reveal>
        <div className="section-head">
          <h2>웹서비스 · Video Chatting</h2>
          <p>화상 채팅 서비스의 구조와 개선 내용을 정리합니다.</p>
        </div>

        <section className="section">
          <div className="section-head">
            <h3>개발 일지</h3>
            <p>RTC 구조와 품질 개선 과정을 기록할 예정입니다.</p>
          </div>
          <div className="empty">준비 중</div>
        </section>

        <section className="section">
          <div className="section-head">
            <h3>기술 스택</h3>
            <p>프론트/백엔드 및 미디어 서버 구성을 정리할 예정입니다.</p>
          </div>
          <div className="empty">준비 중</div>
        </section>
      </div>
    </main>
  )
}

export default WebServiceVideo
