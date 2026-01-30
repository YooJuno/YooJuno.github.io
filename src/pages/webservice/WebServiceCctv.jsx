import useReveal from '../../hooks/useReveal'

function WebServiceCctv() {
  useReveal()
  return (
    <main className="section">
      <div className="container" data-reveal>
        <div className="section-head">
          <h2>웹서비스 · CCTV Streaming</h2>
          <p>유선 연결이 어려운 환경에서도 안정적으로 영상을 확인할 수 있는 스트리밍 서비스입니다.</p>
        </div>

        <section className="section">
          <div className="section-head">
            <h3>핵심 기능</h3>
            <p>현장 운영에 필요한 안정성과 관제 편의성을 제공합니다.</p>
          </div>
          <div className="project-grid two">
            <article className="project-card compact">
              <h4>다중 노드 스트리밍</h4>
              <p className="summary">여러 CCTV 노드를 한 화면에서 관리할 수 있도록 구성합니다.</p>
            </article>
            <article className="project-card compact">
              <h4>장거리 무선 연결</h4>
              <p className="summary">유선이 어려운 구역도 커버할 수 있는 무선 전송을 지원합니다.</p>
            </article>
            <article className="project-card compact">
              <h4>상태 모니터링</h4>
              <p className="summary">노드 상태와 스트리밍 품질을 지속적으로 확인합니다.</p>
            </article>
            <article className="project-card compact">
              <h4>자동 복구</h4>
              <p className="summary">장애 발생 시 자동 재실행으로 안정성을 높입니다.</p>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h3>기술 포인트</h3>
            <p>임베디드 노드부터 웹 관제까지 전체 흐름을 통합합니다.</p>
          </div>
          <div className="tag-row">
            <span>Raspberry Pi</span>
            <span>Wi-Fi HaLow (900MHz)</span>
            <span>gRPC</span>
            <span>Crontab Watchdog</span>
            <span>Web Streaming</span>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h3>고객 가치 · 기대효과</h3>
            <p>현장 가시성과 운영 효율을 동시에 높이는 것이 목표입니다.</p>
          </div>
          <div className="project-info">
            <ul>
              <li>유선 설치가 어려운 장소에서도 관제 가능</li>
              <li>영상 품질/상태를 실시간으로 확인해 대응 시간 단축</li>
              <li>장비 장애 자동 복구로 운영 부담 감소</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  )
}

export default WebServiceCctv
