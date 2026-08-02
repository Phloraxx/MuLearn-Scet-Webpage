import { access, readFile, readdir, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import { SEO_ROUTES } from '../src/seoConfig.js'
import teamData from '../src/data/teamData.js'

const root = resolve('.')
const dist = resolve(root, 'dist')
const failures = []
const pass = (condition, message) => { if (!condition) failures.push(message) }
const exists = async (path) => { try { await access(path); return true } catch { return false } }
const content = (path) => readFile(path, 'utf8')
const attr = (html, tagPattern, name) => new RegExp(`<${tagPattern}[^>]*${name}="([^"]*)"[^>]*>`, 'i').exec(html)?.[1] || null
const textOf = (html, tag) => (new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i').exec(html)?.[1] || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

const routes = [
  { file: 'index.html', key: '/', h1: 'Peer learning, projects and community at Sahrdaya CET' },
  { file: 'orientation-2026.html', key: '/orientation-2026', h1: 'The Meme Archive' },
  { file: 'team.html', key: '/team', h1: 'Our Team' },
  { file: 'karma-war.html', key: '/karma-war', h1: 'Karma War 2026' },
  { file: '404.html', key: '*', h1: '404' },
]

for (const route of routes) {
  const file = resolve(dist, route.file)
  pass(await exists(file), `Missing generated route: ${route.file}`)
  if (!(await exists(file))) continue
  const html = await content(file)
  const seo = SEO_ROUTES[route.key]
  pass(textOf(html, 'title') === seo.title, `${route.file}: wrong title`)
  pass(attr(html, 'meta', 'name="description" content') === null || html.includes(`content="${seo.description.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"`), `${route.file}: wrong description`)
  pass(textOf(html, 'h1') === route.h1, `${route.file}: wrong static H1`)
  pass(html.includes(`content="${seo.robots || 'index, follow'}"`), `${route.file}: wrong robots directive`)
  if (seo.canonical) pass(html.includes(`<link rel="canonical" href="${seo.canonical}"`), `${route.file}: wrong canonical`)
  else pass(!html.includes('rel="canonical"'), `${route.file}: 404 must not be canonicalized`)
  pass(html.includes(`content="${seo.image}"`), `${route.file}: missing social image`)
  pass(html.includes('display=swap'), `${route.file}: route fonts must use display=swap`)
  pass(!html.includes('id="route-fonts"') || !/id="route-fonts"[^>]*media="print"/i.test(html), `${route.file}: route font stylesheet is still delayed behind print media`)
  pass(!html.includes('/font-loader.js'), `${route.file}: obsolete delayed font loader is still present`)
  pass(route.key === '*' ? !html.includes('id="route-jsonld"') : html.includes('id="route-jsonld"'), `${route.file}: structured data mismatch`)
}

const manifestPath = resolve(root, 'public/assets/orientation/archive/manifest.json')
const archive = JSON.parse(await content(manifestPath))
pass(archive.count === 216, `Archive count is ${archive.count}, expected 216`)
pass(archive.photos.length === 216, `Archive photo array contains ${archive.photos.length}, expected 216`)
pass(new Set(archive.photos.map((photo) => photo.id)).size === archive.photos.length, 'Archive photo IDs are not unique')
for (const photo of archive.photos) {
  for (const path of [photo.thumb, photo.full, `/assets/orientation/archive/references/${photo.reference}`]) {
    pass(await exists(resolve(root, `public${path}`)), `Missing archive asset: ${path}`)
  }
}

for (const member of teamData) {
  if (!member.image) continue
  pass(member.image.endsWith('-640.webp'), `Team member is not using optimized WebP: ${member.name}`)
  pass(await exists(resolve(root, `public${member.image}`)), `Missing team image: ${member.image}`)
  pass(await exists(resolve(root, `public${member.image.replace('-640.webp', '-320.webp')}`)), `Missing small team image: ${member.image}`)
}
const teamRoot = resolve(root, 'public/assets/team')
const topLevelTeamFiles = await readdir(teamRoot, { withFileTypes: true })
pass(!topLevelTeamFiles.some((entry) => entry.isFile() && entry.name.endsWith('.png')), 'Legacy team PNGs are still deployed')
let teamBytes = 0
for (const file of await readdir(resolve(teamRoot, 'optimized'))) teamBytes += (await stat(resolve(teamRoot, 'optimized', file))).size
pass(teamBytes < 1024 * 1024, `Optimized team directory is too large: ${teamBytes} bytes`)

const sitemap = await content(resolve(root, 'public/sitemap.xml'))
for (const path of ['/', '/orientation-2026', '/team', '/karma-war']) pass(sitemap.includes(`<loc>https://mulearnscet.in${path}</loc>`), `Sitemap missing ${path}`)
const headers = await content(resolve(root, 'public/_headers'))
for (const directive of ['Strict-Transport-Security', 'Content-Security-Policy', 'X-Frame-Options', 'X-Content-Type-Options', 'frame-ancestors', 'max-age=31536000, immutable']) pass(headers.includes(directive), `_headers missing ${directive}`)
pass(!headers.includes("script-src 'self' 'unsafe-inline'"), 'CSP allows inline JavaScript')

const sourceFiles = await readdir(resolve(root, 'src/components'))
let source = ''
for (const file of sourceFiles.filter((file) => file.endsWith('.jsx'))) source += await content(resolve(root, 'src/components', file))
source += await content(resolve(root, 'src/components/KarmaWar/KarmaWarPage.jsx'))
pass(!source.includes('<iframe'), 'Third-party iframe reintroduced')
pass(!source.includes('this dont work'), 'Fake newsletter field reintroduced')
pass(!source.includes('SDDFDVD'), 'Indexable decorative gibberish reintroduced')

const appSource = await content(resolve(root, 'src/App.jsx'))
const heroSource = await content(resolve(root, 'src/components/HeroSection.jsx'))
const gallerySource = await content(resolve(root, 'src/components/GallerySection.jsx'))
pass(!appSource.includes('LoadingScreen'), 'A second React loading screen was reintroduced')
pass(!appSource.includes('__finishMulearnLoader'), 'App can reveal the loader before the lazy Home route is ready')
pass(heroSource.includes('__finishMulearnLoader'), 'The mounted Hero does not signal loader readiness')
pass(heroSource.includes('document.fonts?.ready'), 'Loader can reveal the page before route fonts are ready')
pass(heroSource.includes('afterTwoPaints'), 'Loader can reveal before the Hero has painted')
pass(heroSource.includes('introActive ? false'), 'Hero entrance animations can still be mid-flight during the first-loader reveal')
pass((await content(resolve(root, 'src/components/SeoManager.jsx'))).includes('useLayoutEffect'), 'SPA font selection is not updated before paint')
pass(gallerySource.includes('requestAnimationFrame(update)'), 'Statistics count-up animation missing')
pass(gallerySource.includes('className="sr-only">{end}'), 'Statistics final values are not exposed accessibly')
pass(gallerySource.includes('data-counter-visual'), 'Statistics visual value marker is missing')
pass(!gallerySource.includes('initial={{ scale: 0 }}'), 'Statistics can still be hidden at scale zero')
const statsMarkup = gallerySource.slice(gallerySource.indexOf('aria-label="µLearn Sahrdaya community statistics"') - 180, gallerySource.indexOf('{/* Modal */}'))
pass(!statsMarkup.includes('initial={{ opacity: 0'), 'Statistics container can still be hidden before observer activation')
pass(!statsMarkup.includes('initial={{ scale: 0'), 'Statistics values can still be hidden before observer activation')
const indexSource = await content(resolve(root, 'index.html'))
const loaderSource = await content(resolve(root, 'public/loader-preflight-v9.js'))
pass(loaderSource.includes('mulearn-loading-screen-v2'), 'Loader preflight missing session check')
pass(loaderSource.includes('mulearn-intro-revealing'), 'Loader does not coordinate the root crossfade')
pass(loaderSource.includes('is-content-exiting'), 'Loader content is not cleared before the page crossfade')
pass(loaderSource.includes('event.target !== loader'), 'A child transition can still terminate the loader fade early')
pass(loaderSource.slice(loaderSource.indexOf('const finishReveal'), loaderSource.indexOf('const beginReveal')).includes('unlockRoot()'), 'The page can become interactive before the fade completes')
pass(loaderSource.lastIndexOf("rootClass.add('loader-seen')") > loaderSource.indexOf('finishReveal'), 'Loader-seen can still cut off the fade')
pass(indexSource.includes('mulearn-intro-active #root'), 'Root crossfade styles are missing')
pass(indexSource.includes('id="initial-loader"'), 'Immediate homepage loading shell missing')
pass(indexSource.includes('class="static-loader__logo"'), 'Loader does not use the canonical SVG logo')
pass((indexSource.match(/<path d=/g) || []).length >= 6, 'Loader SVG logo paths are incomplete')
const logoComponent = await content(resolve(root, 'src/components/MuLearnLogo.jsx'))
const loaderPaths = [...indexSource.matchAll(/<path d="([^"]+)" fill="currentColor"\/>/g)].map((match) => match[1])
const componentPaths = [...logoComponent.matchAll(/d="([^"]+)"[\s\S]*?fill="currentColor"/g)].map((match) => match[1])
pass(JSON.stringify(loaderPaths) === JSON.stringify(componentPaths), 'Loader SVG differs from the canonical µLearn logo')
pass(!indexSource.includes('static-loader__wordmark'), 'Loader reverted to a typed wordmark')
pass(indexSource.includes('Inter:wght@300;400;500;600;700;800;900'), 'Homepage is missing the Inter 300 font weight')
pass(!indexSource.includes('display=optional'), 'Optional font loading can leave fallback typography active')
pass((await content(resolve(root, 'src/seoConfig.js'))).includes('seo-fallback'), 'SEO fallback is not protected from first-paint flash')

for (const file of ['site.webmanifest', 'favicon.ico', 'assets/favicon-64.png', 'assets/apple-touch-icon.png', 'assets/og/home.webp', 'assets/og/orientation-2026.webp', 'assets/og/team.webp', 'assets/og/karma-war.webp', 'assets/karmawar/previews/karma-album-v4.webp', 'assets/karmawar/previews/karma-highlights-v3.webp', 'assets/karmawar/previews/karma-winners-v3.webp', 'loader-preflight-v9.js']) pass(await exists(resolve(root, 'public', file)), `Missing public asset: ${file}`)
JSON.parse(await content(resolve(root, 'public/site.webmanifest')))

if (failures.length) {
  console.error(`Build validation failed (${failures.length}):`)
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exit(1)
}
console.log(`Build validation passed: ${routes.length} routes, ${archive.photos.length} archive photos, ${teamData.length} team entries.`)
