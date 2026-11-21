import { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react'
import ErrorBoundary from '../../components/ErrorBoundary'
import { CAMPUS2_DATA, CAMPUS2_TITLE } from '../../lib/campus2Data'

const PointCloudViewer = lazy(() => import('../../components/PointCloudViewer'))
const MAP_DIRECTORY = '/content/maps/campus2'
const ZOOM_LEVELS = [1, 1.5, 2, 3]

function PgmMap({ floor, onFloorChange, viewport }) {
  const [zoomIndex, setZoomIndex] = useState(0)
  const zoomCenter = useRef(null)
  const zoomed = zoomIndex > 0
  const floorName = String(floor).padStart(2, '0')

  function changeZoom(nextIndex) {
    if (nextIndex === zoomIndex) return
    const { scrollLeft, scrollTop, clientWidth, clientHeight, scrollWidth, scrollHeight } = viewport.current
    zoomCenter.current = {
      x: (scrollLeft + clientWidth / 2) / scrollWidth,
      y: (scrollTop + clientHeight / 2) / scrollHeight,
    }
    setZoomIndex(nextIndex)
  }

  useLayoutEffect(() => {
    const center = zoomCenter.current
    if (!center) return
    const map = viewport.current
    map.scrollTo({
      left: center.x * map.scrollWidth - map.clientWidth / 2,
      top: center.y * map.scrollHeight - map.clientHeight / 2,
    })
    zoomCenter.current = null
  }, [viewport, zoomIndex])

  return (
    <div className="campus2-pgm">
      <div className="campus2-pgm-toolbar">
        <div className="campus2-maps-controls" role="group" aria-label="지도 층 선택">
          {CAMPUS2_DATA.floors.map(({ level }) => (
            <button key={level} type="button" aria-pressed={floor === level} onClick={() => onFloorChange(level)}>
              {level}층
            </button>
          ))}
        </div>
        <div className="campus2-maps-controls campus2-pgm-zoom" role="group" aria-label="지도 확대 및 축소">
          <button type="button" aria-label="지도 축소" disabled={!zoomed} onClick={() => changeZoom(zoomIndex - 1)}>−</button>
          <button type="button" aria-label="지도를 화면에 맞추기" disabled={!zoomed} onClick={() => changeZoom(0)}>맞춤</button>
          <button type="button" aria-label="지도 확대" disabled={zoomIndex === ZOOM_LEVELS.length - 1} onClick={() => changeZoom(zoomIndex + 1)}>+</button>
        </div>
      </div>

      <div
        className="campus2-pgm-viewport"
        ref={viewport}
        role="region"
        aria-label={`${floor}층 지도 영역`}
        tabIndex={zoomed ? 0 : undefined}
        data-zoomed={zoomed}
      >
        <img
          src={`${MAP_DIRECTORY}/floor_${floorName}.png`}
          alt={`Campus2 ${floor}층 점유 격자 지도`}
          draggable={false}
          width={1197}
          height={927}
          style={{ width: `${ZOOM_LEVELS[zoomIndex] * 100}%` }}
        />
      </div>

      <div className="campus2-pgm-footer">
        <div className="campus2-pgm-legend" role="group" aria-label="지도 범례">
          <span><i className="campus2-pgm-free" aria-hidden="true" />자유 공간</span>
          <span><i className="campus2-pgm-occupied" aria-hidden="true" />장애물</span>
          <span><i className="campus2-pgm-unknown" aria-hidden="true" />미관측</span>
        </div>
        <a href={`${MAP_DIRECTORY}/Campus2-Nav2-PGM.zip`} download>PGM·YAML 받기</a>
      </div>
    </div>
  )
}

export default function Campus2Maps() {
  const [showPointCloud, setShowPointCloud] = useState(false)
  const [pointCloudOpened, setPointCloudOpened] = useState(false)
  const [{ floor, showAll }, setSelection] = useState({ floor: 8, showAll: false })
  const pgmViewport = useRef(null)
  const pgmPan = useRef(null)

  useLayoutEffect(() => {
    if (!showPointCloud && pgmPan.current) pgmViewport.current.scrollTo(pgmPan.current)
  }, [showPointCloud])

  function openPointCloud() {
    if (showPointCloud) return
    const { scrollLeft, scrollTop } = pgmViewport.current
    pgmPan.current = { left: scrollLeft, top: scrollTop }
    setPointCloudOpened(true)
    setShowPointCloud(true)
  }

  function selectFloor(level) {
    setSelection(current => level === null
      ? { ...current, showAll: true }
      : { floor: level, showAll: false })
  }

  return (
    <section className="campus2-maps" aria-label="Campus2 층별 지도">
      <div className="campus2-maps-controls campus2-maps-modes" role="group" aria-label="지도 유형">
        <button type="button" aria-pressed={!showPointCloud} onClick={() => setShowPointCloud(false)}>PGM 지도</button>
        <button type="button" aria-pressed={showPointCloud} onClick={openPointCloud}>3D 점군</button>
      </div>
      <div hidden={showPointCloud}>
        <PgmMap floor={floor} onFloorChange={selectFloor} viewport={pgmViewport} />
      </div>
      {pointCloudOpened && (
        <div hidden={!showPointCloud}>
          <ErrorBoundary fallback={<div className="campus2-maps-error" role="alert">3D 점군을 불러오지 못했습니다.</div>}>
            <Suspense fallback={<div className="campus2-maps-loading campus2-cloud-loading" role="status">점군을 불러오는 중입니다.</div>}>
              <PointCloudViewer
                title={CAMPUS2_TITLE}
                dataset={CAMPUS2_DATA}
                floor={showAll ? null : floor}
                onFloorChange={selectFloor}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      )}
    </section>
  )
}
