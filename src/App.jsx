import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navigation from './components/Navigation'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ProjectsSection from './components/ProjectsSection'
import GallerySection from './components/GallerySection'
import TeamSection from './components/TeamSection'

import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import LoadingScreen from './components/LoadingScreen'
import KarmaWarPage from './components/KarmaWar/KarmaWarPage'
import FullTeamPage from './components/FullTeamPage'

function App() {
  const [isLoading, setIsLoading] = useState(() => !sessionStorage.getItem('hasLoaded'))

  const handleLoadingComplete = () => {
    sessionStorage.setItem('hasLoaded', 'true')
    setIsLoading(false)
  }

  const HomePage = () => (
    <>
      <Navigation />
      <main>
        <div id="home">
          <HeroSection />
        </div>
        <AboutSection />
        <ProjectsSection />
        <GallerySection />
        <TeamSection />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )

  return (
    <div className="min-h-screen">
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onLoadingComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>
      
      {!isLoading && (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/karma-war" element={<KarmaWarPage />} />
          <Route path="/team" element={<FullTeamPage />} />
        </Routes>


      )}
    </div>
  )
}

export default App
