import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { SEO_ROUTES } from '../src/seoConfig.js'

const dist = resolve('dist')
const source = await readFile(resolve(dist, 'index.html'), 'utf8')

const escapeAttr = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;')
const replaceMeta = (html, key, value, property = false) => {
  const attribute = property ? 'property' : 'name'
  const expression = new RegExp(`<meta\\s+${attribute}="${key}"[^>]*>`, 'i')
  const tag = `<meta ${attribute}="${key}" content="${escapeAttr(value)}" />`
  return expression.test(html) ? html.replace(expression, tag) : html.replace('</head>', `    ${tag}\n  </head>`)
}

function buildHtml(seo) {
  let html = source
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${seo.title}</title>`)
  html = replaceMeta(html, 'description', seo.description)
  html = replaceMeta(html, 'robots', seo.robots || 'index, follow')
  html = replaceMeta(html, 'theme-color', seo.themeColor)
  html = replaceMeta(html, 'og:title', seo.title, true)
  html = replaceMeta(html, 'og:description', seo.description, true)
  html = replaceMeta(html, 'og:url', seo.canonical || 'https://mulearnscet.in/404', true)
  html = replaceMeta(html, 'og:image', seo.image, true)
  html = replaceMeta(html, 'twitter:title', seo.title)
  html = replaceMeta(html, 'twitter:description', seo.description)
  html = replaceMeta(html, 'twitter:image', seo.image)
  html = html.replace(/<link\s+rel="canonical"[^>]*>\s*/i, seo.canonical ? `<link rel="canonical" href="${seo.canonical}" />\n    ` : '')
  html = html.replace(/<link id="route-fonts-preload"[^>]*>/i, `<link id="route-fonts-preload" rel="preload" as="style" href="${seo.fontHref}" />`)
  html = html.replace(/<link id="route-fonts"[^>]*>/i, `<link id="route-fonts" href="${seo.fontHref}" rel="stylesheet" media="print" />`)
  html = html.replace(/<noscript><link href="[^"]+" rel="stylesheet" \/><\/noscript>/i, `<noscript><link href="${seo.fontHref}" rel="stylesheet" /></noscript>`)
  const jsonLd = seo.jsonLd ? JSON.stringify(seo.jsonLd).replaceAll('<', '\\u003c') : ''
  html = html.replace(/<script id="route-jsonld" type="application\/ld\+json">[\s\S]*?<\/script>/i, jsonLd ? `<script id="route-jsonld" type="application/ld+json">${jsonLd}</script>` : '')
  if (seo.preloadImage) html = html.replace('</head>', `    <link rel="preload" as="image" href="${seo.preloadImage.href}" imagesrcset="${seo.preloadImage.srcset}" imagesizes="${seo.preloadImage.sizes}" fetchpriority="high" />\n  </head>`)
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">${seo.staticMarkup}</div>`)
  return html
}

const outputs = [
  ['/', SEO_ROUTES['/'], 'index.html'],
  ['/orientation-2026', SEO_ROUTES['/orientation-2026'], 'orientation-2026.html'],
  ['/team', SEO_ROUTES['/team'], 'team.html'],
  ['/karma-war', SEO_ROUTES['/karma-war'], 'karma-war.html'],
  ['*', SEO_ROUTES['*'], '404.html']
]

for (const [, seo, output] of outputs) {
  const target = resolve(dist, output)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, buildHtml(seo))
}

console.log('Generated route HTML for /, /orientation-2026, /team, /karma-war and 404.html')
