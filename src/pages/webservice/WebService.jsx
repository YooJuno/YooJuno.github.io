import ProjectIndex from '../../components/ProjectIndex'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import { webServices } from '../../lib/webServices'

const entries = webServices.map(({ id, title, route, availability, github, site, siteLabel }) => ({
  id, title, route, meta: availability, github, site, siteLabel: siteLabel || '서비스 열기',
}))

export default function WebService() {
  useDocumentTitle()
  return (
    <ProjectIndex
      title="웹서비스"
      intro="실제 구현한 서비스의 화면·기능·API와 소스 코드를 정리했습니다."
      entries={entries}
    />
  )
}
