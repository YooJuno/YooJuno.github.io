import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigationType, useSearchParams } from 'react-router-dom'
import { getCachedSearchText, loadSearchText, posts } from '../../lib/posts'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import '../../styles/pages/blog.css'

function Blog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigationType = useNavigationType()
  const searchInput = useRef(null)
  const urlQuery = searchParams.get('q') || ''
  const [searchDraft, setSearchDraft] = useState({ locationKey: location.key, value: urlQuery })
  const query = searchDraft.locationKey === location.key
    || (navigationType === 'REPLACE' && location.state?.blogSearch === true)
    ? searchDraft.value : urlQuery
  if (searchDraft.locationKey !== location.key) {
    setSearchDraft({ locationKey: location.key, value: query })
  }
  const activeCategory = searchParams.get('category') || ''
  const normalizedQuery = query.trim().toLowerCase()
  const deferredQuery = useDeferredValue(normalizedQuery)
  const [searchText, setSearchText] = useState(getCachedSearchText)
  const [searchError, setSearchError] = useState(false)

  useDocumentTitle(activeCategory ? `블로그 · ${activeCategory}` : undefined)

  useEffect(() => {
    if (!normalizedQuery || searchText) return undefined
    let current = true
    loadSearchText().then(
      text => {
        if (current) {
          setSearchText(text)
          setSearchError(false)
        }
      },
      () => { if (current) setSearchError(true) },
    )
    return () => { current = false }
  }, [normalizedQuery, searchText])

  const filtered = useMemo(() => posts.filter(post => {
    if (activeCategory && post.category !== activeCategory) return false
    if (!deferredQuery) return true
    const text = [post.title, post.summary, post.category, post.tags.join(' '), searchText?.[post.slug] || '']
      .join(' ').toLowerCase()
    return text.includes(deferredQuery)
  }), [deferredQuery, activeCategory, searchText])

  const searching = Boolean(normalizedQuery && ((!searchText && !searchError) || normalizedQuery !== deferredQuery))
  const resultParams = new URLSearchParams(searchParams)
  if (query) resultParams.set('q', query)
  else resultParams.delete('q')
  const resultSearch = resultParams.toString()
  const updateQuery = value => {
    setSearchDraft({ locationKey: location.key, value })
    const next = new URLSearchParams(searchParams)
    if (value) next.set('q', value)
    else next.delete('q')
    setSearchParams(next, { replace: true, preventScrollReset: true, state: { blogSearch: true } })
  }

  return (
    <main className="section blog-main" id="main-content">
      <div className="container">
        <header className="section-head">
          <h1>블로그</h1>
          <p>개발 과정과 기술 메모를 기록합니다.</p>
          {activeCategory && (
            <p className="category-note"><span>{activeCategory}</span><Link to="/blog">전체 글</Link></p>
          )}
        </header>

        <form className="blog-controls" role="search" onSubmit={event => event.preventDefault()}>
          <label className="visually-hidden" htmlFor="blog-search">글 검색</label>
          <input
            id="blog-search"
            className="blog-search"
            ref={searchInput}
            type="search"
            placeholder="제목, 본문, 키워드 검색"
            value={query}
            onChange={event => updateQuery(event.target.value)}
          />
          {query && (
            <button className="blog-search-clear" type="button" aria-label="검색어 지우기" onClick={() => {
              updateQuery('')
              searchInput.current?.focus()
            }}>지우기</button>
          )}
        </form>
        <p className="blog-result-summary" role="status" aria-live="polite">
          {searching ? '본문 검색 중…' : `${filtered.length}개의 글`}
        </p>
        {searchError && normalizedQuery && <p className="blog-search-error" role="alert">본문 검색을 불러오지 못했습니다. 제목·요약·키워드로 검색한 결과입니다.</p>}

        <div className="blog-grid blog-list single" aria-busy={searching}>
          {!searching && filtered.length === 0 && (
            <div className="empty">
              <p>{normalizedQuery ? '검색 결과가 없습니다.' : activeCategory ? `“${activeCategory}” 카테고리에 등록된 글이 없습니다.` : '아직 등록된 글이 없습니다.'}</p>
              {normalizedQuery && <button type="button" className="text-button" onClick={() => updateQuery('')}>검색어 지우기</button>}
              {activeCategory && <Link to="/blog">전체 글 보기</Link>}
            </div>
          )}
          {filtered.map(post => (
            <Link
              className="post-card post-link-card"
              key={post.slug}
              to={`/blog/${post.slug}`}
              state={{ from: `${location.pathname}${resultSearch ? `?${resultSearch}` : ''}` }}
              aria-label={`${post.title} 자세히 보기`}
            >
              <div className="post-meta">
                <span className="post-category">{post.category}</span>
                <time dateTime={post.date}>{post.date}</time>
              </div>
              <h2>{post.title}</h2>
              <p>{post.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Blog
