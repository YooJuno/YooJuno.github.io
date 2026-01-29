import useReveal from '../hooks/useReveal'

function WebServiceBlog() {
  useReveal()
  return (
    <main className="section">
      <div className="container" data-reveal>
        <div className="section-head">
          <h2>웹서비스 · 블로그</h2>
          <p>블로그를 만들며 정리한 개발 일지와 기술 스택을 기록합니다.</p>
        </div>

        <section className="section">
          <div className="section-head">
            <h3>개발 일지</h3>
            <p>설계 결정과 구현 과정의 기록을 업데이트할 예정입니다.</p>
          </div>
          <div className="empty">준비 중</div>
        </section>

        <section className="section">
          <div className="section-head">
            <h3>기술 스택</h3>
            <p>프론트엔드/배포/운영 도구를 정리할 예정입니다.</p>
          </div>
          <div className="empty">준비 중</div>
        </section>
      </div>
    </main>
  )
}

export default WebServiceBlog
