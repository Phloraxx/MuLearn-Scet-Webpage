import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaCode, FaLaptop, FaBrain, FaUsers, FaGithub, FaExternalLinkAlt } from 'react-icons/fa'

const ProjectsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })

  const projects = [
    {
      title: "Art of Teaching",
      description: "µLearn is returning with Art of Teaching to pay tribute to educators who shape the next generation.",
      icon: FaBrain,
      tags: ["Teaching", "Career Labs", "Campus"],
      status: "Completed",
      gradient: "from-tigers-eye to-earth-yellow",
      link: "https://mulearn.org/artofteaching"
    },
    {
      title: "Web Development IG",
      description: "Full-stack web development program covering modern frameworks, databases, and deployment strategies.",
      icon: FaCode,
      tags: ["React", "Node.js", "MongoDB"],
      status: "Ongoing",
      gradient: "from-dark-moss-green to-pakistan-green",
      link: "https://learn.mulearn.org/webmobile",
      join: "https://app.mulearn.org/dashboard/interestgroups/9b8aaf7f-16a0-4a66-ae53-79b8c25e5faa"
    },
    {
      title: "Open Source Contributions",
      description: "Community-driven projects where students contribute to open source repositories and build their portfolios.",
      icon: FaGithub,
      tags: ["Open Source", "FossHack", "Collaboration"],
      status: "Active",
      gradient: "from-earth-yellow to-tigers-eye",
      link: "https://learn.mulearn.org/opensource"
    },
    {
      title: "Permute",
      description: "Perµte is the annual flagship celebration of the µLearn Foundation—an electrifying gathering that honors excellence, sparks bold ideas through thought-provoking panels, unveils visionary roadmaps, and ignites connections across a vibrant tapestry of talent and innovation.",
      icon: FaUsers,
      tags: ["Mentorship", "Skill Building", "Community"],
      status: "Completed",
      gradient: "from-pakistan-green to-dark-moss-green",
      link: "https://permute.mulearn.org/"
    },
    {
      title: "Cyber Security",
      description: "Having an extra layer of security is always an advantage in the current world. The best way to prevent a cyber attack is to learn how it works and block all the loopholes that allow it.",
      icon: FaLaptop,
      tags: ["μChallenges", "Industry", "Analysis"],
      status: "Active",
      gradient: "from-tigers-eye-600 to-earth-yellow-600",
      link: "https://learn.mulearn.org/cybersec",
      join: "https://app.mulearn.org/dashboard/interestgroups/3a74725e-a05a-418b-a275-39d68ad9a416"
    },
    {
      title: "Hacktober fest",
      description: "Hacktoberfest is Digital Ocean’s annual event that seeks to encourage people to make open-source contributions throughout the month of October.",
      icon: FaCode,
      tags: ["Algorithms", "Problem Solving", "Competition"],
      status: "October-ly",
      gradient: "from-dark-moss-green-600 to-pakistan-green-600",
      link: "https://mulearn.org/hacktoberfest"
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
                    <div className="bg-auto bg-opacity-20 w-12 h-12 rounded-full flex items-center justify-center">
                      <project.icon className="text-xl" />
                    </div>
                    <span className="bg-auto bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
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
                  <button 
                    className={`${project.join ? 'flex-1' : 'w-full'} bg-tigers-eye hover:bg-tigers-eye-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2`}
                    onClick={() => window.open(project.link, "_blank", "noopener,noreferrer")}
                  >                 
                    <span>Learn More</span>
                    <FaExternalLinkAlt className="text-sm" />
                  </button>
                  {project.join && (
                    <button 
                      className="border-2 border-dark-moss-green text-dark-moss-green hover:bg-dark-moss-green hover:text-white py-2 px-4 rounded-lg font-medium transition-all duration-300"
                      onClick={() => window.open(project.join, "_blank", "noopener,noreferrer")}
                    >
                      Join
                    </button>
                  )}
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
              We're always looking for new and exciting projects to work on together. We provide resources required for you to showcase and achieve your dreams.
            </p>
            <motion.button
              className="bg-gradient-to-r from-tigers-eye to-earth-yellow text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(188, 108, 37, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = "mailto:mulearn@sahrdaya.ac.to?subject=Propose%20a%20Project"}
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
