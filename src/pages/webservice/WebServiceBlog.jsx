import useReveal from '../../hooks/useReveal'

function WebServiceBlog() {
  useReveal()
  return (
    <main className="section">
      <div className="container" data-reveal>
        <div className="section-head">
          <h2>웹서비스 · 블로그</h2>
          <p>개발 기록을 구조화해 공유하는 개인 블로그 서비스입니다.</p>
        </div>

        <section className="section">
          <div className="section-head">
            <h3>핵심 기능</h3>
            <p>기술 기록을 빠르게 공개하고 탐색할 수 있도록 설계합니다.</p>
          </div>
          <div className="project-grid two">
            <article className="project-card compact">
              <h4>Markdown 기반 작성</h4>
              <p className="summary">글을 Markdown으로 정리하고 요약을 함께 제공합니다.</p>
            </article>
            <article className="project-card compact">
              <h4>태그/카테고리 탐색</h4>
              <p className="summary">카테고리와 태그로 글을 빠르게 분류합니다.</p>
            </article>
            <article className="project-card compact">
              <h4>검색/필터</h4>
              <p className="summary">키워드 기반 검색으로 필요한 정보를 찾습니다.</p>
            </article>
            <article className="project-card compact">
              <h4>자동 배포</h4>
              <p className="summary">정적 페이지로 빠르게 배포할 수 있도록 구성합니다.</p>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h3>기술 스택</h3>
            <p>빠른 개발과 유지보수를 고려한 구성입니다.</p>
          </div>
          <div className="tag-row">
            <span>React</span>
            <span>Vite</span>
            <span>React Router</span>
            <span>Markdown</span>
            <span>GitHub Actions</span>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h3>고객 가치 · 기대효과</h3>
            <p>기술 정보를 정리하고 공개하는 시간을 크게 줄입니다.</p>
          </div>
          <div className="project-info">
            <ul>
              <li>개발 일지와 학습 내용을 체계적으로 아카이빙</li>
              <li>검색 가능한 형태로 콘텐츠 노출 확대</li>
              <li>포트폴리오/브랜딩 강화에 필요한 기록 축적</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  )
}

export default WebServiceBlog
