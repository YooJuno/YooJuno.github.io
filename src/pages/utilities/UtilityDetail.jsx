import { useParams } from 'react-router-dom'
import { getUtility } from '../../lib/utilities'
import ServiceDetail from '../webservice/ServiceDetail'
import NotFound from '../NotFound'
import '../../styles/pages/utilities.css'

export default function UtilityDetail() {
  const { slug } = useParams()
  const utility = getUtility(slug)
  return utility ? <ServiceDetail key={utility.id} entry={utility} serviceId={utility.id} /> : <NotFound />
}
