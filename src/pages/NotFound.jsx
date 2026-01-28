import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="section">
      <div className="container">
        <h2>???? ?? ? ????.</h2>
        <p>??? ????? ??? ??????.</p>
        <Link className="btn ghost" to="/">???</Link>
      </div>
    </main>
  )
}

export default NotFound
