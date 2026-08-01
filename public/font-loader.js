(() => {
  const applyRouteFonts = () => {
    const stylesheet = document.getElementById('route-fonts')
    if (stylesheet) stylesheet.media = 'all'
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyRouteFonts, { once: true })
  else applyRouteFonts()
})()
