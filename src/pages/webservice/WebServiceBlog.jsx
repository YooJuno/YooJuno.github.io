import useReveal from '../../hooks/useReveal'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import '../../styles/pages/webservice.css'

function WebServiceBlog() {
  useReveal()
  useDocumentTitle()
  return (
    <main className="section">
      <div className="container is-visible" data-reveal>
        <div className="section-head">
          <h2>Portfolio & Blog</h2>
          <p>현재 포트폴리오와 블로그의 구성입니다.</p>
          <div className="meta-row">
            <span className="badge">상태: 운영 중</span>
            <span>스택: React + Vite + React Router</span>
            <span>콘텐츠: Markdown + marked</span>
          </div>
        </div>

        <section className="section" id="overview">
          <div className="project-card feature">
            <div className="project-info">
              <h3>개요</h3>
              <p className="summary">
                홈에서 아이덴티티를 보여주고, 포트폴리오/블로그/웹서비스로
                상세 정보를 확장하는 구조입니다.
              </p>
              <ul className="info-list">
                <li>
                  <span>목표</span> 개발자 포트폴리오 + 지식 기록 + 서비스 소개
                </li>
                <li>
                  <span>구성</span> Home / Portfolio / Blog / WebService
                </li>
                <li>
                  <span>데이터</span> `src/content/blog/&lt;slug&gt;/index.md` 정적 콘텐츠
                </li>
                <li>
                  <span>라우팅</span> BrowserRouter 기반 페이지 이동
                </li>
                <li>
                  <span>특징</span> 검색/태그/카테고리 + 상세 페이지 구조
                </li>
              </ul>
              <div className="tag-row">
                <span>React</span>
                <span>Vite</span>
                <span>React Router</span>
                <span>import.meta.glob</span>
                <span>IntersectionObserver</span>
              </div>
            </div>
            <div className="project-media">
              <figure className="media-tile">
                <div className="media-placeholder">사이트 맵</div>
                <figcaption>홈 → 포트폴리오/블로그/웹서비스</figcaption>
              </figure>
              <div className="pill-grid">
                <span>포트폴리오</span>
                <span>블로그</span>
                <span>웹서비스</span>
              </div>
            </div>
          </div>
        </section>

        <div className="library-grid">
          <aside className="project-index">
            <h3>목차</h3>
            <p>섹션 바로가기</p>
            <div className="index-group">
              <h4>사이트</h4>
              <a className="index-link" href="#features">핵심 기능</a>
              <a className="index-link" href="#flow">사용자 흐름</a>
              <a className="index-link" href="#ui">화면</a>
            </div>
            <div className="index-group">
              <h4>데이터</h4>
              <a className="index-link" href="#data">데이터/통신</a>
              <a className="index-link" href="#api">구성 모듈</a>
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
                <p>전체 사이트에서 사용자에게 제공되는 기능입니다.</p>
              </div>
              <div className="project-grid two">
                <article className="project-card compact">
                  <h4>포트폴리오 라이브러리</h4>
                  <p className="summary">대표/전체 프로젝트를 상세 카드로 정리.</p>
                </article>
                <article className="project-card compact">
                  <h4>블로그 검색/필터</h4>
                  <p className="summary">태그·카테고리·검색으로 글 탐색.</p>
                </article>
                <article className="project-card compact">
                  <h4>웹서비스 소개</h4>
                  <p className="summary">서비스별 기능/구조/의도를 문서화.</p>
                </article>
                <article className="project-card compact">
                  <h4>전역 네비게이션</h4>
                  <p className="summary">드롭다운 메뉴로 섹션 이동 단순화.</p>
                </article>
              </div>
            </section>

            <section className="section" id="flow">
              <div className="section-head">
                <h3>사용자 흐름</h3>
                <p>홈에서 시작해 상세 콘텐츠로 확장됩니다.</p>
              </div>
              <div className="timeline">
                <article className="timeline-item">
                  <div className="time">Step 01</div>
                  <div>
                    <h3>홈 진입</h3>
                    <p>핵심 소개 → 포트폴리오/블로그로 이동.</p>
                  </div>
                </article>
                <article className="timeline-item">
                  <div className="time">Step 02</div>
                  <div>
                    <h3>콘텐츠 탐색</h3>
                    <p>포트폴리오 상세, 블로그 검색/필터.</p>
                  </div>
                </article>
                <article className="timeline-item">
                  <div className="time">Step 03</div>
                  <div>
                    <h3>심화 보기</h3>
                    <p>프로젝트 상세/웹서비스 문서로 심화.</p>
                  </div>
                </article>
              </div>
            </section>

            <section className="section" id="ui">
              <div className="section-head">
                <h3>화면</h3>
                <p>사이트 핵심 화면과 상호작용입니다.</p>
              </div>
              <div className="media-grid">
                <figure className="media-tile">
                  <div className="media-placeholder">홈 히어로</div>
                  <figcaption>아이덴티티와 주요 CTA</figcaption>
                </figure>
                <figure className="media-tile">
                  <div className="media-placeholder">포트폴리오</div>
                  <figcaption>섹션 인덱스 + 상세 카드</figcaption>
                </figure>
                <figure className="media-tile">
                  <div className="media-placeholder">블로그</div>
                  <figcaption>검색, 태그 필터, 상세 읽기</figcaption>
                </figure>
              </div>
            </section>

            <section className="section" id="data">
              <div className="section-head">
                <h3>데이터/통신</h3>
                <p>서버 없이 정적 데이터로 동작합니다.</p>
              </div>
              <div className="project-grid two">
                <article className="project-card compact">
                  <h4>입력 데이터</h4>
                  <p className="summary">Markdown 콘텐츠 + 이미지 자산.</p>
                </article>
                <article className="project-card compact">
                  <h4>출력 데이터</h4>
                  <p className="summary">HTML 본문, 요약, 메타 정보.</p>
                </article>
                <article className="project-card compact">
                  <h4>통신 방식</h4>
                  <p className="summary">정적 빌드 + 클라이언트 렌더링.</p>
                </article>
                <article className="project-card compact">
                  <h4>예외 처리</h4>
                  <p className="summary">슬러그 누락 시 NotFound 안내.</p>
                </article>
              </div>
            </section>

            <section className="section" id="api">
              <div className="section-head">
                <h3>구성 모듈</h3>
                <p>사이트 기능을 구성하는 핵심 모듈입니다.</p>
              </div>
              <div className="project-list">
                <details className="project-detail" open>
                  <summary>
                    <span className="title">lib/posts.js</span>
                    <span className="meta">Markdown 수집/파싱</span>
                  </summary>
                  <div className="detail-body">
                    <p>Front Matter 파싱 → 요약/태그 생성.</p>
                    <ul>
                      <li>import.meta.glob로 콘텐츠 자동 수집</li>
                      <li>marked로 HTML 변환</li>
                    </ul>
                    <div className="detail-meta">src/lib/posts.js</div>
                  </div>
                </details>
                <details className="project-detail">
                  <summary>
                    <span className="title">Blog / Post 페이지</span>
                    <span className="meta">검색/필터/상세 보기</span>
                  </summary>
                  <div className="detail-body">
                    <p>검색어/태그/카테고리 기반 필터링.</p>
                    <ul>
                      <li>쿼리 파라미터로 카테고리 필터</li>
                      <li>상세 페이지에서 HTML 렌더링</li>
                    </ul>
                    <div className="detail-meta">src/pages/blog/Blog.jsx</div>
                  </div>
                </details>
                <details className="project-detail">
                  <summary>
                    <span className="title">Portfolio 페이지</span>
                    <span className="meta">섹션/프로젝트 인덱싱</span>
                  </summary>
                  <div className="detail-body">
                    <p>IntersectionObserver로 섹션/프로젝트 강조.</p>
                    <ul>
                      <li>상단 인덱스로 섹션 이동</li>
                      <li>이미지 클릭 시 라이트박스</li>
                    </ul>
                    <div className="detail-meta">src/pages/Portfolio.jsx</div>
                  </div>
                </details>
              </div>
            </section>

            <section className="section" id="architecture">
              <div className="section-head">
                <h3>시스템 아키텍처</h3>
                <p>콘텐츠 수집 → 변환 → UI 렌더링 흐름을 보여줍니다.</p>
              </div>
              <div className="project-card feature">
                <figure className="media-tile">
                  <div className="media-placeholder">아키텍처 다이어그램</div>
                  <figcaption>Markdown → Parser → React UI</figcaption>
                </figure>
                <div className="project-info">
                  <h4>데이터 흐름 요약</h4>
                  <ul>
                    <li>Markdown 파일을 빌드 시 자동 수집</li>
                    <li>Front Matter 파싱으로 메타데이터 생성</li>
                    <li>marked로 HTML 변환 후 렌더링</li>
                    <li>Router로 페이지 전환</li>
                  </ul>
                  <p className="note">서버 API 없이 정적 구조로 운영됩니다.</p>
                </div>
              </div>
            </section>

            <section className="section" id="infra">
              <div className="section-head">
                <h3>인프라</h3>
                <p>정적 빌드/배포를 기반으로 단순하게 운영합니다.</p>
              </div>
              <div className="stack-grid">
                <article className="stack-card">
                  <h3>빌드</h3>
                  <div className="chip-list">
                    <span>Vite</span>
                    <span>Static Assets</span>
                    <span>CSS</span>
                  </div>
                </article>
                <article className="stack-card">
                  <h3>배포</h3>
                  <div className="chip-list">
                    <span>Static Hosting</span>
                    <span>CDN Cache</span>
                    <span>SPA Routing</span>
                  </div>
                </article>
                <article className="stack-card">
                  <h3>부가</h3>
                  <div className="chip-list">
                    <span>Google AdSense 슬롯</span>
                    <span>Global Navigation</span>
                    <span>Footer</span>
                  </div>
                </article>
              </div>
            </section>

            <section className="section" id="security">
              <div className="section-head">
                <h3>보안/안정성</h3>
                <p>정적 사이트 특성에 맞게 위험을 최소화합니다.</p>
              </div>
              <div className="project-grid two">
                <article className="project-card compact">
                  <h4>보안/권한</h4>
                  <p className="summary">외부 입력이 없어 공격면이 낮습니다.</p>
                </article>
                <article className="project-card compact">
                  <h4>안정성</h4>
                  <p className="summary">정적 배포로 장애 영향 최소화.</p>
                </article>
              </div>
              <p className="note">
                Markdown 렌더링은 저장소 내부 콘텐츠만 사용합니다.
              </p>
            </section>

            <section className="section" id="intent">
              <div className="section-head">
                <h3>설계</h3>
                <p>관리 비용을 줄이면서도 상세한 정보를 전달합니다.</p>
              </div>
              <div className="project-card">
                <div className="project-info">
                  <ul>
                    <li>CMS 없이 파일 기반으로 운영 단순화</li>
                    <li>포트폴리오/블로그/웹서비스를 분리해 정보 구조화</li>
                    <li>검색/필터 중심으로 콘텐츠 접근성 강화</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="section" id="roadmap">
              <div className="section-head">
                <h3>향후 계획</h3>
                <p>콘텐츠 관리와 검색 기능을 개선할 예정입니다.</p>
              </div>
              <div className="project-grid two">
                <article className="project-card compact">
                  <h4>현재 범위</h4>
                  <p className="summary">정적 콘텐츠 중심, 상호작용 기능 제한.</p>
                </article>
                <article className="project-card compact">
                  <h4>확장 포인트</h4>
                  <p className="summary">카테고리 콘텐츠 확장, 웹서비스 상세 고도화.</p>
                </article>
              </div>
              <div className="project-links">
                <a className="chip-link" href="#overview">개요로 돌아가기</a>
                <a className="chip-link muted" href="#architecture">아키텍처 섹션</a>
                <a className="chip-link muted" href="#features">핵심 기능</a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

export default WebServiceBlog
