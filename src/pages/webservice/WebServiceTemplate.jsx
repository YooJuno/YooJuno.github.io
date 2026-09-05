import useReveal from '../../hooks/useReveal'

function WebServiceTemplate() {
  useReveal()
  return (
    <main className="section">
      <div className="container" data-reveal>
        <div className="section-head">
          <h1>웹서비스 · [페이지명]</h1>
          <p>
            한 줄 요약: [문제 + 해결 + 가치]를 15~20자 내외로 정리합니다.
          </p>
          <div className="meta-row">
            <span className="badge">상태: 준비중</span>
            <span>플랫폼: Web / Mobile</span>
            <span>업데이트: 2026-02-04</span>
          </div>
        </div>

        <section className="section" id="overview">
          <div className="project-card feature">
            <div className="project-info">
              <h3>핵심 한눈에 보기</h3>
              <p className="summary">
                30초 요약: 이 페이지가 해결하는 문제와 핵심 가치를 간단히 설명합니다.
              </p>
              <ul className="info-list">
                <li>
                  <span>대상</span> [예: 실시간 정보를 빠르게 확인해야 하는 사용자]
                </li>
                <li>
                  <span>문제</span> [예: 분산된 데이터를 한 화면에서 보기 어려움]
                </li>
                <li>
                  <span>핵심</span> [예: 실시간 집계, 경보, 요약 리포트]
                </li>
                <li>
                  <span>데이터</span> [예: 거래소 API, 1초 갱신]
                </li>
                <li>
                  <span>신뢰</span> [예: 캐시 + 재시도 + 장애 알림]
                </li>
              </ul>
              <div className="tag-row">
                <span>React</span>
                <span>API Gateway</span>
                <span>Realtime</span>
                <span>Observability</span>
                <span>CI/CD</span>
              </div>
            </div>
            <div className="project-media">
              <figure className="media-tile">
                <div className="media-placeholder">대표 화면 이미지</div>
                <figcaption>메인 화면 / 핵심 지표 요약</figcaption>
              </figure>
              <div className="pill-grid">
                <span>핵심 지표 01</span>
                <span>핵심 지표 02</span>
                <span>핵심 지표 03</span>
              </div>
            </div>
          </div>
        </section>

        <div className="library-grid">
          <aside className="project-index">
            <h3>빠른 목차</h3>
            <p>필요한 섹션으로 바로 이동할 수 있어요.</p>
            <div className="index-group">
              <h4>제품</h4>
              <a className="index-link" href="#features">핵심 기능</a>
              <a className="index-link" href="#flow">사용자 흐름</a>
              <a className="index-link" href="#ui">UI/인터페이스</a>
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
              <a className="index-link" href="#intent">구현 의도</a>
              <a className="index-link" href="#roadmap">한계/로드맵</a>
            </div>
          </aside>

          <div>
            <section className="section" id="features">
              <div className="section-head">
                <h3>핵심 기능</h3>
                <p>사용자가 체감하는 주요 기능을 3~5개로 정리합니다.</p>
              </div>
              <div className="project-grid two">
                <article className="project-card compact">
                  <h4>기능 01</h4>
                  <p className="summary">무엇을, 어떤 방식으로 제공하는지 한 줄로 설명.</p>
                </article>
                <article className="project-card compact">
                  <h4>기능 02</h4>
                  <p className="summary">핵심 차별점이 있으면 강조합니다.</p>
                </article>
                <article className="project-card compact">
                  <h4>기능 03</h4>
                  <p className="summary">실제 사용자 행동에 직결되는 기능을 적습니다.</p>
                </article>
                <article className="project-card compact">
                  <h4>기능 04</h4>
                  <p className="summary">확장/자동화/알림 등 부가 기능도 가능.</p>
                </article>
              </div>
            </section>

            <section className="section" id="flow">
              <div className="section-head">
                <h3>사용자 흐름</h3>
                <p>진입 → 주요 행동 → 완료까지 흐름을 짧게 정리합니다.</p>
              </div>
              <div className="timeline">
                <article className="timeline-item">
                  <div className="time">Step 01</div>
                  <div>
                    <h3>진입/탐색</h3>
                    <p>어디서 유입되고 어떤 정보가 먼저 보이는지 설명.</p>
                  </div>
                </article>
                <article className="timeline-item">
                  <div className="time">Step 02</div>
                  <div>
                    <h3>핵심 행동</h3>
                    <p>가장 중요한 액션과 그 결과를 한 줄로 요약.</p>
                  </div>
                </article>
                <article className="timeline-item">
                  <div className="time">Step 03</div>
                  <div>
                    <h3>완료/피드백</h3>
                    <p>성공/실패 메시지, 다음 행동 유도 포인트 정리.</p>
                  </div>
                </article>
              </div>
            </section>

            <section className="section" id="ui">
              <div className="section-head">
                <h3>UI/인터페이스</h3>
                <p>대표 화면 2~4장을 넣고 핵심 인터랙션만 설명합니다.</p>
              </div>
              <div className="media-grid">
                <figure className="media-tile">
                  <div className="media-placeholder">메인 대시보드</div>
                  <figcaption>가장 중요한 정보가 모이는 화면</figcaption>
                </figure>
                <figure className="media-tile">
                  <div className="media-placeholder">상세/필터</div>
                  <figcaption>정렬/필터/탭 구성 설명</figcaption>
                </figure>
                <figure className="media-tile">
                  <div className="media-placeholder">알림/로그</div>
                  <figcaption>상태 변화와 히스토리 추적</figcaption>
                </figure>
              </div>
            </section>

            <section className="section" id="data">
              <div className="section-head">
                <h3>데이터/통신</h3>
                <p>입력/출력/통신 방식과 실패 처리 기준을 명확히 적습니다.</p>
              </div>
              <div className="project-grid two">
                <article className="project-card compact">
                  <h4>입력 데이터</h4>
                  <p className="summary">[예: 거래소 가격, 주문/체결, 외부 지표]</p>
                </article>
                <article className="project-card compact">
                  <h4>출력 데이터</h4>
                  <p className="summary">[예: 요약 지표, 알림 이벤트, 리포트]</p>
                </article>
                <article className="project-card compact">
                  <h4>통신 방식</h4>
                  <p className="summary">[예: REST + WebSocket + Batch]</p>
                </article>
                <article className="project-card compact">
                  <h4>실패/재시도</h4>
                  <p className="summary">[예: 재시도 횟수, 백오프, fallback]</p>
                </article>
              </div>
            </section>

            <section className="section" id="api">
              <div className="section-head">
                <h3>API 요약</h3>
                <p>핵심 엔드포인트만 간결하게 정리합니다.</p>
              </div>
              <div className="project-list">
                <details className="project-detail" open>
                  <summary>
                    <span className="title">GET /api/v1/summary</span>
                    <span className="meta">인증: 토큰 | 응답: 요약 데이터</span>
                  </summary>
                  <div className="detail-body">
                    <p>대시보드에 필요한 핵심 수치를 제공하는 엔드포인트.</p>
                    <ul>
                      <li>요청: 기간, 필터, 대상</li>
                      <li>응답: 지표, 상태, 업데이트 시간</li>
                    </ul>
                    <div className="detail-meta">에러: 401, 429, 500</div>
                  </div>
                </details>
                <details className="project-detail">
                  <summary>
                    <span className="title">POST /api/v1/alert</span>
                    <span className="meta">인증: 토큰 | 응답: 알림 등록</span>
                  </summary>
                  <div className="detail-body">
                    <p>사용자 조건을 등록하고 알림을 생성합니다.</p>
                    <ul>
                      <li>요청: 조건, 임계값, 채널</li>
                      <li>응답: 알림 ID, 활성 상태</li>
                    </ul>
                    <div className="detail-meta">에러: 400, 409, 500</div>
                  </div>
                </details>
                <details className="project-detail">
                  <summary>
                    <span className="title">GET /api/v1/status</span>
                    <span className="meta">인증: 없음 | 응답: 상태 체크</span>
                  </summary>
                  <div className="detail-body">
                    <p>시스템 건강 상태와 지연 시간을 제공합니다.</p>
                    <ul>
                      <li>요청: 없음</li>
                      <li>응답: 서비스 상태, 지연, 버전</li>
                    </ul>
                    <div className="detail-meta">에러: 503</div>
                  </div>
                </details>
              </div>
            </section>

            <section className="section" id="architecture">
              <div className="section-head">
                <h3>시스템 아키텍처</h3>
                <p>다이어그램 한 장 + 핵심 데이터 흐름만 요약합니다.</p>
              </div>
              <div className="project-card feature">
                <figure className="media-tile">
                  <div className="media-placeholder">아키텍처 다이어그램</div>
                  <figcaption>요청 → 처리 → 저장 → 알림 흐름</figcaption>
                </figure>
                <div className="project-info">
                  <h4>데이터 흐름 요약</h4>
                  <ul>
                    <li>수집 계층에서 실시간 데이터 수신</li>
                    <li>처리/정규화 후 캐시에 반영</li>
                    <li>API 레이어에서 사용자 요청 응답</li>
                    <li>이벤트 발생 시 알림 채널 전파</li>
                  </ul>
                  <p className="note">병목 지점과 캐시 전략을 강조하면 좋습니다.</p>
                </div>
              </div>
            </section>

            <section className="section" id="infra">
              <div className="section-head">
                <h3>인프라</h3>
                <p>배포, 저장소, 관측 체계를 짧게 요약합니다.</p>
              </div>
              <div className="stack-grid">
                <article className="stack-card">
                  <h3>배포/호스팅</h3>
                  <div className="chip-list">
                    <span>Cloud Provider</span>
                    <span>CDN</span>
                    <span>Auto Scaling</span>
                  </div>
                </article>
                <article className="stack-card">
                  <h3>스토리지/캐시</h3>
                  <div className="chip-list">
                    <span>DB</span>
                    <span>Cache</span>
                    <span>Object Storage</span>
                  </div>
                </article>
                <article className="stack-card">
                  <h3>관측/알림</h3>
                  <div className="chip-list">
                    <span>Metrics</span>
                    <span>Logging</span>
                    <span>Alerting</span>
                  </div>
                </article>
              </div>
            </section>

            <section className="section" id="security">
              <div className="section-head">
                <h3>보안/안정성</h3>
                <p>권한, 보안, 성능 대응을 한 번에 정리합니다.</p>
              </div>
              <div className="project-grid two">
                <article className="project-card compact">
                  <h4>보안/권한</h4>
                  <p className="summary">[예: 토큰 인증, 역할 기반 접근, 민감정보 마스킹]</p>
                </article>
                <article className="project-card compact">
                  <h4>성능/안정성</h4>
                  <p className="summary">[예: 캐시 전략, 레이트 리밋, 장애 시 페일오버]</p>
                </article>
              </div>
            </section>

            <section className="section" id="intent">
              <div className="section-head">
                <h3>구현 의도/근거</h3>
                <p>왜 이렇게 설계했는지 트레이드오프를 명확히 적습니다.</p>
              </div>
              <div className="project-card">
                <div className="project-info">
                  <ul>
                    <li>실시간성과 비용의 균형을 맞추기 위해 캐시 계층 강화</li>
                    <li>확장 가능한 구조를 위해 수집/처리/응답 레이어 분리</li>
                    <li>단일 장애 지점을 줄이기 위해 핵심 컴포넌트 이중화</li>
                  </ul>
                </div>
                <p className="note">대안 대비 어떤 선택을 했는지 한 줄로 덧붙이면 좋습니다.</p>
              </div>
            </section>

            <section className="section" id="roadmap">
              <div className="section-head">
                <h3>한계/향후 계획</h3>
                <p>현재 제약과 다음 단계 계획을 솔직하게 적습니다.</p>
              </div>
              <div className="project-grid two">
                <article className="project-card compact">
                  <h4>현재 한계</h4>
                  <p className="summary">[예: 일부 데이터 지연, 알림 채널 제한]</p>
                </article>
                <article className="project-card compact">
                  <h4>다음 단계</h4>
                  <p className="summary">[예: 추가 데이터 소스, 고급 분석, 자동화]</p>
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

export default WebServiceTemplate
