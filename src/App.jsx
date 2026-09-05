import { BrowserRouter, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect, useState } from 'react'
import Home from './pages/Home.jsx'

// 첫 화면(Home)만 즉시 불러오고 나머지는 방문할 때 받는다.
// 특히 블로그는 marked 와 모든 글의 본문을 함께 들고 있어, 이걸 나누지 않으면
// 홈만 봐도 글 전체를 내려받게 된다.
const Portfolio = lazy(() => import('./pages/Portfolio.jsx'))
const Blog = lazy(() => import('./pages/blog/Blog.jsx'))
const Post = lazy(() => import('./pages/blog/Post.jsx'))

const WebService = lazy(() => import('./pages/webservice/WebService.jsx'))
const WebServiceBlog = lazy(() => import('./pages/webservice/WebServiceBlog.jsx'))
const WebServiceCctv = lazy(() => import('./pages/webservice/WebServiceCctv.jsx'))
const WebServiceVideo = lazy(() => import('./pages/webservice/WebServiceVideo.jsx'))
const WebServiceBtc = lazy(() => import('./pages/webservice/WebServiceBtc.jsx'))

const NotFound = lazy(() => import('./pages/NotFound.jsx'))
import ErrorBoundary from './components/ErrorBoundary.jsx'

const ScrollToTop = () => {
  const location = useLocation()

  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    const isPortfolioAnchor = location.pathname === '/portfolio'
      && new URLSearchParams(location.search).has('section')
    if (!isPortfolioAnchor) {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.search])

  return null
}

// 네비게이션 구조. 모바일에서는 아코디언으로 하위 메뉴를 접어 둔다.
const NAV_SECTIONS = [
  {
    id: 'portfolio',
    to: '/portfolio',
    label: '포트폴리오',
    items: [
      { to: '/portfolio?section=about', label: '소개' },
      { to: '/portfolio?section=project-library', label: '프로젝트' },
      { to: '/portfolio?section=skills', label: '기술 스택' },
      { to: '/portfolio?section=experience', label: '경험' },
      { to: '/portfolio?section=activities', label: '활동' },
      { to: '/portfolio?section=contact', label: '연락' },
    ],
  },
  {
    id: 'blog',
    to: '/blog',
    label: '블로그',
    items: [
      { to: '/blog?category=개발', label: '개발' },
      { to: '/blog?category=음악', label: '음악' },
      { to: '/blog?category=여행', label: '여행' },
      { to: '/blog?category=코딩테스트', label: '코딩테스트' },
      { to: '/blog?category=트레이딩', label: '트레이딩' },
    ],
  },
  {
    id: 'web-service',
    to: '/web-service',
    label: '웹서비스',
    items: [
      { to: '/web-service/blog', label: '블로그' },
      { to: '/web-service/cctv-streaming', label: 'CCTV Streaming' },
      { to: '/web-service/video-chatting', label: 'Video Chatting' },
      { to: '/web-service/bitcoin-auto-trader', label: 'Bitcoin Auto Trader' },
    ],
  },
]

const SiteNav = () => {
  const [isOpen, setIsOpen] = useState(false)
  // 모바일에서 펼쳐 둔 섹션. 한 번에 하나만 연다.
  const [expandedId, setExpandedId] = useState('')

  const closeMenu = () => {
    setIsOpen(false)
    setExpandedId('')
  }

  const navClass = ({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`

  return (
    <nav className="site-nav" aria-label="주요 메뉴">
      <div className="container nav-inner">
        <Link className="brand" to="/" aria-label="홈으로 이동">
          <span className="brand-mark" aria-hidden="true">YJ</span>
          <span>Yoo Juno</span>
        </Link>

        <button
          className={`nav-toggle${isOpen ? ' is-open' : ''}`}
          type="button"
          aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          onClick={() => {
            setIsOpen((open) => !open)
            setExpandedId('')
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div
          className={`nav-links${isOpen ? ' is-open' : ''}`}
          id="primary-navigation"
          onClick={(event) => {
            if (event.target.closest('a')) closeMenu()
          }}
        >
          {NAV_SECTIONS.map((section) => {
            const expanded = expandedId === section.id

            return (
              <div
                className={`nav-item dropdown${expanded ? ' is-expanded' : ''}`}
                key={section.id}
              >
                <NavLink className={navClass} to={section.to}>
                  {section.label}
                </NavLink>
                {/* 데스크톱에서는 hover 로 열리므로 숨긴다. 모바일 전용 토글. */}
                <button
                  className="dropdown-toggle"
                  type="button"
                  aria-label={`${section.label} 하위 메뉴 ${expanded ? '접기' : '펼치기'}`}
                  aria-expanded={expanded}
                  aria-controls={`nav-menu-${section.id}`}
                  onClick={() => setExpandedId(expanded ? '' : section.id)}
                ></button>
                <div className="dropdown-menu" id={`nav-menu-${section.id}`}>
                  {section.items.map((item) => (
                    <Link key={item.to} to={item.to}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

// 오류 경계를 경로별로 두어, 한 페이지에서 예외가 나도 네비게이션/푸터는 살아 있고
// 다른 경로로 이동하면 key 변경으로 경계가 다시 마운트되며 자동 복구된다.
const AppRoutes = () => {
  const location = useLocation()

  return (
    <ErrorBoundary key={location.pathname}>
      <Suspense fallback={<main className="section" aria-busy="true" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Post />} />
          <Route path="/web-service" element={<WebService />} />
          <Route path="/web-service/blog" element={<WebServiceBlog />} />
          <Route path="/web-service/cctv-streaming" element={<WebServiceCctv />} />
          <Route path="/web-service/video-chatting" element={<WebServiceVideo />} />
          <Route path="/web-service/bitcoin-auto-trader" element={<WebServiceBtc />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="page">
        <SiteNav />
        <ScrollToTop />
        <AppRoutes />
        <footer className="site-footer">
          <div className="container">
            <p>© 2026 Junho Yoo. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
