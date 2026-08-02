(() => {
  const key = 'mulearn-loading-screen-v2'
  const rootClass = document.documentElement.classList
  const isHome = window.location.pathname === '/'
  let seen = false
  try { seen = window.sessionStorage.getItem(key) === 'true' } catch { /* Storage can be unavailable. */ }

  if (!isHome || seen) {
    rootClass.add('loader-seen')
    return
  }

  rootClass.add('mulearn-intro-active')

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const startedAt = performance.now()
  let progress = 0
  let frameId
  let finishRequested = false
  let revealTimer
  let cleanupTimer
  let revealFinished = false

  const preventScroll = (event) => event.preventDefault()
  window.addEventListener('wheel', preventScroll, { passive: false })
  window.addEventListener('touchmove', preventScroll, { passive: false })

  const lockRoot = () => {
    const root = document.getElementById('root')
    if (!root) return
    root.inert = true
    root.setAttribute('aria-hidden', 'true')
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.scrollTo(0, 0)
      lockRoot()
    }, { once: true })
  } else {
    window.scrollTo(0, 0)
    lockRoot()
  }

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

  const unlockRoot = () => {
    const root = document.getElementById('root')
    if (!root) return
    root.inert = false
    root.removeAttribute('aria-hidden')
  }

  const finishReveal = () => {
    if (revealFinished) return
    revealFinished = true
    window.clearTimeout(cleanupTimer)
    const loader = document.getElementById('initial-loader')
    unlockRoot()
    rootClass.add('loader-seen')
    rootClass.remove('mulearn-intro-active', 'mulearn-intro-revealing')
    loader?.remove()
    window.removeEventListener('wheel', preventScroll)
    window.removeEventListener('touchmove', preventScroll)
    try { delete window.__finishMulearnLoader } catch { window.__finishMulearnLoader = undefined }
  }

  const beginReveal = () => {
    cancelAnimationFrame(frameId)
    progress = 100
    render()

    revealTimer = window.setTimeout(() => {
      const loader = document.getElementById('initial-loader')
      loader?.classList.add('is-content-exiting')

      const startCrossfade = () => {
        rootClass.add('mulearn-intro-revealing')
        try { window.sessionStorage.setItem(key, 'true') } catch { /* Storage can be unavailable. */ }

        const reveal = () => {
          loader?.classList.add('is-exiting')
          window.dispatchEvent(new CustomEvent('mulearn:intro-reveal'))
          if (reducedMotion || !loader) finishReveal()
          else {
            const onTransitionEnd = (event) => {
              if (event.target !== loader || event.propertyName !== 'opacity') return
              loader.removeEventListener('transitionend', onTransitionEnd)
              finishReveal()
            }
            loader.addEventListener('transitionend', onTransitionEnd)
            cleanupTimer = window.setTimeout(() => {
              loader.removeEventListener('transitionend', onTransitionEnd)
              finishReveal()
            }, 900)
          }
        }

        requestAnimationFrame(() => requestAnimationFrame(reveal))
      }

      if (reducedMotion) {
        startCrossfade()
      } else {
        const inner = loader?.querySelector('.static-loader__inner')
        if (!inner) {
          startCrossfade()
        } else {
          let crossfadeStarted = false
          const launchCrossfade = () => {
            if (crossfadeStarted) return
            crossfadeStarted = true
            inner.removeEventListener('transitionend', onInnerFadeEnd)
            window.clearTimeout(revealTimer)
            requestAnimationFrame(() => requestAnimationFrame(startCrossfade))
          }
          const onInnerFadeEnd = (event) => {
            if (event.target === inner && event.propertyName === 'opacity') launchCrossfade()
          }
          inner.addEventListener('transitionend', onInnerFadeEnd)
          revealTimer = window.setTimeout(launchCrossfade, 360)
        }
      }
    }, reducedMotion ? 0 : 110)
  }

  if (reducedMotion) progress = 100
  else frameId = requestAnimationFrame(tick)
  render()

  window.__finishMulearnLoader = () => {
    if (finishRequested) return
    finishRequested = true
    const minimumWait = reducedMotion ? 0 : Math.max(0, 1050 - (performance.now() - startedAt))
    window.setTimeout(beginReveal, minimumWait)
  }

  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frameId)
    window.clearTimeout(revealTimer)
    window.clearTimeout(cleanupTimer)
    window.removeEventListener('wheel', preventScroll)
    window.removeEventListener('touchmove', preventScroll)
    try { delete window.__finishMulearnLoader } catch { window.__finishMulearnLoader = undefined }
  }, { once: true })
})()
