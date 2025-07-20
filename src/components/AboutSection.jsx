import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaLightbulb, FaUsers, FaRocket } from 'react-icons/fa'

const AboutSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.2 })

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  }

  return (
    <section ref={ref} className="py-20 bg-cornsilk-800 overflow-x-hidden" id="about">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-pakistan-green mb-6">
            About µLearn Sahrdaya
          </h2>
          <p className="text-xl text-pakistan-green-600 max-w-3xl mx-auto">
            <span class="type-example">µLearn </span>is a synergic philosophy of education, with a culture of mutual learning through micro peer groups.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-dark-moss-green mb-6">Our Mission</h3>
            <p className="text-lg text-pakistan-green-600 mb-6 leading-relaxed">
              To create a thriving ecosystem of self-driven learners, empowering students to develop 
              industry-relevant skills, collaborate on exciting projects, and contribute to real-world solutions.
            </p>
            <p className="text-lg text-pakistan-green-600 leading-relaxed">
              We are here to assist you in breaking through the echo chambers and free you from the 
              shackles you have grounded yourself in.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-tigers-eye-200 to-earth-yellow-200 rounded-2xl p-8 shadow-xl">
              <div className="bg-white rounded-xl p-6">
                <h4 className="text-2xl font-bold text-pakistan-green mb-4">
                  Join Our Community
                </h4>
                <p className="text-pakistan-green-600 mb-4">
                  Connect with like-minded learners and start your journey today.
                </p>
                <div className="flex items-center gap-3 text-tigers-eye font-semibold">
                  <FaUsers className="text-xl" />
                  <span>1000+ Active Members</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: FaLightbulb,
              title: "Innovation",
              description: "Fostering creative thinking and innovative solutions to real-world challenges."
            },
            {
              icon: FaUsers,
              title: "Peer Learning",
              description: "Learning together through micro peer groups and collaborative projects."
            },
            {
              icon: FaRocket,
              title: "Growth",
              description: "Accelerating personal and professional growth through hands-on experience."
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={cardVariants}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-tigers-eye"
            >
              <div className="bg-tigers-eye-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <item.icon className="text-2xl text-tigers-eye" />
              </div>
              <h4 className="text-xl font-bold text-pakistan-green mb-4">{item.title}</h4>
              <p className="text-pakistan-green-600 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-dark-moss-green to-pakistan-green rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h3>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of students who are already part of the µLearn revolution.
            </p>
            <motion.button
              className="bg-tigers-eye hover:bg-tigers-eye-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              onClick={() => window.open('https://app.mulearn.org/', '_blank')}
            >
              Get Started Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
