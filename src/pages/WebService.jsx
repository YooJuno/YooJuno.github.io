import useReveal from '../hooks/useReveal'

function WebService() {
  useReveal()
  return (
    <main className="section">
      <div className="container" data-reveal>
        <div className="section-head">
          <h2>웹서비스</h2>
          <p>현재는 준비 중입니다. 공개 가능한 서비스부터 순차적으로 정리할 예정입니다.</p>
        </div>
        <div className="empty">
          준비 중
        </div>
      </div>
    </main>
  )
}

export default WebService
