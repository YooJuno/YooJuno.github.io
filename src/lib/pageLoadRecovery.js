const RETRY_KEY = 'page-load-retry'

export const registerPageLoadRecovery = () => {
  if (!import.meta.env.PROD) return

  const entryUrl = document.querySelector('script[type="module"][src]')?.src
  if (!entryUrl) return

  window.addEventListener('vite:preloadError', () => {
    if (!navigator.onLine) return

    try {
      if (sessionStorage.getItem(RETRY_KEY) === entryUrl) return
      sessionStorage.setItem(RETRY_KEY, entryUrl)
    } catch {
      return
    }

    window.location.reload()
  })
}
