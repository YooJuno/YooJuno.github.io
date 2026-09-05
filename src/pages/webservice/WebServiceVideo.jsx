import useReveal from '../../hooks/useReveal'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import '../../styles/pages/webservice.css'

function WebServiceVideo() {
  useReveal()
  useDocumentTitle()
  return (
    <main className="section">
      <div className="container is-visible" data-reveal>
        <div className="section-head">
          <h1>Video Chatting</h1>
          <p>브라우저에서 바로 연결되는 실시간 영상 통화 서비스입니다.</p>
          <div className="meta-row">
            <span className="badge">상태: 설계/구현 중</span>
            <span>플랫폼: Web</span>
            <span>업데이트: 2026-02-04</span>
          </div>
        </div>

        <section className="section" id="overview">
          <div className="project-card feature">
            <div className="project-info">
              <h3>개요</h3>
              <p className="summary">
                설치 없이 바로 연결되는 영상 통화 경험을 제공하고,
                확장 가능한 회의 구조를 설계합니다.
              </p>
              <ul className="info-list">
                <li>
                  <span>대상</span> 원격 협업, 상담, 커뮤니케이션 사용자
                </li>
                <li>
                  <span>문제</span> 복잡한 설정과 연결 품질 불안정
                </li>
                <li>
                  <span>핵심</span> 빠른 연결 + 안정적 품질 + 다자 확장
                </li>
                <li>
                  <span>데이터</span> 실시간 오디오/비디오 스트림
                </li>
                <li>
                  <span>확장</span> 화면 공유, 녹화, 회의 관리
                </li>
              </ul>
              <div className="tag-row">
                <span>WebRTC</span>
                <span>WebSocket</span>
                <span>STUN/TURN</span>
                <span>React</span>
                <span>Media</span>
              </div>
            </div>
            <div className="project-media">
              <figure className="media-tile">
                <div className="media-placeholder">대표 화면 이미지</div>
                <figcaption>영상 통화 화면 / 참가자 상태</figcaption>
              </figure>
              <div className="pill-grid">
                <span>빠른 연결</span>
                <span>저지연</span>
                <span>화면 공유</span>
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
                <p>저지연 통화와 협업 중심 기능을 정리합니다.</p>
              </div>
              <div className="project-grid two">
                <article className="project-card compact">
                  <h4>실시간 통화</h4>
                  <p className="summary">브라우저에서 바로 영상 통화를 시작합니다.</p>
                </article>
                <article className="project-card compact">
                  <h4>다자 확장</h4>
                  <p className="summary">필요에 따라 그룹 통화로 확장 가능합니다.</p>
                </article>
                <article className="project-card compact">
                  <h4>네트워크 적응</h4>
                  <p className="summary">품질 저하 시 자동으로 화질을 조정합니다.</p>
                </article>
                <article className="project-card compact">
                  <h4>부가 기능</h4>
                  <p className="summary">채팅/화면 공유 등 협업 도구를 제공합니다.</p>
                </article>
              </div>
            </section>

            <section className="section" id="flow">
              <div className="section-head">
                <h3>사용자 흐름</h3>
                <p>룸 생성 → 연결 → 종료 흐름을 정리합니다.</p>
              </div>
              <div className="timeline">
                <article className="timeline-item">
                  <div className="time">Step 01</div>
                  <div>
                    <h3>룸 생성/입장</h3>
                    <p>링크 또는 초대로 룸에 입장합니다.</p>
                  </div>
                </article>
                <article className="timeline-item">
                  <div className="time">Step 02</div>
                  <div>
                    <h3>연결 및 통화</h3>
                    <p>자동 연결 후 통화와 협업이 시작됩니다.</p>
                  </div>
                </article>
                <article className="timeline-item">
                  <div className="time">Step 03</div>
                  <div>
                    <h3>종료/정리</h3>
                    <p>통화 종료 후 기록/요약을 제공합니다.</p>
                  </div>
                </article>
              </div>
            </section>

            <section className="section" id="ui">
              <div className="section-head">
                <h3>화면</h3>
                <p>참여자 상태와 제어 버튼 중심의 구성입니다.</p>
              </div>
              <div className="media-grid">
                <figure className="media-tile">
                  <div className="media-placeholder">통화 화면</div>
                  <figcaption>참여자 영상과 상태 표시</figcaption>
                </figure>
                <figure className="media-tile">
                  <div className="media-placeholder">룸 목록</div>
                  <figcaption>예약/진행 중 룸 리스트</figcaption>
                </figure>
                <figure className="media-tile">
                  <div className="media-placeholder">컨트롤</div>
                  <figcaption>음소거, 화면 공유, 종료</figcaption>
                </figure>
              </div>
            </section>

            <section className="section" id="data">
              <div className="section-head">
                <h3>데이터/통신</h3>
                <p>미디어 스트림과 시그널링 흐름을 정리합니다.</p>
              </div>
              <div className="project-grid two">
                <article className="project-card compact">
                  <h4>입력 데이터</h4>
                  <p className="summary">오디오/비디오 스트림, 룸 설정.</p>
                </article>
                <article className="project-card compact">
                  <h4>출력 데이터</h4>
                  <p className="summary">참여자 스트림, 상태 이벤트.</p>
                </article>
                <article className="project-card compact">
                  <h4>통신 방식</h4>
                  <p className="summary">WebRTC + WebSocket 시그널링.</p>
                </article>
                <article className="project-card compact">
                  <h4>실패/재시도</h4>
                  <p className="summary">재연결, 품질 다운그레이드.</p>
                </article>
              </div>
            </section>

            <section className="section" id="api">
              <div className="section-head">
                <h3>API 요약</h3>
                <p>룸 관리와 상태 확인을 위한 최소 API입니다.</p>
              </div>
              <div className="project-list">
                <details className="project-detail" open>
                  <summary>
                    <span className="title">POST /api/v1/rooms</span>
                    <span className="meta">인증: 토큰 | 응답: 룸 생성</span>
                  </summary>
                  <div className="detail-body">
                    <p>영상 통화 룸을 생성합니다.</p>
                    <ul>
                      <li>요청: 제목, 옵션</li>
                      <li>응답: 룸 ID, 접속 링크</li>
                    </ul>
                    <div className="detail-meta">에러: 400, 401, 500</div>
                  </div>
                </details>
                <details className="project-detail">
                  <summary>
                    <span className="title">POST /api/v1/rooms/:id/join</span>
                    <span className="meta">인증: 토큰 | 응답: 참여</span>
                  </summary>
                  <div className="detail-body">
                    <p>룸에 참여하고 시그널링 정보를 받습니다.</p>
                    <ul>
                      <li>요청: 사용자 정보</li>
                      <li>응답: SDP/ICE 정보</li>
                    </ul>
                    <div className="detail-meta">에러: 401, 404, 500</div>
                  </div>
                </details>
                <details className="project-detail">
                  <summary>
                    <span className="title">GET /api/v1/rooms/:id/state</span>
                    <span className="meta">인증: 토큰 | 응답: 상태</span>
                  </summary>
                  <div className="detail-body">
                    <p>룸 상태와 참여자 정보를 제공합니다.</p>
                    <ul>
                      <li>요청: 룸 ID</li>
                      <li>응답: 참여자, 품질 상태</li>
                    </ul>
                    <div className="detail-meta">에러: 401, 404, 500</div>
                  </div>
                </details>
              </div>
            </section>

            <section className="section" id="architecture">
              <div className="section-head">
                <h3>시스템 아키텍처</h3>
                <p>시그널링과 미디어 흐름을 단순하게 유지합니다.</p>
              </div>
              <div className="project-card feature">
                <figure className="media-tile">
                  <div className="media-placeholder">아키텍처 다이어그램</div>
                  <figcaption>Client ↔ Signaling ↔ STUN/TURN</figcaption>
                </figure>
                <div className="project-info">
                  <h4>데이터 흐름 요약</h4>
                  <ul>
                    <li>클라이언트가 룸에 접속</li>
                    <li>시그널링 서버에서 연결 협상</li>
                    <li>WebRTC로 미디어 스트림 교환</li>
                    <li>필요 시 TURN 서버 사용</li>
                  </ul>
                  <p className="note">네트워크 환경에 따른 품질 저하를 최소화합니다.</p>
                </div>
              </div>
            </section>

            <section className="section" id="infra">
              <div className="section-head">
                <h3>인프라</h3>
                <p>미디어 연결을 위한 기본 인프라를 구성합니다.</p>
              </div>
              <div className="stack-grid">
                <article className="stack-card">
                  <h3>시그널링</h3>
                  <div className="chip-list">
                    <span>WebSocket</span>
                    <span>Session</span>
                    <span>Auth</span>
                  </div>
                </article>
                <article className="stack-card">
                  <h3>미디어</h3>
                  <div className="chip-list">
                    <span>STUN/TURN</span>
                    <span>WebRTC</span>
                    <span>QoS</span>
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
                <p>접근 통제와 미디어 권한을 관리합니다.</p>
              </div>
              <div className="project-grid two">
                <article className="project-card compact">
                  <h4>보안/권한</h4>
                  <p className="summary">토큰 인증, 룸 접근 제한.</p>
                </article>
                <article className="project-card compact">
                  <h4>안정성</h4>
                  <p className="summary">재연결, 품질 자동 조정.</p>
                </article>
              </div>
            </section>

            <section className="section" id="intent">
              <div className="section-head">
                <h3>설계</h3>
                <p>접속 과정과 미디어 연결 단계를 분리했습니다.</p>
              </div>
              <div className="project-card">
                <div className="project-info">
                  <ul>
                    <li>설치 없이 즉시 접속 가능한 경험 제공</li>
                    <li>시그널링/미디어 분리로 확장성 확보</li>
                    <li>낮은 지연과 안정성을 균형 있게 설계</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="section" id="roadmap">
              <div className="section-head">
                <h3>향후 계획</h3>
                <p>협업 기능과 기록 기능을 강화할 예정입니다.</p>
              </div>
              <div className="project-grid two">
                <article className="project-card compact">
                  <h4>현재 한계</h4>
                  <p className="summary">기본 통화 중심의 기능에 집중.</p>
                </article>
                <article className="project-card compact">
                  <h4>다음 단계</h4>
                  <p className="summary">녹화/자막/회의실 관리 기능 도입.</p>
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

export default WebServiceVideo
