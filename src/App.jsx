import { lazy, Suspense, useCallback, useState } from 'react'
import { Routes, Route } from 'react-router'
import SeoManager from './components/SeoManager'
import HashScrollHandler from './components/HashScrollHandler'
import LoadingScreen from './components/LoadingScreen'
import { routeModules } from './routeModules'

const HomePage = lazy(routeModules.home)
const KarmaWarPage = lazy(routeModules.karma)
const FullTeamPage = lazy(routeModules.team)
const OrientationArchivePage = lazy(routeModules.archive)
const NotFoundPage = lazy(routeModules.notFound)

function RouteFallback() {
  return <main className="route-fallback" aria-label="Loading page" aria-busy="true" />
}

const LOADER_SESSION_KEY = 'mulearn-loading-screen-v2'

export default function App() {
  const [showLoadingScreen, setShowLoadingScreen] = useState(
    () => window.location.pathname === '/' && sessionStorage.getItem(LOADER_SESSION_KEY) !== 'true',
  )

  const finishLoading = useCallback(() => {
    sessionStorage.setItem(LOADER_SESSION_KEY, 'true')
    setShowLoadingScreen(false)
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
      {showLoadingScreen && <LoadingScreen onLoadingComplete={finishLoading} />}
    </div>
  )
}
