import ProjectIndex from '../../components/ProjectIndex'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import { utilities } from '../../lib/utilities'

const entries = utilities.map(({ id, title, route, github }) => ({ id, title, route, github }))

export default function Utilities() {
  useDocumentTitle()
  return <ProjectIndex title="유틸리티" entries={entries} />
}
