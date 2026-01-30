import { Navigate } from 'react-router-dom'

function Music() {
  return <Navigate to="/blog?category=음악" replace />
}

export default Music
