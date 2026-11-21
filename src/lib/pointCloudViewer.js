import {
  Box3, BufferAttribute, BufferGeometry, Color, DoubleSide, InstancedMesh, Matrix4, MeshBasicMaterial,
  PerspectiveCamera, PlaneGeometry, Points, PointsMaterial, Scene, Vector3, WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js'

const OVERVIEW = new Vector3(1, -0.25, 0.35).normalize()
const DETAIL_VIEW = new Vector3(0.70, -0.16, 0.74).normalize()
const DEFAULT_POINT_COLOR = '#9badbf'

async function fetchCloud(url, signal) {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`PCD 요청 실패 (${response.status})`)
  return response.arrayBuffer()
}

function readPoints(geometry) {
  const { position, color, label } = geometry.attributes
  if (!position?.count) throw new Error('PCD에 좌표가 없습니다.')
  const positions = position.array
  const colors = color?.count === position.count ? color.array : undefined
  const labels = label?.count === position.count ? label.array : undefined
  if (positions.every(Number.isFinite)) return { positions, colors, labels }

  let offset = 0
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i]
    const y = positions[i + 1]
    const z = positions[i + 2]
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) continue
    positions[offset] = x
    positions[offset + 1] = y
    positions[offset + 2] = z
    colors?.copyWithin(offset, i, i + 3)
    if (labels) labels[offset / 3] = labels[i / 3]
    offset += 3
  }
  if (!offset) throw new Error('PCD에 유효한 좌표가 없습니다.')
  return {
    positions: positions.subarray(0, offset),
    colors: colors?.subarray(0, offset),
    labels: labels?.subarray(0, offset / 3),
  }
}

function readLayers(buffer, floors) {
  const cloud = new PCDLoader().parse(buffer)
  try {
    const { positions, colors, labels } = readPoints(cloud.geometry)
    if (!floors.length) {
      return [{ level: null, positions, colors }]
    }
    if (!labels) throw new Error('PCD에서 층 번호를 읽을 수 없습니다.')

    const indices = new Map(floors.map(({ level }, index) => [level, index]))
    const counts = new Uint32Array(floors.length)
    for (const label of labels) {
      const index = indices.get(label)
      if (index === undefined) throw new Error('PCD에 등록되지 않은 층 번호가 있습니다.')
      counts[index]++
    }
    const layers = floors.map((floor, index) => ({ ...floor, positions: new Float32Array(counts[index] * 3) }))
    const offsets = new Uint32Array(counts.length)
    for (let i = 0; i < labels.length; i++) {
      const index = indices.get(labels[i])
      const layer = layers[index].positions
      const offset = offsets[index]
      layer[offset] = positions[i * 3]
      layer[offset + 1] = positions[i * 3 + 1]
      layer[offset + 2] = positions[i * 3 + 2]
      offsets[index] += 3
    }
    return layers
  } finally {
    cloud.geometry.dispose()
    cloud.material.dispose()
  }
}

function createStructure({ positions, color, colors }) {
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  if (colors) geometry.setAttribute('color', new BufferAttribute(colors, 3))
  return new Points(geometry, new PointsMaterial({
    color: colors ? '#ffffff' : new Color(color ?? DEFAULT_POINT_COLOR).lerp(new Color(DEFAULT_POINT_COLOR), 0.56),
    vertexColors: Boolean(colors),
    size: 1.55,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.56,
    depthWrite: false,
  }))
}

function createTiles(positions, geometry, color) {
  const material = new MeshBasicMaterial({ color, side: DoubleSide })
  const tiles = new InstancedMesh(geometry, material, positions.length / 3)
  const translation = new Matrix4()
  for (let i = 0; i < tiles.count; i++) {
    const index = i * 3
    translation.makeTranslation(positions[index], positions[index + 1], positions[index + 2])
    tiles.setMatrixAt(i, translation)
  }
  tiles.instanceMatrix.needsUpdate = true
  return tiles
}

