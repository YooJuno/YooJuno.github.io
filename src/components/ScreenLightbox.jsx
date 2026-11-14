import { useEffect, useRef, useState } from 'react'

export default function ScreenLightbox({ screen, onClose }) {
  const dialog = useRef(null)
  const [originalSize, setOriginalSize] = useState(false)
  const open = Boolean(screen)

  useEffect(() => {
    if (!open) return
    const element = dialog.current
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    element.showModal()
    element.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    return () => {
      document.body.style.overflow = overflow
      if (element.open) element.close()
    }
  }, [open])

  const toggleImageSize = () => {
    setOriginalSize(value => !value)
    dialog.current.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }

  return (
    <dialog className="service-lightbox" ref={dialog} aria-labelledby="lightbox-heading" onClose={() => {
      setOriginalSize(false)
      onClose()
    }} onKeyDown={event => {
      if (event.key !== 'Tab') return
      const controls = event.currentTarget.querySelectorAll('button')
      const first = controls[0]
      const last = controls[controls.length - 1]
      const active = document.activeElement
      if (active === event.currentTarget || (event.shiftKey && active === first) || (!event.shiftKey && active === last)) {
        event.preventDefault()
        const target = event.shiftKey ? last : first
        target?.focus()
      }
    }} onClick={event => {
      if (event.target !== dialog.current) return
      const bounds = dialog.current.getBoundingClientRect()
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current.close()
    }}>
      <div className="service-lightbox-toolbar">
        <h2 id="lightbox-heading">{screen?.title || '화면 확대'}</h2>
        <div className="service-lightbox-actions">
          <button type="button" onClick={toggleImageSize} aria-controls="service-lightbox-image">{originalSize ? '화면에 맞춤' : '원본 크기'}</button>
          <button type="button" onClick={() => dialog.current.close()} aria-label="확대 화면 닫기">닫기 ×</button>
        </div>
      </div>
      {screen && <>
        <img id="service-lightbox-image" className={originalSize ? 'is-original' : undefined} src={screen.image} width={screen.width} height={screen.height} alt={screen.alt} />
        <p>{screen.caption}</p>
      </>}
    </dialog>
  )
}
