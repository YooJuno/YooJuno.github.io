import { useEffect } from 'react'

const useReveal = () => {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const revealItems = document.querySelectorAll('[data-reveal]')
    let observer

    if (prefersReduced) {
      revealItems.forEach((el) => el.classList.add('is-visible'))
      return undefined
    }

    observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )

    revealItems.forEach((el) => observer.observe(el))

    return () => {
      if (observer) observer.disconnect()
    }
  }, [])
}

export default useReveal
