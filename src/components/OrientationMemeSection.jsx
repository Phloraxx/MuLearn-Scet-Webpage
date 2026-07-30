import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { FaInstagram, FaVolumeHigh, FaVolumeXmark } from 'react-icons/fa6'
import './OrientationMemeSection.css'

const cards = [
  { id: 'two-guys', photo: 'two-guys.webp', reference: 'two-guys.webp', className: 'meme-card--one' },
  { id: 'absolute-cinema', photo: 'absolute-cinema.webp', reference: 'absolute-cinema.webp', className: 'meme-card--two' },
  { id: 'woman-yelling', photo: 'woman-yelling.webp', reference: 'woman-yelling.webp', className: 'meme-card--three' },
  { id: 'running-away', photo: 'running-away.webp', reference: 'running-away.webp', className: 'meme-card--four' },
  { id: 'freeze-slap', photo: 'freeze-slap.webp', reference: 'freeze-slap.webp', className: 'meme-card--five' },
  { id: 'mask-reveal', photo: 'mask-reveal.webp', reference: 'mask-reveal.webp', className: 'meme-card--six' },
  { id: 'drake', photo: 'drake.webp', reference: 'drake.webp', className: 'meme-card--seven' },
  { id: 'doge-cheems', photo: 'doge-cheems.webp', reference: 'doge-cheems.webp', className: 'meme-card--eight' },
]

const asset = (type, file) => `/assets/orientation/${type}/${file}`

function MemeCard({ card, index, active, setActive, reduceMotion }) {
  const isActive = active === card.id
  return (
    <div className={`meme-card-slot ${card.className}`}>
      <motion.button
        type="button"
        className={`meme-card ${isActive ? 'is-reference' : ''}`}
        onClick={() => setActive(isActive ? null : card.id)}
        onMouseEnter={() => setActive(card.id)}
        onMouseLeave={() => setActive(null)}
        aria-label="Toggle original meme reference"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.88, y: 30 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, delay: index * 0.045, ease: [0.22, 1, 0.36, 1] }}
        whileHover={reduceMotion ? undefined : { scale: 1.035, zIndex: 16 }}
      >
        <span className="meme-card__surface">
          <img className="meme-card__reality" src={asset('photos', card.photo)} alt="Student meme recreation" loading="lazy" />
          <span className="meme-card__reference" aria-hidden="true">
            <img src={asset('references', card.reference)} alt="" loading="lazy" />
          </span>
        </span>
      </motion.button>
      <span className="meme-card__corner" aria-hidden="true" />
    </div>
  )
}

export default function OrientationMemeSection() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const isInView = useInView(sectionRef, { amount: 0.28 })
  const reduceMotion = useReducedMotion()
  const [muted, setMuted] = useState(true)
  const [active, setActive] = useState(null)
  const orderedCards = useMemo(() => cards, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isInView && !reduceMotion) video.play().catch(() => {})
    else video.pause()
  }, [isInView, reduceMotion])

  const toggleSound = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
    if (video.paused) video.play().catch(() => {})
  }

  return (
    <section ref={sectionRef} className="orientation-memes" aria-labelledby="orientation-memes-title">
      <div className="orientation-memes__noise" aria-hidden="true" />
      <div className="orientation-memes__inner">
        <motion.header
          className="orientation-memes__header"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7 }}
        >
          <p>µLEARN ORIENTATION · 2026</p>
          <h2 id="orientation-memes-title">
            <span>REFERENCE</span>
            <i aria-hidden="true">/</i>
            <span>REALITY</span>
          </h2>
        </motion.header>

        <div className="orientation-memes__stage">
          <div className="orientation-memes__cards" aria-label="Hand-picked meme recreations">
            {orderedCards.map((card, index) => (
              <MemeCard
                key={card.id}
                card={card}
                index={index}
                active={active}
                setActive={setActive}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>

          <motion.div
            className="orientation-memes__reel"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92, rotate: -2 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="orientation-memes__reel-frame">
              <video
                ref={videoRef}
                poster="/assets/orientation/mulearn-orientation-poster.webp"
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src="/assets/orientation/mulearn-orientation.webm" type="video/webm; codecs=vp9,opus" />
                <source src="/assets/orientation/mulearn-orientation.mp4" type="video/mp4" />
              </video>
              <button type="button" className="orientation-memes__sound" onClick={toggleSound} aria-label={muted ? 'Turn sound on' : 'Turn sound off'}>
                {muted ? <FaVolumeXmark /> : <FaVolumeHigh />}
              </button>
            </div>
          </motion.div>
        </div>

        <a className="orientation-memes__instagram" href="https://www.instagram.com/reel/DbYbImLQ9Kz/" target="_blank" rel="noreferrer">
          <FaInstagram />
          <span>WATCH THE REEL</span>
          <b aria-hidden="true">↗</b>
        </a>
      </div>
    </section>
  )
}
