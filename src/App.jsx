import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router'
import SeoManager from './components/SeoManager'
import HashScrollHandler from './components/HashScrollHandler'
import { routeModules } from './routeModules'

const HomePage = lazy(routeModules.home)
const KarmaWarPage = lazy(routeModules.karma)
const FullTeamPage = lazy(routeModules.team)
const OrientationArchivePage = lazy(routeModules.archive)
const NotFoundPage = lazy(routeModules.notFound)

function RouteFallback() {
  return <main className="route-fallback" aria-label="Loading page" aria-busy="true" />
}

export default function App() {
  useEffect(() => {
    let cancelled = false
    const fontTimeout = new Promise((resolve) => window.setTimeout(resolve, 2400))
    Promise.race([document.fonts?.ready ?? Promise.resolve(), fontTimeout]).then(() => {
      if (!cancelled) window.__finishMulearnLoader?.()
    })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="min-h-screen">
      <SeoManager />
      <HashScrollHandler />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/karma-war" element={<KarmaWarPage />} />
          <Route path="/team" element={<FullTeamPage />} />
          <Route path="/orientation-2026" element={<OrientationArchivePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  )
}
