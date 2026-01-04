import { useState, useEffect } from 'react'
// Component to redirect /games to Google Forms
const ExternalGamesRedirect = () => {
  useEffect(() => {
    window.location.replace('https://forms.gle/YYtD819isHKyNMzE7');
  }, []);
  return null;
};
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navigation from './components/Navigation'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ProjectsSection from './components/ProjectsSection'
import GallerySection from './components/GallerySection'
import TeamSection from './components/TeamSection'
import TestTeamPage from './components/TestTeamPage'
import ExecomCallPage from './components/ExecomCallPage'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import LoadingScreen from './components/LoadingScreen'
import KarmaWarPage from './components/KarmaWar/KarmaWarPage'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
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
          <Route path="/test-team" element={<TestTeamPage />} />
          <Route path="/req" element={<ExecomCallPage />} />
          <Route path="/karma-war" element={<KarmaWarPage />} />
          {/* Redirect /games to external Google Form */}
          <Route path="/games" element={<ExternalGamesRedirect />} />
        </Routes>


      )}
    </div>
  )
}

export default App
