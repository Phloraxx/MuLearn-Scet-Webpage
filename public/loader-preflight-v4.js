(() => {
  const key = 'mulearn-loading-screen-v2'
  const isHome = window.location.pathname === '/'
  let seen = false
  try { seen = window.sessionStorage.getItem(key) === 'true' } catch { /* Storage can be unavailable. */ }

  if (!isHome || seen) {
    document.documentElement.classList.add('loader-seen')
    return
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const startedAt = performance.now()
  let progress = 0
  let frameId
  let finishRequested = false

  const render = () => {
    const bar = document.getElementById('initial-loader-bar')
    const label = document.getElementById('initial-loader-label')
    if (bar) bar.style.width = `${progress}%`
    if (label) label.textContent = `Loading... ${progress}%`
  }

  const tick = (now) => {
    progress = Math.max(progress, Math.min(92, Math.round((now - startedAt) / 14)))
    render()
    if (progress < 92) frameId = requestAnimationFrame(tick)
  }

  if (reducedMotion) progress = 100
  else frameId = requestAnimationFrame(tick)
  render()

  window.__finishMulearnLoader = () => {
    if (finishRequested) return
    finishRequested = true
    const wait = reducedMotion ? 0 : Math.max(0, 1050 - (performance.now() - startedAt))
    window.setTimeout(() => {
      cancelAnimationFrame(frameId)
      progress = 100
      render()
      window.setTimeout(() => {
        const loader = document.getElementById('initial-loader')
        if (loader) loader.classList.add('is-exiting')
        try { window.sessionStorage.setItem(key, 'true') } catch { /* Storage can be unavailable. */ }
        document.documentElement.classList.add('loader-seen')
        window.setTimeout(() => loader?.remove(), 460)
      }, 180)
    }, wait)
  }
})()
