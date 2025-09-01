import { motion } from 'framer-motion'
import { FaDiscord, FaArrowRight } from 'react-icons/fa'
import MuLearnLogo from './MuLearnLogo'

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-cornsilk via-cornsilk-600 to-earth-yellow-800">
      {/* Background SVG */}
      <motion.div 
        className="absolute inset-0"
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
      >
        <img 
          src="/assets/blob-scene-haikei.svg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
        >
          <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <MuLearnLogo 
              size="large" 
              className="text-pakistan-green mb-4"
            />
            <motion.span 
              className="text-4xl md:text-5xl font-light text-dark-moss-green"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              SahrdayaCET
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.p 
          className="text-xl md:text-2xl text-pakistan-green-600 mb-8 font-medium"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Empowering Students Through Peer Learning & Innovation
        </motion.p>

        <motion.p 
          className="text-lg text-pakistan-green-400 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Ready to start your learning journey? Be part of a community that's redefining education.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            className="bg-tigers-eye hover:bg-tigers-eye-600 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg opacity-95"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('https://app.mulearn.org', '_blank')}
          >
            <FaArrowRight className="text-xl" />
            Register to MuLearn
            <FaArrowRight className="text-sm" />
          </motion.button>
          
          <motion.button
            className="border-2 border-dark-moss-green text-dark-moss-green hover:bg-dark-moss-green hover:text-cornsilk px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('https://mulearn.org/', '_blank')}
          >
            Learn More
          </motion.button>
        </motion.div>
      </div>

      {/* Floating illustration */}
      <motion.div
        className="absolute transform -bottom-1/5 sm:-bottom-1/6"
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 100 }}
        transition={{ delay: 1.2, duration: 3 }}
      >
        <motion.img
          src="/assets/illustration.webp"
          alt="Learning illustration"
          className="object-contain h-120"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-pakistan-green rounded-full flex justify-center"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-pakistan-green rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default HeroSection
