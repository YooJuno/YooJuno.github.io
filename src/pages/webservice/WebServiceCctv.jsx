import useReveal from '../../hooks/useReveal'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import '../../styles/pages/webservice.css'

function WebServiceCctv() {
  useReveal()
  useDocumentTitle('CCTV Streaming', '장거리 무선 환경을 위한 영상 모니터링 서비스.')
  return (
    <main className="section">
      <div className="container is-visible" data-reveal>
        <div className="section-head">
          <h2>CCTV Streaming</h2>
          <p>장거리 환경에서도 안정적으로 현장을 모니터링합니다.</p>
          <div className="meta-row">
            <span className="badge">상태: 프로토타입</span>
            <span>플랫폼: Web · Edge</span>
            <span>업데이트: 2026-02-04</span>
          </div>
        </div>

        <section className="section" id="overview">
          <div className="project-card feature">
            <div className="project-info">
              <h3>개요</h3>
              <p className="summary">
                저전력 장거리 무선 환경에서 다중 스트림을 안정적으로 제공하고,
                상태 이상을 자동으로 감지합니다.
              </p>
              <ul className="info-list">
                <li>
                  <span>대상</span> 산업/현장 모니터링 담당자
                </li>
                <li>
                  <span>문제</span> 외딴 환경에서 영상 품질과 안정성 확보
                </li>
                <li>
                  <span>핵심</span> 다중 스트림 + 상태 모니터링 + 자동 복구
                </li>
                <li>
                  <span>데이터</span> 실시간 영상/상태 로그
                </li>
                <li>
                  <span>확장</span> 저장/리플레이, 이벤트 감지
                </li>
              </ul>
              <div className="tag-row">
                <span>Raspberry Pi</span>
                <span>Wi-Fi HaLow</span>
                <span>gRPC</span>
                <span>Streaming</span>
                <span>Watchdog</span>
              </div>
            </div>
            <div className="project-media">
              <figure className="media-tile">
                <div className="media-placeholder">대표 화면 이미지</div>
                <figcaption>멀티 스트림 대시보드</figcaption>
              </figure>
              <div className="pill-grid">
                <span>멀티 뷰</span>
                <span>상태 알림</span>
                <span>자동 복구</span>
              </div>
            </div>
          </div>
        </section>

        <div className="library-grid">
          <aside className="project-index">
            <h3>목차</h3>
            <p>섹션 바로가기</p>
            <div className="index-group">
              <h4>제품</h4>
              <a className="index-link" href="#features">핵심 기능</a>
              <a className="index-link" href="#flow">사용자 흐름</a>
              <a className="index-link" href="#ui">화면</a>
            </div>
            <div className="index-group">
              <h4>기술</h4>
              <a className="index-link" href="#data">데이터/통신</a>
              <a className="index-link" href="#api">API 요약</a>
              <a className="index-link" href="#architecture">시스템 아키텍처</a>
              <a className="index-link" href="#infra">인프라</a>
            </div>
            <div className="index-group">
              <h4>설계</h4>
              <a className="index-link" href="#security">보안/안정성</a>
              <a className="index-link" href="#intent">설계</a>
              <a className="index-link" href="#roadmap">향후 계획</a>
            </div>
          </aside>

          <div>
            <section className="section" id="features">
              <div className="section-head">
                <h3>핵심 기능</h3>
                <p>현장 안정성과 운영 편의성을 높이는 기능을 정리합니다.</p>
              </div>
              <div className="project-grid two">
                <article className="project-card compact">
                  <h4>멀티 스트림</h4>
                  <p className="summary">다수 카메라를 한 화면에서 모니터링합니다.</p>
                </article>
                <article className="project-card compact">
                  <h4>장거리 무선</h4>
                  <p className="summary">저전력 장거리 통신으로 외딴 지역을 커버합니다.</p>
                </article>
                <article className="project-card compact">
                  <h4>상태 모니터링</h4>
                  <p className="summary">카메라/네트워크 상태를 실시간으로 확인합니다.</p>
                </article>
                <article className="project-card compact">
                  <h4>자동 복구</h4>
                  <p className="summary">장애 발생 시 재연결과 복구를 자동화합니다.</p>
                </article>
              </div>
            </section>

            <section className="section" id="flow">
              <div className="section-head">
                <h3>사용자 흐름</h3>
                <p>접속 → 모니터링 → 알림 흐름을 정리합니다.</p>
              </div>
              <div className="timeline">
                <article className="timeline-item">
                  <div className="time">Step 01</div>
                  <div>
                    <h3>스트림 선택</h3>
                    <p>카메라 목록에서 원하는 스트림을 선택합니다.</p>
                  </div>
                </article>
                <article className="timeline-item">
                  <div className="time">Step 02</div>
                  <div>
                    <h3>실시간 모니터링</h3>
                    <p>멀티 뷰와 확대 화면으로 현장을 확인합니다.</p>
                  </div>
                </article>
                <article className="timeline-item">
                  <div className="time">Step 03</div>
                  <div>
                    <h3>알림/복구</h3>
                    <p>장애 발생 시 알림과 자동 복구가 실행됩니다.</p>
                  </div>
                </article>
              </div>
            </section>

            <section className="section" id="ui">
              <div className="section-head">
                <h3>화면</h3>
                <p>멀티 뷰와 상태 정보 중심의 화면 구성입니다.</p>
              </div>
              <div className="media-grid">
                <figure className="media-tile">
                  <div className="media-placeholder">멀티 뷰</div>
                  <figcaption>여러 카메라 화면 동시 표시</figcaption>
                </figure>
                <figure className="media-tile">
                  <div className="media-placeholder">단일 확대</div>
                  <figcaption>중요 구역 확대 모니터링</figcaption>
                </figure>
                <figure className="media-tile">
                  <div className="media-placeholder">상태 로그</div>
                  <figcaption>장애 이력과 복구 로그</figcaption>
                </figure>
              </div>
            </section>

            <section className="section" id="data">
              <div className="section-head">
                <h3>데이터/통신</h3>
                <p>스트림과 상태 데이터 흐름을 요약합니다.</p>
              </div>
              <div className="project-grid two">
                <article className="project-card compact">
                  <h4>입력 데이터</h4>
                  <p className="summary">RTSP/카메라 스트림, 디바이스 상태.</p>
                </article>
                <article className="project-card compact">
                  <h4>출력 데이터</h4>
                  <p className="summary">Web 스트림, 알림, 상태 리포트.</p>
                </article>
                <article className="project-card compact">
                  <h4>통신 방식</h4>
                  <p className="summary">gRPC/RTSP → 스트리밍 서버 → Web.</p>
                </article>
                <article className="project-card compact">
                  <h4>실패/재시도</h4>
                  <p className="summary">자동 재연결, 상태 체크, 워치독.</p>
                </article>
              </div>
            </section>

            <section className="section" id="api">
              <div className="section-head">
                <h3>API 요약</h3>
                <p>스트림 관리에 필요한 핵심 엔드포인트입니다.</p>
              </div>
              <div className="project-list">
                <details className="project-detail" open>
                  <summary>
                    <span className="title">GET /api/v1/streams</span>
                    <span className="meta">응답: 스트림 목록</span>
                  </summary>
                  <div className="detail-body">
                    <p>카메라 스트림 목록과 상태 정보를 제공합니다.</p>
                    <ul>
                      <li>요청: 필터, 위치</li>
                      <li>응답: 스트림 ID, 상태</li>
                    </ul>
                    <div className="detail-meta">에러: 401, 500</div>
                  </div>
                </details>
                <details className="project-detail">
                  <summary>
                    <span className="title">GET /api/v1/streams/:id</span>
                    <span className="meta">응답: 스트림 상세</span>
                  </summary>
                  <div className="detail-body">
                    <p>특정 스트림의 상세 정보와 접속 URL을 제공합니다.</p>
                    <ul>
                      <li>요청: 스트림 ID</li>
                      <li>응답: URL, 상태, 지연</li>
                    </ul>
                    <div className="detail-meta">에러: 404, 500</div>
                  </div>
                </details>
                <details className="project-detail">
                  <summary>
                    <span className="title">GET /api/v1/health</span>
                    <span className="meta">응답: 시스템 상태</span>
                  </summary>
                  <div className="detail-body">
                    <p>장비와 네트워크 상태를 점검합니다.</p>
                    <ul>
                      <li>요청: 없음</li>
                      <li>응답: 상태, 지연, 오류</li>
                    </ul>
                    <div className="detail-meta">에러: 503</div>
                  </div>
                </details>
              </div>
            </section>

            <section className="section" id="architecture">
              <div className="section-head">
                <h3>시스템 아키텍처</h3>
                <p>엣지 장비부터 웹 클라이언트까지 흐름을 보여줍니다.</p>
              </div>
              <div className="project-card feature">
                <figure className="media-tile">
                  <div className="media-placeholder">아키텍처 다이어그램</div>
                  <figcaption>Edge → Gateway → Streaming Server → Web</figcaption>
                </figure>
                <div className="project-info">
                  <h4>데이터 흐름 요약</h4>
                  <ul>
                    <li>Edge 디바이스가 영상 스트림 송출</li>
                    <li>게이트웨이에서 스트림 수집/분배</li>
                    <li>웹에서 실시간 스트림 재생</li>
                    <li>상태 로그를 저장하고 알림 전파</li>
                  </ul>
                  <p className="note">불안정한 환경에서도 끊김을 최소화합니다.</p>
                </div>
              </div>
            </section>

            <section className="section" id="infra">
              <div className="section-head">
                <h3>인프라</h3>
                <p>엣지 장비와 스트리밍 서버를 함께 운영합니다.</p>
              </div>
              <div className="stack-grid">
                <article className="stack-card">
                  <h3>엣지</h3>
                  <div className="chip-list">
                    <span>Raspberry Pi</span>
                    <span>Camera</span>
                    <span>Watchdog</span>
                  </div>
                </article>
                <article className="stack-card">
                  <h3>스트리밍</h3>
                  <div className="chip-list">
                    <span>Streaming Server</span>
                    <span>gRPC</span>
                    <span>HLS/RTC</span>
                  </div>
                </article>
                <article className="stack-card">
                  <h3>운영</h3>
                  <div className="chip-list">
                    <span>모니터링</span>
                    <span>알림</span>
                    <span>로그</span>
                  </div>
                </article>
              </div>
            </section>

            <section className="section" id="security">
              <div className="section-head">
                <h3>보안/안정성</h3>
                <p>접근 통제와 장애 대응을 함께 고려합니다.</p>
              </div>
              <div className="project-grid two">
                <article className="project-card compact">
                  <h4>보안/권한</h4>
                  <p className="summary">스트림 접근 권한, 네트워크 보호.</p>
                </article>
                <article className="project-card compact">
                  <h4>안정성</h4>
                  <p className="summary">워치독/재연결/상태 알림.</p>
                </article>
              </div>
            </section>

            <section className="section" id="intent">
              <div className="section-head">
                <h3>설계</h3>
                <p>현장 안정성과 운영 편의성에 집중합니다.</p>
              </div>
              <div className="project-card">
                <div className="project-info">
                  <ul>
                    <li>저전력 장거리 통신으로 설치 제약 최소화</li>
                    <li>스트림 상태 모니터링으로 장애 대응 강화</li>
                    <li>멀티 뷰 중심 UI로 현장 상황 파악 가속</li>
                  </ul>
                </div>
                <p className="note">운영 비용을 줄이면서 감시 품질을 높입니다.</p>
              </div>
            </section>

            <section className="section" id="roadmap">
              <div className="section-head">
                <h3>향후 계획</h3>
                <p>저장과 분석 기능을 단계적으로 확장합니다.</p>
              </div>
              <div className="project-grid two">
                <article className="project-card compact">
                  <h4>현재 한계</h4>
                  <p className="summary">실시간 스트림 중심으로 설계됨.</p>
                </article>
                <article className="project-card compact">
                  <h4>다음 단계</h4>
                  <p className="summary">녹화/검색, 이벤트 탐지, 리포트.</p>
                </article>
              </div>
              <div className="project-links">
                <a className="chip-link" href="#overview">개요로 돌아가기</a>
                <a className="chip-link muted" href="#api">API 섹션</a>
                <a className="chip-link muted" href="#architecture">아키텍처 섹션</a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

export default WebServiceCctv
