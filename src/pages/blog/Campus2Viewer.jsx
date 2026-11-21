import { Link } from 'react-router-dom'
import PointCloudViewer from '../../components/PointCloudViewer'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import { CAMPUS2_DATA, CAMPUS2_TITLE } from '../../lib/campus2Data'
import '../../styles/pages/blog.css'

export default function Campus2Viewer() {
  useDocumentTitle()

  return (
    <main className="section point-cloud-page" id="main-content" tabIndex={-1}>
      <div className="container">
        <header className="post-header point-cloud-page-header">
          <p className="post-meta">
            <Link className="post-back" to="/blog/elevator-lio/#campus2-층간-매핑">← Elevator-LIO 논문 리뷰</Link>
          </p>
          <h1>{CAMPUS2_TITLE}</h1>
        </header>

        <PointCloudViewer title={CAMPUS2_TITLE} dataset={CAMPUS2_DATA}>
          <p>
            Zhang 외의 <a href="https://huggingface.co/datasets/xiaofan0100/Elevator-LIO-Dataset">Elevator-LIO Dataset</a>
            {'으로 재현 · '}<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
          </p>
        </PointCloudViewer>
      </div>
    </main>
  )
}
