import { Navigate, useLocation } from 'react-router-dom'

function WebServiceMapEditor() {
  const { search, hash } = useLocation()
  return <Navigate to={{ pathname: '/utilities/map-editor', search, hash }} replace />
}

export default WebServiceMapEditor
