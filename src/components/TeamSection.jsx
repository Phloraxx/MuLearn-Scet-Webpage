import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaInstagram, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa'

const TeamSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })

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
      image: "/assets/team/Abel md.jpg",
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

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-cornsilk-800 to-cornsilk-700 overflow-hidden" id="team">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-pakistan-green mb-6">
            Meet Our Team
          </h2>
          <p className="text-xl text-pakistan-green-600 max-w-3xl mx-auto">
            The passionate individuals driving innovation and learning at MuLearn SCET. 
            Together, we're building a community of future tech leaders.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-hidden"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden"
              whileHover={{ 
                scale: 1.02,
                rotateY: 2,
                rotateX: 2,
                transition: { duration: 0.3 }
              }}
              style={{ perspective: "1000px" }}
            >
              {/* Image Container */}
              <div className="relative mb-6 overflow-hidden rounded-xl">
                <motion.img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = '/assets/team/placeholder.jpg'; // Fallback image
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-pakistan-green mb-2 group-hover:text-tigers-eye transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-tigers-eye font-semibold text-lg mb-3">
                  {member.role}
                </p>
                <p className="text-pakistan-green-600 text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-4 pt-4 border-t border-cornsilk-300">
                {member.social.instagram && member.social.instagram !== "#" && (
                  <motion.a
                    href={member.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`${member.name}'s Instagram`}
                  >
                    <FaInstagram className="text-sm" />
                  </motion.a>
                )}
                
                {member.social.linkedin && member.social.linkedin !== "#" && (
                  <motion.a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`${member.name}'s LinkedIn`}
                  >
                    <FaLinkedin className="text-sm" />
                  </motion.a>
                )}
                
                {member.social.github && member.social.github !== "#" && (
                  <motion.a
                    href={member.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`${member.name}'s GitHub`}
                  >
                    <FaGithub className="text-sm" />
                  </motion.a>
                )}
              </div>

              {/* Decorative Element */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-tigers-eye rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </motion.div>

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
