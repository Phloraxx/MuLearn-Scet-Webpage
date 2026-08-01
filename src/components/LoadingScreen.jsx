import { useEffect, useState } from 'react'
import MuLearnLogo from './MuLearnLogo'

const DURATION_MS = 1050
const HOLD_MS = 180
const FADE_MS = 450

export default function LoadingScreen({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const startedAt = performance.now()
    let frameId
    let exitTimer
    let finishTimer

    const update = (now) => {
      const next = Math.min(100, Math.round(((now - startedAt) / DURATION_MS) * 100))
      setProgress(next)
      if (next < 100) {
        frameId = requestAnimationFrame(update)
        return
      }
      exitTimer = window.setTimeout(() => {
        setIsExiting(true)
        finishTimer = window.setTimeout(onLoadingComplete, FADE_MS)
      }, HOLD_MS)
    }

    frameId = requestAnimationFrame(update)
    return () => {
      cancelAnimationFrame(frameId)
      window.clearTimeout(exitTimer)
      window.clearTimeout(finishTimer)
    }
  }, [onLoadingComplete])

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-cornsilk via-cornsilk-600 to-earth-yellow-800 transition-opacity duration-500 ease-out ${isExiting ? 'opacity-0' : 'opacity-100'}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading µLearn Sahrdaya, ${progress}%`}
    >
      <div className="w-[min(78vw,25rem)] text-center">
        <div className="loading-logo-enter mb-8 flex flex-col items-center">
          <MuLearnLogo size="large" className="mb-4 text-pakistan-green" />
          <span className="text-3xl font-light text-dark-moss-green">Sahrdaya</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/35">
          <div
            className="h-full rounded-full bg-tigers-eye transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-4 font-medium text-pakistan-green-600">
          Loading... {progress}%
        </p>
      </div>
    </div>
  )
}
