import useReveal from '../../hooks/useReveal'

function WebServiceBtc() {
  useReveal()
  return (
    <main className="section">
      <div className="container" data-reveal>
        <div className="section-head">
          <h2>웹서비스 · Bitcoin Auto Trader</h2>
          <p>데이터 기반 전략을 자동화해 운영 효율을 높이는 트레이딩 프로젝트입니다.</p>
        </div>

        <section className="section">
          <div className="section-head">
            <h3>핵심 기능</h3>
            <p>일관된 규칙 실행과 리스크 관리를 목표로 설계합니다.</p>
          </div>
          <div className="project-grid two">
            <article className="project-card compact">
              <h4>전략 검증</h4>
              <p className="summary">과거 데이터 기반 백테스트와 리포트를 제공합니다.</p>
            </article>
            <article className="project-card compact">
              <h4>신호 기반 주문</h4>
              <p className="summary">정의된 규칙에 따라 매수/매도를 자동 실행합니다.</p>
            </article>
            <article className="project-card compact">
              <h4>리스크 관리</h4>
              <p className="summary">손절/익절 및 손실 제한 전략을 포함합니다.</p>
            </article>
            <article className="project-card compact">
              <h4>운영 모니터링</h4>
              <p className="summary">로그와 알림으로 운용 상태를 추적합니다.</p>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h3>기술 포인트</h3>
            <p>구현 단계에서 구체화될 예정인 구성입니다.</p>
          </div>
          <div className="tag-row">
            <span>Upbit API (예정)</span>
            <span>Python (예정)</span>
            <span>Backtesting (예정)</span>
            <span>Scheduler (예정)</span>
            <span>Logging/Alert (예정)</span>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h3>고객 가치 · 기대효과</h3>
            <p>감정에 흔들리지 않는 규칙 기반 운용을 지향합니다.</p>
          </div>
          <div className="project-info">
            <ul>
              <li>규칙 기반 자동화로 매매 일관성 확보</li>
              <li>운용 기록을 축적해 전략 개선에 활용</li>
              <li>반복 업무 최소화로 운영 효율 향상</li>
            </ul>
          </div>
          <p className="note">투자 손실 가능성이 있으며 수익을 보장하지 않습니다.</p>
        </section>
      </div>
    </main>
  )
}

export default WebServiceBtc
