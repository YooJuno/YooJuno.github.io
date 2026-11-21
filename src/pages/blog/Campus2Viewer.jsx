import { Link } from 'react-router-dom'
import PointCloudViewer from '../../components/PointCloudViewer'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import '../../styles/pages/blog.css'

const TITLE = 'Campus2 3D 점군'
const CAMPUS2 = {
  structureUrl: '/content/point-clouds/campus2/structure.pcd',
  ground: {
    url: '/content/point-clouds/campus2/ground.pcd',
    tileSize: 0.1,
  },
  floors: [
    { level: 5, color: '#76aaff' },
    { level: 6, color: '#61ccef' },
    { level: 7, color: '#62ddb1' },
    { level: 8, color: '#bce579' },
    { level: 9, color: '#ffc46d' },
    { level: 10, color: '#ff938b' },
  ],
  poster: {
    src: '/content/images/blog/elevator-lio/campus2-floor-detail.jpg',
    alt: 'Campus2 5~10층 점군의 측면도',
  },
}

export default function Campus2Viewer() {
  useDocumentTitle()

  return (
    <main className="section point-cloud-page" id="main-content" tabIndex={-1}>
      <div className="container">
        <header className="post-header point-cloud-page-header">
          <p className="post-meta">
            <Link className="post-back" to="/blog/elevator-lio/#campus2-층간-매핑">← Elevator-LIO 논문 리뷰</Link>
          </p>
          <h1>{TITLE}</h1>
        </header>

        <PointCloudViewer title={TITLE} dataset={CAMPUS2}>
          <p>
            Zhang 외의 <a href="https://huggingface.co/datasets/xiaofan0100/Elevator-LIO-Dataset">Elevator-LIO Dataset</a>
            {'으로 재현 · '}<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
          </p>
        </PointCloudViewer>
      </div>
    </main>
  )
}
