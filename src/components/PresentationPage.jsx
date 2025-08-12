import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FaGamepad, FaUsers, FaBrain, FaTrophy, FaRocket, FaChartLine } from 'react-icons/fa'
import { IoSparkles, IoTime, IoTrophy } from 'react-icons/io5'
import { MdGroups, MdSchool, MdWork } from 'react-icons/md'
import MuLearnLogo from './MuLearnLogo'
import '../presentation.css'

const PresentationPage = () => {
  const [currentSection, setCurrentSection] = useState(0)
  const { scrollY } = useScroll()

  // Auto-advance sections based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const section = Math.floor(scrollPosition / windowHeight)
      setCurrentSection(section)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        if (currentSection < sections.length - 1) {
          document.getElementById(sections[currentSection + 1].id)?.scrollIntoView({ 
            behavior: 'smooth' 
          })
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (currentSection > 0) {
          document.getElementById(sections[currentSection - 1].id)?.scrollIntoView({ 
            behavior: 'smooth' 
          })
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentSection])

  const sections = [
    {
      id: 'welcome',
      title: 'Welcome Freshers!',
      subtitle: '🎉 MuLearn Sahrdaya CET Orientation',
      content: 'Ready to Transform Your Learning Journey?',
      bgColor: 'from-blue-600 via-purple-600 to-pink-600',
      icon: FaUsers
    },
    {
      id: 'games',
      title: '🎮 9 AM: GAMES TIME!',
      subtitle: 'Let\'s Break the Ice',
      content: 'Fun Activities to Get Everyone Energized!',
      bgColor: 'from-green-500 via-teal-500 to-blue-500',
      icon: FaGamepad
    },
    {
      id: 'what-is-mulearn',
      title: 'What is MuLearn?',
      subtitle: 'Peer Learning Revolution',
      content: 'A platform where students learn from students, creating a collaborative ecosystem of knowledge sharing',
      bgColor: 'from-orange-500 via-red-500 to-pink-500',
      icon: FaBrain
    },
    {
      id: 'job-market',
      title: 'Today\'s Job Market',
      subtitle: '💼 The Reality Check',
      content: 'Rapidly evolving technology demands continuous learning and adaptation',
      bgColor: 'from-indigo-600 via-blue-600 to-cyan-600',
      icon: MdWork
    },
    {
      id: 'skill-gap',
      title: 'The Skill Gap Problem',
      subtitle: '📚 Academia vs Industry',
      content: 'Traditional education often lags behind industry requirements. MuLearn bridges this gap!',
      bgColor: 'from-red-500 via-orange-500 to-yellow-500',
      icon: MdSchool
    },
    {
      id: 'karma-points',
      title: 'Karma Points System',
      subtitle: '⭐ Gamified Learning',
      content: 'Earn points for every contribution, project, and learning milestone',
      bgColor: 'from-purple-600 via-pink-600 to-red-600',
      icon: IoTrophy
    },
    {
      id: 'opportunities',
      title: 'Opportunities Await',
      subtitle: '🚀 Career Acceleration',
      content: 'Internships • Projects • Mentorship • Industry Connections',
      bgColor: 'from-teal-500 via-green-500 to-blue-500',
      icon: FaRocket
    },
    {
      id: 'interest-groups',
      title: 'Interest Groups',
      subtitle: '👥 Find Your Tribe',
      content: 'AI/ML • Web Dev • Mobile • DevOps • Design • Entrepreneurship',
      bgColor: 'from-cyan-500 via-blue-500 to-purple-500',
      icon: MdGroups
    },
    {
      id: 'ecosystem',
      title: 'MuLearn Ecosystem',
      subtitle: '🌐 Connected Learning',
      content: 'Colleges • Companies • Communities • Global Network',
      bgColor: 'from-green-600 via-teal-600 to-blue-600',
      icon: FaChartLine
    },
    {
      id: 'portfolio',
      title: 'Build Your Portfolio',
      subtitle: '📁 Showcase Your Work',
      content: 'Document your journey, projects, and achievements for future opportunities',
      bgColor: 'from-pink-500 via-purple-500 to-indigo-500',
      icon: IoSparkles
    },
    {
      id: 'philosophy',
      title: 'MuLearn Philosophy',
      subtitle: '💡 Learning by Doing',
      content: 'Learn • Build • Share • Grow • Repeat',
      bgColor: 'from-yellow-500 via-orange-500 to-red-500',
      icon: FaBrain
    },
    {
      id: 'events',
      title: 'MuLearn Events',
      subtitle: '🎪 Regular Engagement',
      content: 'Workshops • Hackathons • Tech Talks • Networking Sessions',
      bgColor: 'from-blue-600 via-purple-600 to-pink-600',
      icon: IoTime
    },
    {
      id: 'launchpad',
      title: 'MuLearn Launchpad',
      subtitle: '🚀 Career Launcher',
      content: 'Comprehensive program to prepare you for industry',
      bgColor: 'from-green-500 via-blue-500 to-purple-500',
      icon: FaRocket
    },
    {
      id: 'sahrdaya',
      title: 'MuLearn Sahrdaya',
      subtitle: '🏫 Our Chapter',
      content: 'Part of a larger movement, making impact locally',
      bgColor: 'from-teal-600 via-cyan-600 to-blue-600',
      icon: MdSchool
    },
    {
      id: 'execom',
      title: 'Meet the Execom Team',
      subtitle: '👑 Your Student Leaders',
      content: 'Dedicated students working to enhance your learning experience',
      bgColor: 'from-purple-600 via-pink-600 to-red-600',
      icon: FaTrophy
    },
    {
      id: 'join',
      title: 'How to Join?',
      subtitle: '✨ Start Your Journey',
      content: 'Register on MuLearn.org • Join Sahrdaya Chapter • Start Learning!',
      bgColor: 'from-orange-500 via-pink-500 to-purple-500',
      icon: FaUsers
    }
  ]

  return (
    <div className="presentation-container">
      {/* Progress indicator */}
      <div className="progress-indicator">
        <span className="text-white font-bold text-lg">
          {currentSection + 1} / {sections.length}
        </span>
      </div>

      {/* Navigation dots */}
      <div className="nav-dots">
        {sections.map((_, index) => (
          <motion.div
            key={index}
            className={`nav-dot ${currentSection === index ? 'active' : ''}`}
            onClick={() => {
              document.getElementById(sections[index].id)?.scrollIntoView({ 
                behavior: 'smooth' 
              })
            }}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>

      {sections.map((section, index) => (
        <Section
          key={section.id}
          section={section}
          index={index}
          isActive={currentSection === index}
        />
      ))}
    </div>
  )
}

const Section = ({ section, index, isActive }) => {
  const Icon = section.icon

  return (
    <motion.section
      id={section.id}
      className={`section relative overflow-hidden bg-gradient-to-br ${section.bgColor} flex items-center justify-center`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isActive ? 1 : 0.7, 
        scale: isActive ? 1 : 0.95 
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-3/4 h-3/4 bg-white/5 rounded-full"
          animate={{ 
            rotate: [360, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-8"
        >
          <Icon className="text-8xl md:text-9xl text-white/90 mx-auto mb-6" />
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-6 leading-tight"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {section.title}
        </motion.h1>

        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white/90 mb-8"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {section.subtitle}
        </motion.h2>

        <motion.p
          className="text-2xl md:text-3xl lg:text-4xl font-medium text-white/80 leading-relaxed max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {section.content}
        </motion.p>

        {/* Special content for specific sections */}
        {section.id === 'welcome' && (
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            <MuLearnLogo size="large" className="text-white mx-auto mb-4" />
            <div className="text-2xl md:text-3xl text-white/90 font-semibold">
              500+ Future Innovators Ready to Learn!
            </div>
          </motion.div>
        )}

        {section.id === 'games' && (
          <motion.div
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {['🎯 Icebreakers', '🧩 Team Puzzles', '🎪 Fun Challenges', '🏆 Mini Competitions'].map((game, i) => (
              <motion.div
                key={i}
                className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-xl font-bold"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {game}
              </motion.div>
            ))}
          </motion.div>
        )}

        {section.id === 'interest-groups' && (
          <motion.div
            className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {[
              '🤖 AI & Machine Learning',
              '🌐 Web Development', 
              '📱 Mobile Apps',
              '⚙️ DevOps & Cloud',
              '🎨 UI/UX Design',
              '💼 Entrepreneurship'
            ].map((group, i) => (
              <motion.div
                key={i}
                className="bg-white/15 backdrop-blur-md rounded-xl p-4 text-xl font-semibold"
                whileHover={{ scale: 1.1, rotate: 1 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1, duration: 0.6 }}
              >
                {group}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Scroll indicator */}
        {index < 15 && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.div
              className="w-8 h-12 border-3 border-white/70 rounded-full flex justify-center cursor-pointer"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={() => {
                window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
              }}
            >
              <motion.div
                className="w-2 h-4 bg-white/70 rounded-full mt-2"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}

export default PresentationPage
