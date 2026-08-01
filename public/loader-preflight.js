try {
  if (
    window.location.pathname === '/' &&
    window.sessionStorage.getItem('mulearn-loading-screen-v2') === 'true'
  ) {
    document.documentElement.classList.add('loader-seen')
  }
} catch {
  // The React loader remains the safe fallback when session storage is unavailable.
}
