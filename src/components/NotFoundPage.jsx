import { Link } from 'react-router'
import { motion as Motion, useReducedMotion } from 'framer-motion'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6'
import './NotFoundPage.css'

export default function NotFoundPage() {
  const reduceMotion = useReducedMotion()
  return (
    <main className="not-found-page">
      <nav className="not-found-nav">
        <Link to="/" className="not-found-brand">µlearn <span>Sahrdaya</span></Link>
        <Link to="/" className="not-found-back"><FaArrowLeft /> Back home</Link>
      </nav>

      <div className="not-found-orb not-found-orb--purple" aria-hidden="true" />
      <div className="not-found-orb not-found-orb--orange" aria-hidden="true" />
      <div className="not-found-paper not-found-paper--one" aria-hidden="true" />
      <div className="not-found-paper not-found-paper--two" aria-hidden="true" />
      <div className="not-found-paper not-found-paper--three" aria-hidden="true" />

      <Motion.section
        className="not-found-content"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <p>ERROR · LOST PAGE</p>
        <h1><span>4</span><i>/</i><span>0</span><i>/</i><span>4</span></h1>
        <h2>This page wandered off.</h2>
        <p className="not-found-copy">The link may be outdated, mistyped, or hiding somewhere between two sections.</p>
        <div className="not-found-actions">
          <Link to="/">Return home <FaArrowRight /></Link>
          <Link to="/orientation-2026">Open the Meme Archive <FaArrowRight /></Link>
          <Link to="/team">Meet the team <FaArrowRight /></Link>
        </div>
      </Motion.section>

      <p className="not-found-footnote">µLEARN SAHRDAYA · KEEP EXPLORING</p>
    </main>
  )
}
