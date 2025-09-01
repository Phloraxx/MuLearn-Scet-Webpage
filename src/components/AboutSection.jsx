import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaLightbulb, FaUsers, FaRocket } from 'react-icons/fa'

const AboutSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.2 })

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

        <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-dark-moss-green mb-6">Our Mission</h3>
              <p className="text-lg text-pakistan-green-600 mb-6 leading-relaxed">
                To create a thriving ecosystem of self-driven learners, empowering students to develop 
                industry-relevant skills, collaborate on exciting projects, and contribute to real-world solutions.
              </p>
              <p className="text-lg text-pakistan-green-600 leading-relaxed">
                We are here to assist you in breaking through the echo chambers and free you from the 
                shackles you have grounded yourself in.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center items-center"
          >
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                <div className="relative bg-black rounded-[2.5rem] p-1">
                  <div className="relative bg-white rounded-[2rem] overflow-hidden">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-black rounded-b-xl w-32 h-6 z-10"></div>
                    
                    {/* Video Container */}
                    <div className="relative w-80 h-[640px] bg-black rounded-[2rem] overflow-hidden">
                      <video
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      >
                        <source src="/assets/fwdaiworkshop (2)/orientation.mp4" type="video/mp4" />
                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-pakistan-green to-dark-moss-green text-white text-center p-8">
                          <div>
                            <FaRocket className="text-6xl mb-4 mx-auto opacity-80" />
                            <p className="text-lg font-semibold mb-2">Video Not Supported</p>
                            <p className="text-sm opacity-90">Please upgrade your browser to view our orientation experience</p>
                          </div>
                        </div>
                      </video>
                      
                      {/* Video Overlay with Logo/Text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6 opacity-0 hover:opacity-75 active:opacity-75">
                        <div className="text-white">
                          <h3 className="text-2xl font-bold mb-2">µLearn Experience</h3>
                          <p className="text-sm opacity-90">Discover our learning journey</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Phone Details */}
                <div className="absolute -right-1 top-20 bg-gray-900 w-1 h-12 rounded-l"></div>
                <div className="absolute -right-1 top-36 bg-gray-900 w-1 h-8 rounded-l"></div>
                <div className="absolute -right-1 top-48 bg-gray-900 w-1 h-8 rounded-l"></div>
                <div className="absolute -left-1 top-24 bg-gray-900 w-1 h-16 rounded-r"></div>
              </div>
              
              {/* Floating Elements Around Phone */}
              <motion.div
                className="absolute -top-4 -right-4 bg-tigers-eye text-white rounded-full p-3"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaRocket className="text-xl" />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-4 bg-pakistan-green text-white rounded-full p-3"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <FaUsers className="text-xl" />
              </motion.div>
              
              <motion.div
                className="absolute top-1/2 -left-8 bg-dark-moss-green text-white rounded-full p-3"
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <FaLightbulb className="text-xl" />
              </motion.div>
            </div>
          </motion.div>
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
