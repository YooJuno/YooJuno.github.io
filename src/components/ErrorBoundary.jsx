import { Component } from 'react'
import { Link } from 'react-router-dom'

// 렌더링/이펙트에서 발생한 예외를 잡아 해당 영역만 대체 화면으로 바꾼다.
// 경계가 없으면 예외 하나에 React가 트리 전체를 언마운트해 사이트가 백지가 된다.
//
// App.jsx 에서 location.pathname 을 key 로 넘기므로, 다른 경로로 이동하면
// 경계가 다시 마운트되면서 오류 상태가 자동으로 해제된다.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('페이지 렌더링 중 오류가 발생했습니다.', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="section">
          <div className="container empty-page">
            <p className="eyebrow">오류</p>
            <h1>페이지를 표시할 수 없습니다.</h1>
            <p>잠시 후 다시 시도하거나 다른 메뉴로 이동해주세요.</p>
            <Link className="btn ghost" to="/">홈으로</Link>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
