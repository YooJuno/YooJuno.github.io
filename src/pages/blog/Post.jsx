import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getLoadedPost, getPostBySlug, loadPostBySlug } from '../../lib/posts'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import '../../styles/pages/blog.css'

function Post() {
  const { slug } = useParams()
  const location = useLocation()
  const metadata = getPostBySlug(slug)
  const [listLocation] = useState(() => location.state?.from)
  const [result, setResult] = useState(null)
  const currentResult = metadata && result?.slug === metadata.slug ? result : null
  const post = getLoadedPost(slug) || currentResult?.post
  const failed = currentResult?.error
  const from = location.state?.from || listLocation
  const backTo = typeof from === 'string' && /^\/blog\/?(?:\?|$)/.test(from) ? from : '/blog'

  useDocumentTitle(metadata ? metadata.title : '글을 찾을 수 없습니다', metadata?.summary)

  useEffect(() => {
    if (!metadata) return undefined
    let current = true
    loadPostBySlug(metadata.slug).then(
      loaded => { if (current) setResult({ slug: metadata.slug, post: loaded, error: false }) },
      () => { if (current) setResult({ slug: metadata.slug, post: null, error: true }) },
    )
    return () => { current = false }
  }, [metadata])

  useEffect(() => {
    if (!post || !location.hash) return
    let id = location.hash.slice(1)
    try { id = decodeURIComponent(id) } catch { return }
    const target = document.getElementById(id)
    if (target?.closest('.post-content')) target.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, [post, location.hash])

  if (!metadata) {
    return (
      <main className="section post-main" id="main-content" tabIndex={-1}>
        <div className="container empty-page">
          <h1>글을 찾을 수 없습니다.</h1>
          <Link className="btn ghost" to="/blog">블로그로 돌아가기</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="section post-main" id="main-content" tabIndex={-1}>
      <div className="container">
        <Link className="post-back" to={backTo}>← 블로그</Link>
        <header className="post-header">
          <p className="post-meta">
            <Link className="post-category" to={`/blog?category=${encodeURIComponent(metadata.category)}`}>{metadata.category}</Link>
            <time dateTime={metadata.date}>{metadata.date}</time>
          </p>
          <h1>{metadata.title}</h1>
        </header>
        {failed ? (
          <section className="post-load-state" role="alert">
            <h2>글을 불러오지 못했습니다.</h2>
            <p>연결 상태를 확인한 뒤 다시 불러와 주세요.</p>
            <button className="btn ghost" type="button" onClick={() => window.location.reload()}>다시 불러오기</button>
          </section>
        ) : post ? (
          <article className="post-content" dangerouslySetInnerHTML={{ __html: post.html }} />
        ) : <p className="post-load-state" role="status">글을 불러오는 중입니다.</p>}
        <footer className="post-footer">
          <Link className="post-back" to={backTo}>← 블로그로 돌아가기</Link>
        </footer>
      </div>
    </main>
  )
}

export default Post
