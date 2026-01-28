import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { posts, getAllTags, getAllCategories } from '../lib/posts'
import useReveal from '../hooks/useReveal'

function Blog() {
  useReveal()
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState('')
  const [activeCategory, setActiveCategory] = useState('')

  const tags = getAllTags()
  const categories = getAllCategories()

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
          <h2>?? ???</h2>
          <p>???? ??? ?? ??? ?????.</p>
        </div>

        <div className="blog-controls">
          <input
            className="blog-search"
            type="search"
            placeholder="???? ??"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            className="blog-select"
            value={activeCategory}
            onChange={(event) => setActiveCategory(event.target.value)}
          >
            <option value="">?? ????</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
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
          {(activeTag || activeCategory || query) && (
            <button
              type="button"
              className="tag-chip clear"
              onClick={() => {
                setActiveTag('')
                setActiveCategory('')
                setQuery('')
              }}
            >
              ?? ???
            </button>
          )}
        </div>

        <div className="blog-grid">
          {filtered.length === 0 && (
            <div className="empty">?? ??? ?? ????.</div>
          )}
          {filtered.map((post) => (
            <article className="post-card" key={post.slug}>
              <div className="post-meta">
                {post.category && <span className="post-category">{post.category}</span>}
                {post.date && <span>{post.date}</span>}
                <span>? {post.readingMinutes}?</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
              <div className="post-tags">
                {post.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
              <Link className="post-link" to={`/blog/${post.slug}`}>
                ? ??
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Blog
