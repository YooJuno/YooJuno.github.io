import ProjectIndex from '../../components/ProjectIndex'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import { utilities } from '../../lib/utilities'

const entries = utilities.map(({ id, title, route, platforms, github }) => ({
  id, title, route, meta: platforms.join(' · '), github,
}))

export default function Utilities() {
  useDocumentTitle()
  return (
    <ProjectIndex
      title="유틸리티"
      intro="직접 쓰기 위해 만든 분석·편집·시스템 관리 프로그램입니다."
      entries={entries}
    />
  )
}
