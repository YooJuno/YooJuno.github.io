import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home.jsx'
import Portfolio from './pages/Portfolio.jsx'
import Blog from './pages/Blog.jsx'
import Post from './pages/Post.jsx'
import NotFound from './pages/NotFound.jsx'

const ScrollToTop = () => {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname, location.search])

  return null
}

const SiteNav = () => (
  <nav className="site-nav">
    <div className="container nav-inner">
      <Link className="brand" to="/">Yoo Juno</Link>
      <div className="nav-links">
        <div className="nav-item dropdown">
          <Link className="nav-link" to="/portfolio">포트폴리오</Link>
          <div className="dropdown-menu">
            <Link to="/portfolio?section=about">소개</Link>
            <Link to="/portfolio?section=focus">우선순위</Link>
            <Link to="/portfolio?section=featured">대표</Link>
            <Link to="/portfolio?section=project-library">전체</Link>
            <Link to="/portfolio?section=skills">스택</Link>
            <Link to="/portfolio?section=experience">경험</Link>
            <Link to="/portfolio?section=activities">활동</Link>
            <Link to="/portfolio?section=contact">연락</Link>
          </div>
        </div>
        <span className="nav-disabled">준비중</span>
        <span className="nav-disabled">준비중</span>
        <span className="nav-disabled">준비중</span>
      </div>
    </div>
  </nav>
)

function App() {
  return (
    <HashRouter>
      <div className="page">
        <div className="bg-noise" aria-hidden="true"></div>
        <SiteNav />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Post />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <footer className="site-footer">
          <div className="container">
            <p>© 2026 Junho Yoo. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  )
}

export default App
