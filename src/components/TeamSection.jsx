import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FaInstagram, FaLinkedin, FaGithub, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const TeamSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })
  const [currentIndex, setCurrentIndex] = useState(0)

  const teamMembers = [
    {
      name: "Yadhu Krishna",
      role: "Campus Lead",
      image: "/assets/team/YadhuKrishna.png",
      social: {
        instagram: "https://www.instagram.com/ya_d_hu.__/",
        linkedin: "#", // Placeholder
        github: "#" // Placeholder
      },
      description: "Leading our campus community with passion and innovation."
    },
    {
      name: "Sandhwana Rose Shaju",
      role: "Campus Co-Lead",
      image: "/assets/team/Sandhwana Rose Shaju.png",
      social: {
        instagram: "https://www.instagram.com/san_d_rosee/",
        linkedin: "#", // Placeholder
        github: "#" // Placeholder
      },
      description: "Supporting our vision and driving collaborative excellence."
    },
    {
      name: "Nandhana Biju",
      role: "General Lead",
      image: "/assets/team/Nandhana Biju.jpg",
      social: {
        instagram: "https://www.instagram.com/nan_dhaaaaah/",
        linkedin: "#", // Placeholder
        github: "#" // Placeholder
      },
      description: "Coordinating operations and ensuring smooth workflows."
    },
    {
      name: "Sourav P Bijoy",
      role: "Tech Lead",
      image: "/assets/team/Sourav P Bijoy_.jpg",
      social: {
        instagram: "https://www.instagram.com/souravpbijoy/",
        linkedin: "#", // Placeholder
        github: "#" // Placeholder
      },
      description: "Driving technical innovation and development initiatives."
    },
    {
      name: "Abel md",
      role: "Media Lead",
      image: "/assets/team/Abel md.png",
      social: {
        instagram: "https://www.instagram.com/_.abel_md._/",
        linkedin: "#", // Placeholder
        github: "#" // Placeholder
      },
      description: "Creating compelling visual content and managing our digital presence."
    },
    {
      name: "Niya rose Joseph",
      role: "Content Lead",
      image: "/assets/team/Niya_rose_Joseph.jpg",
      social: {
        instagram: "https://www.instagram.com/niya._.joseph/",
        linkedin: "#", // Placeholder
        github: "#" // Placeholder
      },
      description: "Crafting engaging content and communication strategies."
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const nextMember = () => {
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length)
  }

  const prevMember = () => {
    setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length)
  }

  const currentMember = teamMembers[currentIndex]

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden relative min-h-screen" id="team">
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
            Click through to meet each team member.
          </p>
        </motion.div>

        {/* Main Team Display */}
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          {/* Left Side - Team Member Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Member Info */}
                <div className="space-y-4">
                  <motion.h3 
                    className="text-4xl font-bold text-pakistan-green"
                    layoutId="name"
                  >
                    {currentMember.name}
                  </motion.h3>
                  <motion.p 
                    className="text-2xl font-semibold text-tigers-eye bg-gradient-to-r from-tigers-eye/10 to-earth-yellow/10 px-4 py-2 rounded-xl inline-block"
                    layoutId="role"
                  >
                    {currentMember.role}
                  </motion.p>
                  <motion.p 
                    className="text-lg text-pakistan-green-600 leading-relaxed"
                    layoutId="description"
                  >
                    {currentMember.description}
                  </motion.p>
                </div>

                {/* Social Links */}
                <div className="flex gap-4">
                  {currentMember.social.instagram && currentMember.social.instagram !== "#" && (
                    <motion.a
                      href={currentMember.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`${currentMember.name}'s Instagram`}
                    >
                      <FaInstagram className="text-xl" />
                    </motion.a>
                  )}
                  
                  {currentMember.social.linkedin && currentMember.social.linkedin !== "#" && (
                    <motion.a
                      href={currentMember.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`${currentMember.name}'s LinkedIn`}
                    >
                      <FaLinkedin className="text-xl" />
                    </motion.a>
                  )}
                  
                  {currentMember.social.github && currentMember.social.github !== "#" && (
                    <motion.a
                      href={currentMember.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`${currentMember.name}'s GitHub`}
                    >
                      <FaGithub className="text-xl" />
                    </motion.a>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-6">
                  <motion.button
                    onClick={prevMember}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pakistan-green to-pakistan-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaChevronLeft />
                    Previous
                  </motion.button>
                  <motion.button
                    onClick={nextMember}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-tigers-eye to-earth-yellow text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next
                    <FaChevronRight />
                  </motion.button>
                </div>

                {/* Member Counter */}
                <div className="flex gap-2 pt-4">
                  {teamMembers.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex 
                          ? 'bg-pakistan-green scale-125' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right Side - Team Member Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative"
              >
                {/* Background Decorative Circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-tigers-eye/20 to-pakistan-green/20 rounded-full blur-3xl scale-110"></div>
                
                {/* Main Image Container */}
                <div className="relative w-96 h-96 mx-auto">
                  <div className="w-full h-full rounded-3xl overflow-hidden border-8 border-white shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                    <motion.img
                      src={currentMember.image}
                      alt={currentMember.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/team/placeholder.jpg';
                      }}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  
                  {/* Floating Decorative Elements */}
                  <motion.div
                    className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-tigers-eye to-earth-yellow rounded-full shadow-xl"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-pakistan-green to-pakistan-green-600 rounded-full shadow-lg"
                    animate={{
                      rotate: [360, 0],
                      y: [0, -10, 0]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-tigers-eye-200 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-pakistan-green mb-4">
              Want to Join Our Team?
            </h3>
            <p className="text-pakistan-green-600 mb-6">
              We're always looking for passionate individuals who want to make a difference in the tech community.
            </p>
            <motion.button
              onClick={() => window.open('https://discord.gg/3jbpEubWRA', '_blank')}
              className="bg-gradient-to-r from-tigers-eye to-earth-yellow text-white px-8 py-3 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Connect With Us
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TeamSection
