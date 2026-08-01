import { useEffect } from 'react'
import { useLocation } from 'react-router'

export default function HashScrollHandler() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    let attempts = 0
    const findAndScroll = () => {
      const target = document.getElementById(hash.slice(1))
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else if (attempts++ < 10) window.setTimeout(findAndScroll, 50)
    }
    findAndScroll()
  }, [pathname, hash])

  return null
}
