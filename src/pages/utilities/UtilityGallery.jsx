import { useState, useSyncExternalStore } from 'react'
import ScreenLightbox from '../../components/ScreenLightbox'

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

function subscribeToMotionPreference(onChange) {
  const preference = window.matchMedia(reducedMotionQuery)
  preference.addEventListener('change', onChange)
  return () => preference.removeEventListener('change', onChange)
}

function prefersReducedMotion() {
  return window.matchMedia(reducedMotionQuery).matches
}

export default function UtilityGallery({ screens }) {
  const [selectedId, setSelectedId] = useState(screens[0].id)
  const [expanded, setExpanded] = useState(false)
  const reducedMotion = useSyncExternalStore(subscribeToMotionPreference, prefersReducedMotion)
  const screen = screens.find(item => item.id === selectedId)
  const index = screens.indexOf(screen)
  const hasDemos = screens.some(item => item.animation)
  const stageImage = !reducedMotion && !expanded ? screen.animation ?? screen.image : screen.image

  return (
    <section className="utility-gallery" id="screens" aria-label="사용 화면">
      <figure className="utility-gallery-figure" id={screen.id}>
        <button className={`utility-gallery-stage${screens.length === 1 ? ' is-single' : ''}`} type="button" onClick={() => setExpanded(true)} aria-label={`${screen.title} 화면 확대`}>
          <img key={stageImage} src={stageImage} alt={screen.alt} width={screen.width} height={screen.height} decoding="async" fetchPriority={index === 0 ? 'high' : 'auto'} />
          <span className="utility-gallery-enlarge">확대 ↗</span>
        </button>
        <figcaption className="utility-gallery-caption" aria-live="polite" aria-atomic="true">
          <div>
            <p className="utility-gallery-position">{String(index + 1).padStart(2, '0')} / {String(screens.length).padStart(2, '0')}</p>
            <h2>{screen.title}</h2>
            <p>{screen.caption}</p>
            {screen.source && <a className="utility-gallery-source" href={screen.source.url} target="_blank" rel="noopener noreferrer">{screen.source.label}</a>}
          </div>
          {screen.annotations.length > 0 && <ul>{screen.annotations.map(annotation => <li key={annotation}>{annotation}</li>)}</ul>}
        </figcaption>
      </figure>
      {screens.length > 1 && <div className={`utility-gallery-choices${hasDemos ? ' has-demos' : ''}`} role="group" aria-label="사용 화면 선택">
        {screens.map((item, position) => <button key={item.id} type="button" aria-pressed={selectedId === item.id} onClick={() => setSelectedId(item.id)}>
          <span className="utility-gallery-thumbnail"><img src={item.image} alt="" width={item.width} height={item.height} loading="lazy" decoding="async" /></span>
          <span><small>{String(position + 1).padStart(2, '0')}</small>{item.title}</span>
        </button>)}
      </div>}
      <ScreenLightbox screen={expanded ? screen : null} onClose={() => setExpanded(false)} />
    </section>
  )
}
