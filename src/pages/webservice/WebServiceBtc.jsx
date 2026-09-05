import useReveal from '../../hooks/useReveal'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import '../../styles/pages/webservice.css'

function WebServiceBtc() {
  useReveal()
  useDocumentTitle()
  return (
    <main className="section">
      <div className="container is-visible" data-reveal>
        <div className="section-head">
          <h1>Bitcoin Auto Trader</h1>
          <p>전략 설정과 자동매매 실행을 연결한 서비스입니다.</p>
          <div className="meta-row">
            <span className="badge">상태: 설계/구현 중</span>
            <span>플랫폼: Web · API</span>
            <span>업데이트: 2026-02-04</span>
          </div>
        </div>

        <section className="section" id="overview">
          <div className="project-card feature">
            <div className="project-info">
              <h3>개요</h3>
              <p className="summary">
                종목 추천부터 전략 선택, 자동 실행까지 한 번에 연결해
                누구나 손쉽게 자동매매를 시작할 수 있도록 설계합니다.
              </p>
              <ul className="info-list">
                <li>
                  <span>대상</span> 자동매매를 시작하고 싶은 초중급 트레이더
                </li>
                <li>
                  <span>문제</span> 전략 구축과 반복 매매의 높은 진입 장벽
                </li>
                <li>
                  <span>핵심</span> 종목 추천 + 전략 추천 + 자동 실행
                </li>
                <li>
                  <span>데이터</span> Upbit API 기반 실시간 시세/주문
                </li>
                <li>
                  <span>확장</span> 선물/주식까지 확장 가능한 구조
                </li>
              </ul>
              <div className="tag-row">
                <span>React</span>
                <span>Spring Boot</span>
                <span>PostgreSQL</span>
                <span>Upbit API</span>
                <span>Strategy Engine</span>
              </div>
            </div>
            <div className="project-media">
              <figure className="media-tile">
                <div className="media-placeholder">대표 화면 이미지</div>
                <figcaption>자동매매 대시보드 / 핵심 지표 요약</figcaption>
              </figure>
              <div className="pill-grid">
                <span>자동매매 실행</span>
                <span>전략 추천</span>
                <span>맞춤 지표</span>
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
                <p>전략 설정, 실행, 결과 확인 기능입니다.</p>
              </div>
              <div className="project-grid two">
                <article className="project-card compact">
                  <h4>종목 추천</h4>
                  <p className="summary">시장 흐름과 조건에 맞는 종목을 제안합니다.</p>
                </article>
                <article className="project-card compact">
                  <h4>전략 추천</h4>
                  <p className="summary">스캘핑·스윙 등 성향에 맞는 전략을 제시합니다.</p>
                </article>
                <article className="project-card compact">
                  <h4>맞춤 지표</h4>
                  <p className="summary">사용자 맞춤 지표/룰로 전략을 세밀하게 조정합니다.</p>
                </article>
                <article className="project-card compact">
                  <h4>자동 실행</h4>
                  <p className="summary">선택한 전략을 자동으로 실행하고 결과를 요약합니다.</p>
                </article>
              </div>
            </section>

            <section className="section" id="flow">
              <div className="section-head">
                <h3>사용자 흐름</h3>
                <p>진입 → 설정 → 실행 → 피드백까지 흐름을 정리합니다.</p>
              </div>
              <div className="timeline">
                <article className="timeline-item">
                  <div className="time">Step 01</div>
                  <div>
                    <h3>전략 선택/설정</h3>
                    <p>종목 추천과 전략 추천을 확인하고 조건을 설정합니다.</p>
                  </div>
                </article>
                <article className="timeline-item">
                  <div className="time">Step 02</div>
                  <div>
                    <h3>자동매매 실행</h3>
                    <p>설정된 전략이 실시간으로 주문을 실행합니다.</p>
                  </div>
                </article>
                <article className="timeline-item">
                  <div className="time">Step 03</div>
                  <div>
                    <h3>결과 분석/개선</h3>
                    <p>성과 리포트와 지표를 보고 전략을 개선합니다.</p>
                  </div>
                </article>
              </div>
            </section>

            <section className="section" id="ui">
              <div className="section-head">
                <h3>화면</h3>
                <p>대표 화면과 핵심 인터랙션을 요약합니다.</p>
              </div>
              <div className="media-grid">
                <figure className="media-tile">
                  <div className="media-placeholder">대시보드</div>
                  <figcaption>핵심 지표와 자동매매 상태 요약</figcaption>
                </figure>
                <figure className="media-tile">
                  <div className="media-placeholder">전략 선택</div>
                  <figcaption>스캘핑/스윙 전략 및 조건 설정</figcaption>
                </figure>
                <figure className="media-tile">
                  <div className="media-placeholder">성과 리포트</div>
                  <figcaption>수익률/리스크 지표 비교</figcaption>
                </figure>
              </div>
            </section>

            <section className="section" id="data">
              <div className="section-head">
                <h3>데이터/통신</h3>
                <p>입력/출력/통신 방식과 실패 처리 기준을 명확히 합니다.</p>
              </div>
              <div className="project-grid two">
                <article className="project-card compact">
                  <h4>입력 데이터</h4>
                  <p className="summary">실시간 시세, 호가, 체결, 잔고, 사용자 설정.</p>
                </article>
                <article className="project-card compact">
                  <h4>출력 데이터</h4>
                  <p className="summary">주문/체결 결과, 알림, 성과 리포트.</p>
                </article>
                <article className="project-card compact">
                  <h4>통신 방식</h4>
                  <p className="summary">REST + WebSocket 기반 실시간 갱신.</p>
                </article>
                <article className="project-card compact">
                  <h4>실패/재시도</h4>
                  <p className="summary">레이트 리밋 대응, 재시도, 안전 중지.</p>
                </article>
              </div>
            </section>

            <section className="section" id="api">
              <div className="section-head">
                <h3>API 요약</h3>
                <p>핵심 엔드포인트와 데이터 흐름을 요약합니다.</p>
              </div>
              <div className="project-list">
                <details className="project-detail" open>
                  <summary>
                    <span className="title">GET /api/v1/markets</span>
                    <span className="meta">인증: 토큰 | 응답: 종목 목록</span>
                  </summary>
                  <div className="detail-body">
                    <p>추천 후보 종목과 필터링 가능한 메타 정보를 제공합니다.</p>
                    <ul>
                      <li>요청: 조건, 카테고리</li>
                      <li>응답: 종목, 변동성, 관심도</li>
                    </ul>
                    <div className="detail-meta">에러: 401, 429, 500</div>
                  </div>
                </details>
                <details className="project-detail">
                  <summary>
                    <span className="title">POST /api/v1/strategies/run</span>
                    <span className="meta">인증: 토큰 | 응답: 실행 결과</span>
                  </summary>
                  <div className="detail-body">
                    <p>선택한 전략을 실행하고 자동매매 세션을 시작합니다.</p>
                    <ul>
                      <li>요청: 전략, 자산, 리스크 설정</li>
                      <li>응답: 세션 ID, 상태</li>
                    </ul>
                    <div className="detail-meta">에러: 400, 409, 500</div>
                  </div>
                </details>
                <details className="project-detail">
                  <summary>
                    <span className="title">GET /api/v1/performance</span>
                    <span className="meta">인증: 토큰 | 응답: 성과 리포트</span>
                  </summary>
                  <div className="detail-body">
                    <p>전략별 성과와 리스크 지표를 제공합니다.</p>
                    <ul>
                      <li>요청: 기간, 전략 ID</li>
                      <li>응답: 수익률, MDD, 승률</li>
                    </ul>
                    <div className="detail-meta">에러: 401, 500</div>
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
                  <figcaption>사용자 → 백엔드 → 거래소 → 리포트 흐름</figcaption>
                </figure>
                <div className="project-info">
                  <h4>데이터 흐름 요약</h4>
                  <ul>
                    <li>Front-end에서 전략/조건 설정</li>
                    <li>Spring Boot가 주문 로직과 전략 엔진 수행</li>
                    <li>Upbit API를 통해 주문/체결 처리</li>
                    <li>PostgreSQL에 로그와 성과 저장</li>
                  </ul>
                  <p className="note">선물/주식 확장을 위해 거래소 어댑터를 분리합니다.</p>
                </div>
              </div>
            </section>

            <section className="section" id="infra">
              <div className="section-head">
                <h3>인프라</h3>
                <p>배포, 저장소, 관측 체계를 간단히 정리합니다.</p>
              </div>
              <div className="stack-grid">
                <article className="stack-card">
                  <h3>백엔드</h3>
                  <div className="chip-list">
                    <span>Spring Boot</span>
                    <span>REST API</span>
                    <span>Strategy Engine</span>
                  </div>
                </article>
                <article className="stack-card">
                  <h3>데이터</h3>
                  <div className="chip-list">
                    <span>PostgreSQL</span>
                    <span>Trade Logs</span>
                    <span>Performance</span>
                  </div>
                </article>
                <article className="stack-card">
                  <h3>운영</h3>
                  <div className="chip-list">
                    <span>모니터링</span>
                    <span>알림</span>
                    <span>백업</span>
                  </div>
                </article>
              </div>
            </section>

            <section className="section" id="security">
              <div className="section-head">
                <h3>보안/안정성</h3>
                <p>사용자 자산과 시스템 안정성을 함께 고려합니다.</p>
              </div>
              <div className="project-grid two">
                <article className="project-card compact">
                  <h4>보안/권한</h4>
                  <p className="summary">API 키 암호화 저장, 역할 기반 접근 제어.</p>
                </article>
                <article className="project-card compact">
                  <h4>안정성</h4>
                  <p className="summary">레이트 리밋 대응, 실패 시 안전 중지.</p>
                </article>
              </div>
              <p className="note">
                자동매매는 투자 손실 위험이 있으므로 리스크 고지와 안전장치가 필수입니다.
              </p>
            </section>

            <section className="section" id="intent">
              <div className="section-head">
                <h3>설계</h3>
                <p>전략과 실행 로직을 분리해 확장할 수 있도록 구성했습니다.</p>
              </div>
              <div className="project-card">
                <div className="project-info">
                  <ul>
                    <li>전략 추천과 자동 실행으로 진입 장벽 최소화</li>
                    <li>거래소 어댑터 분리로 선물/주식 확장 대응</li>
                    <li>맞춤 지표/룰 기반으로 사용자 자유도 극대화</li>
                  </ul>
                </div>
                <p className="note">수익률 개선을 돕되, 과도한 기대를 방지하는 정보 제공.</p>
              </div>
            </section>

            <section className="section" id="roadmap">
              <div className="section-head">
                <h3>향후 계획</h3>
                <p>백테스트와 리스크 관리 기능을 추가할 예정입니다.</p>
              </div>
              <div className="project-grid two">
                <article className="project-card compact">
                  <h4>현재 한계</h4>
                  <p className="summary">현재는 현물 BTC 중심 기능에 집중합니다.</p>
                </article>
                <article className="project-card compact">
                  <h4>다음 단계</h4>
                  <p className="summary">선물/주식 확장, 전략 마켓, 자동 리밸런싱.</p>
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

export default WebServiceBtc
