import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="section">
      <div className="container empty-page">
        <p className="eyebrow">404</p>
        <h1>페이지를 찾을 수 없습니다.</h1>
        <Link className="btn ghost" to="/">홈으로</Link>
      </div>
    </main>
  )
}

export default NotFound
