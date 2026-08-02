import { motion as Motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

import MuLearnLogo from './MuLearnLogo'

const waitForImage = (image) => {
  if (!image) return Promise.resolve()
  if (image.complete) return image.decode?.().catch(() => undefined) ?? Promise.resolve()
  return new Promise((resolve) => {
    image.addEventListener('load', resolve, { once: true })
    image.addEventListener('error', resolve, { once: true })
  })
}

const afterTwoPaints = () => new Promise((resolve) => {
  requestAnimationFrame(() => requestAnimationFrame(resolve))
})

const HeroSection = () => {
  const mobileBackgroundRef = useRef(null)
  const desktopBackgroundRef = useRef(null)
  const illustrationRef = useRef(null)

  useEffect(() => {
    if (!document.documentElement.classList.contains('mulearn-intro-active')) return undefined

    let cancelled = false
    let timeoutId

    const activeBackground = window.matchMedia('(max-width: 639px)').matches
      ? mobileBackgroundRef.current
      : desktopBackgroundRef.current
    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    const visualReady = Promise.all([
      fontsReady,
      waitForImage(activeBackground),
      waitForImage(illustrationRef.current),
      afterTwoPaints(),
    ])
    const timeout = new Promise((resolve) => {
      timeoutId = window.setTimeout(resolve, 2600)
    })

    Promise.race([visualReady, timeout]).then(() => {
      window.clearTimeout(timeoutId)
      if (cancelled) return
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (!cancelled) window.__finishMulearnLoader?.()
      }))
    })

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-cornsilk via-cornsilk-600 to-earth-yellow-800">
      {/* Background SVG */}
      <Motion.div
        className="absolute inset-0"
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
      >
        {/* Mobile Background */}
        <img
          ref={mobileBackgroundRef}
          src="/assets/blob-scene-haikei-mobile.svg"
          alt=""
          className="block sm:hidden w-full h-full object-cover object-center"
        />
        {/* Desktop Background */}
        <img
          ref={desktopBackgroundRef}
          src="/assets/blob-scene-haikei.svg"
          alt=""
          className="hidden sm:block w-full h-full object-cover object-center"
        />
      </Motion.div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <Motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
        >
          <Motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <MuLearnLogo
              size="large"
              className="text-pakistan-green mb-4"
            />
            <Motion.h1
              className="text-4xl md:text-5xl font-light text-dark-moss-green"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              SahrdayaCET
              <span className="sr-only"> — µLearn Peer Learning Community at Sahrdaya College of Engineering & Technology, Thrissur, Kerala</span>
            </Motion.h1>
          </Motion.div>
        </Motion.div>

        <Motion.p
          className="text-xl md:text-2xl text-pakistan-green-600 mb-8 font-medium"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Empowering Students Through Peer Learning & Innovation
        </Motion.p>

        <Motion.p
          className="text-lg text-pakistan-green-400 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Ready to start your learning journey? Be part of a community that's redefining education.
        </Motion.p>

        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Motion.button
            className="bg-[#8f4c17] hover:bg-[#713b12] text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('https://app.mulearn.org', '_blank')}
          >
            Join MuLearn
          </Motion.button>
          <Motion.button
            className="border-2 border-dark-moss-green text-dark-moss-green hover:bg-dark-moss-green hover:text-cornsilk px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('https://mulearn.org/', '_blank')}
          >
            Learn More
          </Motion.button>
        </Motion.div>
      </div>

      {/* Floating illustration */}
      <Motion.div
        className="absolute transform -translate-x-1 bottom-[-8%] sm:bottom-[-10%] md:bottom-[-15%]"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 3 }}
      >
        <Motion.img
          ref={illustrationRef}
          src="/assets/illustration.webp"
          alt="Learning illustration"
          className="object-contain h-64 sm:h-120 md:h-120"
          animate={{ y: [10, 20, 10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </Motion.div>

      {/* Scroll indicator */}
      <Motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <Motion.div
          className="w-6 h-10 border-2 border-pakistan-green rounded-full flex justify-center"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Motion.div
            className="w-1 h-3 bg-pakistan-green rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </Motion.div>
      </Motion.div>
    </section>
  )
}

export default HeroSection
