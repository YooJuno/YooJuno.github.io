import ProjectIndex from '../../components/ProjectIndex'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import { webServices } from '../../lib/webServices'

const entries = webServices.map(({ id, title, route, availability, github, site, siteLabel }) => ({
  id, title, route, meta: availability, github, site, siteLabel: siteLabel || '서비스 열기',
}))

export default function WebService() {
  useDocumentTitle()
  return <ProjectIndex title="웹서비스" entries={entries} />
}
