import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import MuLearnLogo from './MuLearnLogo'

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Team', href: '#team' }
  ]

  const scrollToSection = (e, href) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    const targetId = href.replace('#', '')
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const element = document.getElementById(targetId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
      return
    }
    setTimeout(() => {
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/" className="flex items-center gap-2">
              <MuLearnLogo 
                size="small" 
                className="text-pakistan-green"
              />
              <span className="text-lg font-semibold text-tigers-eye">Sahrdaya</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`font-medium transition-colors duration-300 hover:text-tigers-eye text-pakistan-green`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  aria-current={location.hash === item.href ? 'true' : undefined}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Right Side - Join MuLearn Button */}
          <div className="hidden md:flex items-center space-x-3">
              <motion.button
                onClick={() => window.open('https://app.mulearn.org', '_blank')}
                className="bg-tigers-eye hover:bg-tigers-eye-600 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Join MuLearn (opens in new tab)"
              >
                Join MuLearn
              </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors duration-300 text-pakistan-green`}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMobileMenuOpen ? 1 : 0, 
            height: isMobileMenuOpen ? 'auto' : 0 
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md rounded-b-lg"
        >
          <div className="py-4 space-y-4">
            {navItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="block w-full text-left px-4 py-2 text-pakistan-green font-medium hover:text-tigers-eye transition-colors duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                aria-current={location.hash === item.href ? 'true' : undefined}
              >
                {item.label}
              </motion.a>
            ))}
            
            <div className="px-4 pt-2 space-y-4">
              <motion.button
                onClick={() => {
                  window.open('https://app.mulearn.org', '_blank')
                  setIsMobileMenuOpen(false)
                }}
                className="w-full bg-tigers-eye hover:bg-tigers-eye-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Join MuLearn (opens in new tab)"
              >
                Join MuLearn
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}

export default Navigation
