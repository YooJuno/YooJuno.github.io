import useReveal from '../hooks/useReveal'

function WebServiceBtc() {
  useReveal()
  return (
    <main className="section">
      <div className="container" data-reveal>
        <div className="section-head">
          <h2>웹서비스 · Bitcoin Auto Trader</h2>
          <p>자동매매 프로젝트의 기록과 운영 계획을 정리합니다.</p>
        </div>

        <section className="section">
          <div className="section-head">
            <h3>개발 일지</h3>
            <p>전략 검증과 운영 개선 과정을 기록할 예정입니다.</p>
          </div>
          <div className="empty">준비 중</div>
        </section>

        <section className="section">
          <div className="section-head">
            <h3>기술 스택</h3>
            <p>데이터 수집/분석/주문 모듈 구성을 정리할 예정입니다.</p>
          </div>
          <div className="empty">준비 중</div>
        </section>
      </div>
    </main>
  )
}

export default WebServiceBtc
