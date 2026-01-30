import { Link, useParams } from 'react-router-dom'
import { getPostBySlug } from '../../lib/posts'

function Post() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <main className="section">
        <div className="container">
          <h2>글을 찾을 수 없습니다.</h2>
          <Link className="btn ghost" to="/blog">블로그로 돌아가기</Link>
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
            <span>읽는 시간 약 {post.readingMinutes}분</span>
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
          <Link className="btn ghost" to="/blog">블로그로 돌아가기</Link>
        </div>
      </div>
    </main>
  )
}

export default Post
