import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => onLoadingComplete(), 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(timer)
  }, [onLoadingComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-gradient-to-br from-cornsilk via-cornsilk-600 to-earth-yellow-800 flex items-center justify-center z-50"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-6xl font-bold text-pakistan-green mb-4">
            µLearn
            <span className="block text-3xl font-light text-dark-moss-green mt-2">
              Sahrdaya
            </span>
          </h1>
        </motion.div>

        <div className="w-64 h-2 bg-white/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-tigers-eye rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-pakistan-green-600 mt-4 font-medium"
        >
          Loading... {progress}%
        </motion.p>
      </div>
    </motion.div>
  )
}

export default LoadingScreen
