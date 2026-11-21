import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPointCloudViewer } from '../lib/pointCloudViewer'
import '../styles/components/point-cloud.css'

/**
 * The structure URL points to a Z-up PCD. Optional ground data stores XY tile centers and a tile size in meters.
 * When floors are configured, the PCD label field identifies the floor in both datasets.
 * The optional floor prop controls the selected level. Explicit null shows all floors.
 */
export default function PointCloudViewer(props) {
  const { title, dataset: { structureUrl, ground, floors = [] } } = props
  const floorColors = floors.map(({ level, color }) => [level, color])
  const key = JSON.stringify([title, structureUrl, ground?.url, ground?.tileSize, floorColors])
  return <PointCloudSession key={key} {...props} />
}

function PointCloudSession({ title, dataset, children, floor: controlledFloor, onFloorChange }) {
  // Equivalent dataset props keep the current scene. A new dataset starts a new session.
  const [configuration] = useState(() => dataset)
  const { floors = [], ground } = configuration
  const { poster } = dataset
  const controlsId = useId()
  const viewport = useRef(null)
  const instance = useRef(null)
  const [status, setStatus] = useState('loading')
  const [attempt, setAttempt] = useState(0)
  const [localFloor, setLocalFloor] = useState(null)
  const [groundVisible, setGroundVisible] = useState(true)
  const floor = controlledFloor === undefined ? localFloor : controlledFloor
  const latestFloor = useRef(floor)
  const ready = status === 'ready'

  useLayoutEffect(() => {
    latestFloor.current = floor
    if (controlledFloor !== undefined) instance.current?.selectFloor(controlledFloor)
  }, [controlledFloor, floor])

  useEffect(() => {
    const controller = new AbortController()
    let viewer

    function showFallback() {
      if (controller.signal.aborted) return
      controller.abort()
      viewer?.dispose()
      instance.current = null
      setStatus('error')
    }

    async function load() {
      try {
        viewer = createPointCloudViewer(viewport.current, configuration, {
          title,
          controlsId,
          onContextLoss: showFallback,
        })
        instance.current = viewer
        viewer.selectFloor(latestFloor.current)
        await viewer.load(controller.signal)
        if (controller.signal.aborted) return
        setStatus('ready')
      } catch {
        showFallback()
      }
    }

    load()
    return () => {
      controller.abort()
      viewer?.dispose()
      instance.current = null
    }
  }, [attempt, configuration, controlsId, title])

  function selectFloor(level) {
    if (controlledFloor === undefined) {
      setLocalFloor(level)
      instance.current?.selectFloor(level)
    }
    onFloorChange?.(level)
  }

  function toggleGround(event) {
    const visible = event.target.checked
    setGroundVisible(visible)
    instance.current?.setGroundVisible(visible)
  }

  function retry() {
    setStatus('loading')
    setLocalFloor(null)
    setGroundVisible(true)
    setAttempt(previous => previous + 1)
  }

  return (
    <section className="point-cloud" aria-label={title}>
      <div className="point-cloud-frame">
        <div className="point-cloud-toolbar">
          {floors.length > 0 && (
            <div className="point-cloud-floors" role="group" aria-label="표시할 층">
              <button type="button" disabled={!ready} aria-pressed={floor === null} onClick={() => selectFloor(null)}>
                전체
              </button>
              {floors.map(({ level, color }) => (
                <button
                  key={level}
                  type="button"
                  disabled={!ready}
                  aria-pressed={floor === level}
                  onClick={() => selectFloor(level)}
                >
                  <span className="point-cloud-swatch" style={{ backgroundColor: color }} aria-hidden="true" />
                  {level}층
                </button>
              ))}
            </div>
          )}
          <div className="point-cloud-settings">
            {ground && (
              <label className="point-cloud-toggle">
                <input type="checkbox" checked={groundVisible} disabled={!ready} onChange={toggleGround} />
                바닥 타일
              </label>
            )}
            <button type="button" disabled={!ready} onClick={() => instance.current?.resetView()}>
              시점 초기화
            </button>
          </div>
        </div>

        <div className="point-cloud-stage" aria-busy={status === 'loading'}>
          <div className="point-cloud-canvas" ref={viewport} />
          {!ready && (
            <div className="point-cloud-fallback">
              {poster && <img src={poster.src} alt={poster.alt} />}
              {status === 'loading' ? (
                <div className="point-cloud-status" role="status">점군을 불러오는 중입니다.</div>
              ) : (
                <div className="point-cloud-status" role="alert">
                  <p>3D 뷰어를 열 수 없습니다.</p>
                  <button type="button" onClick={retry}>다시 시도</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <footer className="point-cloud-notes">
        <p id={controlsId}>
          <span className="point-cloud-mouse">드래그로 회전 · 휠로 확대 · 우클릭 드래그로 이동</span>
          <span className="point-cloud-touch">한 손가락으로 회전 · 두 손가락으로 확대·이동</span>
          <span className="visually-hidden">방향키로 이동, Shift와 방향키로 회전, +와 −로 확대·축소</span>
        </p>
        {children}
      </footer>
    </section>
  )
}