export function createPointCloudViewer(container, dataset, { title, controlsId, onContextLoss }) {
  const { structureUrl, ground, floors = [] } = dataset
  const scene = new Scene()
  scene.background = new Color('#0b1521')
  const camera = new PerspectiveCamera(42, 1, 0.05, 1500)
  camera.up.set(0, 0, 1)
  camera.position.set(1, 0, 1)

  const renderer = new WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6))
  const canvas = renderer.domElement
  canvas.tabIndex = -1
  canvas.setAttribute('aria-label', title)
  canvas.setAttribute('aria-describedby', controlsId)
  container.appendChild(canvas)

  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = false
  controls.zoomToCursor = true
  controls.minDistance = 0.6
  controls.maxPolarAngle = Math.PI / 2 + 0.08
  controls.listenToKeyEvents(canvas)

  const tileGeometry = ground && new PlaneGeometry(ground.tileSize, ground.tileSize)
  const layers = new Map()
  let activeFloor = null
  let fitPending = false
  let showGround = true
  let animationFrame = null
  let disposed = false

  function render() {
    if (disposed || animationFrame !== null) return
    animationFrame = requestAnimationFrame(() => {
      animationFrame = null
      renderer.render(scene, camera)
    })
  }

  function resetView() {
    if (!layers.size) return
    const { clientWidth, clientHeight } = container
    if (!clientWidth || !clientHeight) {
      fitPending = true
      return
    }
    fitPending = false
    camera.aspect = clientWidth / clientHeight
    const selected = layers.get(activeFloor)
    const extentClouds = selected
      ? [showGround && selected.tiles?.length ? selected.tiles : selected.positions]
      : Array.from(layers.values()).flatMap(({ positions, tiles }) => showGround && tiles ? [positions, tiles] : [positions])
    const direction = selected ? DETAIL_VIEW : OVERVIEW
    const right = new Vector3().crossVectors(camera.up, direction).normalize()
    const up = new Vector3().crossVectors(direction, right).normalize()
    const viewBounds = new Box3()
    const point = new Vector3()
    const projected = new Vector3()
    for (const cloud of extentClouds) {
      for (let i = 0; i < cloud.length; i += 3) {
        point.fromArray(cloud, i)
        projected.set(point.dot(right), point.dot(up), point.dot(direction))
        viewBounds.expandByPoint(projected)
      }
    }
    if (viewBounds.isEmpty()) return
    const viewCenter = viewBounds.getCenter(new Vector3())
    const tangent = Math.tan(camera.fov * Math.PI / 360)
    let distance = 2
    for (const cloud of extentClouds) {
      for (let i = 0; i < cloud.length; i += 3) {
        point.fromArray(cloud, i)
        const fit = Math.max(Math.abs(point.dot(up) - viewCenter.y) / tangent,
          Math.abs(point.dot(right) - viewCenter.x) / (tangent * camera.aspect))
        distance = Math.max(distance, point.dot(direction) - viewCenter.z + fit * 1.09)
      }
    }
    const center = new Vector3().addScaledVector(right, viewCenter.x)
      .addScaledVector(up, viewCenter.y).addScaledVector(direction, viewCenter.z)
    controls.maxDistance = Math.max(500, distance * 6)
    camera.far = controls.maxDistance * 3
    camera.updateProjectionMatrix()
    controls.target.copy(center)
    camera.position.copy(center).addScaledVector(direction, distance)
    controls.update()
    render()
  }

  function applyVisibility() {
    for (const [level, layer] of layers) {
      const visible = activeFloor === null || level === activeFloor
      layer.structure.visible = visible
      if (layer.surface) layer.surface.visible = visible && showGround
    }
    render()
  }

  function resize() {
    const { clientWidth, clientHeight } = container
    if (!clientWidth || !clientHeight) return
    renderer.setSize(clientWidth, clientHeight, false)
    camera.aspect = clientWidth / clientHeight
    camera.updateProjectionMatrix()
    if (fitPending) resetView()
    render()
  }

  function loseContext(event) {
    event.preventDefault()
    onContextLoss()
  }

  function zoomWithKey(event) {
    if (event.key === '+' || event.key === '=') controls.dollyIn(1 / 1.2)
    else if (event.key === '-') controls.dollyOut(1 / 1.2)
    else return
    event.preventDefault()
  }

  const observer = new ResizeObserver(resize)
  observer.observe(container)
  controls.addEventListener('change', render)
  canvas.addEventListener('webglcontextlost', loseContext)
  canvas.addEventListener('keydown', zoomWithKey)
  resize()

  return {
    async load(signal) {
      const [structureBuffer, groundBuffer] = await Promise.all([
        fetchCloud(structureUrl, signal), ground && fetchCloud(ground.url, signal),
      ])
      signal.throwIfAborted()
      const structures = readLayers(structureBuffer, floors)
      const groundLayers = groundBuffer ? readLayers(groundBuffer, floors) : []
      structures.forEach((layer, index) => {
        const tiles = groundLayers[index]?.positions
        const structure = createStructure(layer)
        const surface = tiles?.length ? createTiles(tiles, tileGeometry, layer.color ?? DEFAULT_POINT_COLOR) : null
        layers.set(layer.level, { structure, surface, positions: layer.positions, tiles })
        scene.add(structure)
        if (surface) scene.add(surface)
      })
      canvas.tabIndex = 0
      applyVisibility()
      resetView()
    },
    selectFloor(level) {
      activeFloor = level
      applyVisibility()
      resetView()
    },
    setGroundVisible(visible) {
      showGround = visible
      applyVisibility()
    },
    resetView,
    dispose() {
      if (disposed) return
      disposed = true
      if (animationFrame !== null) cancelAnimationFrame(animationFrame)
      observer.disconnect()
      canvas.removeEventListener('webglcontextlost', loseContext)
      canvas.removeEventListener('keydown', zoomWithKey)
      controls.removeEventListener('change', render)
      controls.dispose()
      scene.clear()
      for (const { structure, surface } of layers.values()) {
        structure.geometry.dispose()
        structure.material.dispose()
        surface?.material.dispose()
        surface?.dispose()
      }
      tileGeometry?.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
    },
  }
}
