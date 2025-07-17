import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaCode, FaLaptop, FaBrain, FaUsers, FaGithub, FaExternalLinkAlt } from 'react-icons/fa'

const ProjectsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })

  const projects = [
    {
      title: "AI Workshop Series",
      description: "Comprehensive workshops covering machine learning, deep learning, and AI applications in real-world scenarios.",
      icon: FaBrain,
      tags: ["Machine Learning", "Python", "TensorFlow"],
      status: "Ongoing",
      gradient: "from-tigers-eye to-earth-yellow"
    },
    {
      title: "Web Development Bootcamp",
      description: "Full-stack web development program covering modern frameworks, databases, and deployment strategies.",
      icon: FaCode,
      tags: ["React", "Node.js", "MongoDB"],
      status: "Completed",
      gradient: "from-dark-moss-green to-pakistan-green"
    },
    {
      title: "Open Source Contributions",
      description: "Community-driven projects where students contribute to open source repositories and build their portfolios.",
      icon: FaGithub,
      tags: ["Open Source", "Git", "Collaboration"],
      status: "Active",
      gradient: "from-earth-yellow to-tigers-eye"
    },
    {
      title: "Peer Learning Platform",
      description: "Custom platform for facilitating micro peer groups and tracking learning progress across the community.",
      icon: FaUsers,
      tags: ["React", "Firebase", "Community"],
      status: "In Development",
      gradient: "from-pakistan-green to-dark-moss-green"
    },
    {
      title: "Tech Talk Series",
      description: "Regular tech talks by industry experts, alumni, and community members sharing their experiences and insights.",
      icon: FaLaptop,
      tags: ["Speaking", "Industry", "Networking"],
      status: "Monthly",
      gradient: "from-tigers-eye-600 to-earth-yellow-600"
    },
    {
      title: "Hackathon Training",
      description: "Intensive training sessions preparing students for competitive programming and hackathon participation.",
      icon: FaCode,
      tags: ["Algorithms", "Problem Solving", "Competition"],
      status: "Quarterly",
      gradient: "from-dark-moss-green-600 to-pakistan-green-600"
    }
  ]

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  }

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-cornsilk-700 to-cornsilk-800" id="projects">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-pakistan-green mb-6">
            Our Projects & Initiatives
          </h2>
          <p className="text-xl text-pakistan-green-600 max-w-3xl mx-auto">
            Discover the exciting projects and learning opportunities that make µLearn Sahrdaya a hub of innovation and growth.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${project.gradient} p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <project.icon className="w-full h-full" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white bg-opacity-20 w-12 h-12 rounded-full flex items-center justify-center">
                      <project.icon className="text-xl" />
                    </div>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-pakistan-green-600 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-cornsilk-600 text-pakistan-green px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-tigers-eye hover:bg-tigers-eye-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2">
                    <span>Learn More</span>
                    <FaExternalLinkAlt className="text-sm" />
                  </button>
                  <button className="border-2 border-dark-moss-green text-dark-moss-green hover:bg-dark-moss-green hover:text-white py-2 px-4 rounded-lg font-medium transition-all duration-300">
                    Join
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-xl border-l-4 border-tigers-eye">
            <h3 className="text-3xl font-bold text-pakistan-green mb-4">
              Have a Project Idea?
            </h3>
            <p className="text-xl text-pakistan-green-600 mb-6">
              We're always looking for new and exciting projects to work on together.
            </p>
            <motion.button
              className="bg-gradient-to-r from-tigers-eye to-earth-yellow text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(188, 108, 37, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              Propose a Project
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ProjectsSection
