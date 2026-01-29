import useReveal from '../hooks/useReveal'

function WebServiceCctv() {
  useReveal()
  return (
    <main className="section">
      <div className="container" data-reveal>
        <div className="section-head">
          <h2>웹서비스 · CCTV Streaming</h2>
          <p>무선 CCTV 스트리밍 서비스의 구성과 개선 사항을 정리합니다.</p>
        </div>

        <section className="section">
          <div className="section-head">
            <h3>개발 일지</h3>
            <p>스트리밍 파이프라인과 운영 이슈를 정리할 예정입니다.</p>
          </div>
          <div className="empty">준비 중</div>
        </section>

        <section className="section">
          <div className="section-head">
            <h3>기술 스택</h3>
            <p>네트워크/스트리밍/모니터링 구성 요소를 정리할 예정입니다.</p>
          </div>
          <div className="empty">준비 중</div>
        </section>
      </div>
    </main>
  )
}

export default WebServiceCctv
