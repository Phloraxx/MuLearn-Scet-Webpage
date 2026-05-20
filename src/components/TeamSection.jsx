import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import TeamMemberCard from './TeamMemberCard'
import fullTeam from '../data/teamData'

const coreLeads = fullTeam.slice(0, 8)

const TeamSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden relative" id="team">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-pakistan-green to-tigers-eye rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-gradient-to-r from-tigers-eye to-earth-yellow rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-pakistan-green mb-6">
            Meet Our Team
          </h2>
          <p className="text-xl text-pakistan-green-700 max-w-3xl mx-auto">
            The passionate individuals driving innovation and learning at MuLearn SCET.
          </p>
        </motion.div>

        {/* Core Leads Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {coreLeads.map((member, index) => (
            <TeamMemberCard key={index} member={member} index={index} />
          ))}
        </div>

        {/* View Full Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            to="/team"
            className="inline-flex items-center gap-3 text-tigers-eye hover:text-tigers-eye-600 font-semibold text-lg transition-all duration-300 group/link"
          >
            <span>View Full Team</span>
            <FaArrowRight className="text-sm transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default TeamSection
