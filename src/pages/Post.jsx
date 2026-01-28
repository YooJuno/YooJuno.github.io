import { Link, useParams } from 'react-router-dom'
import { getPostBySlug } from '../lib/posts'

function Post() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <main className="section">
        <div className="container">
          <h2>?? ?? ? ????.</h2>
          <Link className="btn ghost" to="/blog">????</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="section post-main">
      <div className="container">
        <div className="post-header">
          <p className="post-meta">
            {post.category && <span className="post-category">{post.category}</span>}
            {post.date && <span>{post.date}</span>}
            <span>? {post.readingMinutes}?</span>
          </p>
          <h1>{post.title}</h1>
          <div className="post-tags">
            {post.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </div>
        <article
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        <div className="post-footer">
          <Link className="btn ghost" to="/blog">????</Link>
        </div>
      </div>
    </main>
  )
}

export default Post
