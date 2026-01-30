import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home.jsx'

import Portfolio from './pages/Portfolio.jsx'
import Blog from './pages/blog/Blog.jsx'
import Post from './pages/blog/Post.jsx'

import WebService from './pages/webservice/WebService.jsx'
import WebServiceBlog from './pages/webservice/WebServiceBlog.jsx'
import WebServiceCctv from './pages/webservice/WebServiceCctv.jsx'
import WebServiceVideo from './pages/webservice/WebServiceVideo.jsx'
import WebServiceBtc from './pages/webservice/WebServiceBtc.jsx'

import Major from './pages/blog/Major.jsx'
import Music from './pages/blog/Music.jsx'
import Travel from './pages/blog/Travel.jsx'

import NotFound from './pages/NotFound.jsx'

const ScrollToTop = () => {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [location.pathname, location.search])

  return null
}


const AdSlot = () => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.adsbygoogle = window.adsbygoogle || []
        window.adsbygoogle.push({})
      }
    } catch (err) {
      // ignore ad errors during development
    }
  }, [])

  return (
    <div className="ad-container">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9290056343148248"
        data-ad-slot="0000000000"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  )
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
        <div className="nav-item dropdown">
          <Link className="nav-link" to="/blog">블로그</Link>
          <div className="dropdown-menu">
            <Link to="/blog?category=개발">개발</Link>
            <Link to="/blog?category=음악">음악</Link>
            <Link to="/blog?category=여행">여행</Link>
            <Link to="/blog?category=코딩테스트">코딩테스트</Link>
          </div>
        </div>
        <div className="nav-item dropdown">
          <Link className="nav-link" to="/web-service">웹서비스</Link>
          <div className="dropdown-menu">
            <Link to="/web-service/blog">블로그</Link>
            <Link to="/web-service/cctv-streaming">CCTV Streaming</Link>
            <Link to="/web-service/video-chatting">Video Chatting</Link>
            <Link to="/web-service/bitcoin-auto-trader">Bitcoin Auto Trader</Link>
          </div>
        </div>
      </div>
    </div>
  </nav>
)

function App() {
  return (
    <BrowserRouter>
      <div className="page">
        <div className="bg-noise" aria-hidden="true"></div>
        <SiteNav />
        <ScrollToTop />
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
          <Route path="/major" element={<Major />} />
          <Route path="/music" element={<Music />} />
          <Route path="/travel" element={<Travel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AdSlot />
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


