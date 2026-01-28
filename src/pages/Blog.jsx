import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { posts, getAllTags } from '../lib/posts'
import useReveal from '../hooks/useReveal'

function Blog() {
  useReveal()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState('')
  const [activeCategory, setActiveCategory] = useState('')

  const tags = getAllTags()

  useEffect(() => {
    const category = searchParams.get('category') || ''
    setActiveCategory(category)
  }, [searchParams])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter((post) => {
      const haystack = [
        post.title,
        post.summary,
        post.category,
        post.tags.join(' '),
        post.raw,
      ]
        .join(' ')
        .toLowerCase()

      const matchesQuery = !q || haystack.includes(q)
      const matchesTag = !activeTag || post.tags.includes(activeTag)
      const matchesCategory = !activeCategory || post.category === activeCategory

      return matchesQuery && matchesTag && matchesCategory
    })
  }, [query, activeTag, activeCategory])

  return (
    <main className="section blog-main">
      <div className="container" data-reveal>
        <div className="section-head">
          <h2>블로그</h2>
          <p>개발, 코딩테스트, 음악, 여행 그리고 기술 메모를 차분하게 기록합니다.</p>
          {activeCategory && (
            <p className="category-note">현재 카테고리: {activeCategory}</p>
          )}
        </div>

        <div className="blog-controls">
          <input
            className="blog-search"
            type="search"
            placeholder="검색어를 입력하세요"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="blog-tags">
          {tags.map((tag) => (
            <button
              type="button"
              key={tag}
              className={`tag-chip${activeTag === tag ? ' is-active' : ''}`}
              onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="blog-grid">
          {filtered.length === 0 && (
            <div className="empty">
              {activeCategory
                ? `“${activeCategory}” 카테고리에 글이 없습니다. 준비중입니다.`
                : '아직 작성된 글이 없습니다.'}
            </div>
          )}
          {filtered.map((post) => (
            <article className="post-card" key={post.slug}>
              <div className="post-meta">
                {post.category && <span className="post-category">{post.category}</span>}
                {post.date && <span>{post.date}</span>}
                <span>읽는 시간 약 {post.readingMinutes}분</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
              <div className="post-tags">
                {post.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
              <Link className="post-link" to={`/blog/${post.slug}`}>
                자세히 보기
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Blog
