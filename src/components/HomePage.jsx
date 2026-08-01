import Navigation from './Navigation'
import HeroSection from './HeroSection'
import AboutSection from './AboutSection'
import ProjectsSection from './ProjectsSection'
import OrientationMemeSection from './OrientationMemeSection'
import GallerySection from './GallerySection'
import TeamSection from './TeamSection'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <div id="home"><HeroSection /></div>
        <AboutSection />
        <OrientationMemeSection />
        <ProjectsSection />
        <GallerySection />
        <TeamSection />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
