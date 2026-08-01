import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router'
import { getSeoForPath } from '../seoConfig'

function setMeta(selector, attributes) {
  let node = document.head.querySelector(selector)
  if (!node) {
    node = document.createElement('meta')
    document.head.appendChild(node)
  }
  Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value))
}

export default function SeoManager() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const seo = getSeoForPath(pathname)
    document.title = seo.title
    setMeta('meta[name="description"]', { name: 'description', content: seo.description })
    setMeta('meta[name="robots"]', { name: 'robots', content: seo.robots || 'index, follow' })
    setMeta('meta[name="theme-color"]', { name: 'theme-color', content: seo.themeColor })
    setMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title })
    setMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description })
    setMeta('meta[property="og:url"]', { property: 'og:url', content: seo.canonical || window.location.href })
    setMeta('meta[property="og:image"]', { property: 'og:image', content: seo.image })
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title })
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description })
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: seo.image })

    const routeFonts = document.getElementById('route-fonts')
    const routeFontsPreload = document.getElementById('route-fonts-preload')
    if (seo.fontHref) {
      if (routeFonts && routeFonts.getAttribute('href') !== seo.fontHref) routeFonts.setAttribute('href', seo.fontHref)
      if (routeFontsPreload && routeFontsPreload.getAttribute('href') !== seo.fontHref) routeFontsPreload.setAttribute('href', seo.fontHref)
    }

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (seo.canonical) {
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.appendChild(canonical)
      }
      canonical.href = seo.canonical
    } else canonical?.remove()

    let jsonLd = document.getElementById('route-jsonld')
    if (seo.jsonLd) {
      if (!jsonLd) {
        jsonLd = document.createElement('script')
        jsonLd.type = 'application/ld+json'
        jsonLd.id = 'route-jsonld'
        document.head.appendChild(jsonLd)
      }
      jsonLd.textContent = JSON.stringify(seo.jsonLd)
    } else jsonLd?.remove()
  }, [pathname])

  return null
}
