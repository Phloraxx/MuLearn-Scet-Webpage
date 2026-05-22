import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import Navigation from './Navigation'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import TeamMemberCard from './TeamMemberCard'
import fullTeam from '../data/teamData'

const execLeads = fullTeam.slice(0, 8)
const igLeads = fullTeam.slice(8)

const FullTeamPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-pakistan-green-600 hover:text-pakistan-green transition-colors mb-6 text-sm font-medium"
            >
              <FaArrowLeft />
              Back to Home
            </Link>
            <h1 className="text-5xl font-bold text-pakistan-green mb-4">
              Our Team
            </h1>
            <p className="text-xl text-pakistan-green-700 max-w-3xl mx-auto">
              Meet everyone driving the µLearn community at Sahrdaya CET.
            </p>
          </motion.div>

          {/* Executive Leads */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pakistan-green/30 to-transparent"></div>
              <h2 className="text-2xl font-bold text-pakistan-green text-center whitespace-nowrap">Executive Team</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pakistan-green/30 to-transparent"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
              {execLeads.map((member, index) => (
                <TeamMemberCard key={index} member={member} index={index} />
              ))}
            </div>
          </div>

          {/* Interest Group Leads */}
          <div>
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-tigers-eye/30 to-transparent"></div>
              <h2 className="text-2xl font-bold text-tigers-eye text-center whitespace-nowrap">Interest Group Leads</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-tigers-eye/30 to-transparent"></div>
            </div>
            <div className="flex flex-wrap justify-center gap-5 sm:gap-6 lg:gap-8">
              {igLeads.map((member, index) => (
                <div key={index} className="w-[calc(50%-1.25rem)] sm:w-[calc(33.333%-1.5rem)] lg:w-[calc(25%-1.5rem)] max-w-[280px]">
                  <TeamMemberCard member={member} index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default FullTeamPage
