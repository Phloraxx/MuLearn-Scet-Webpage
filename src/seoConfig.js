const SITE_URL = 'https://mulearnscet.in'

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'µLearn Sahrdaya',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/assets/favicon-64.png`,
  sameAs: [
    'https://www.instagram.com/mulearn.scet/',
    'https://www.linkedin.com/company/mulearn/',
    'https://github.com/gtech-mulearn'
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Sahrdaya College of Engineering & Technology, Kodakara',
    addressLocality: 'Thrissur',
    addressRegion: 'Kerala',
    addressCountry: 'IN'
  }
}

export const SEO_ROUTES = {
  '/': {
    title: 'µLearn Sahrdaya | Peer Learning Community at Sahrdaya CET',
    description: 'Join µLearn Sahrdaya, the peer-learning community at Sahrdaya College of Engineering & Technology in Thrissur, Kerala.',
    canonical: `${SITE_URL}/`,
    image: `${SITE_URL}/assets/og/home.webp`,
    themeColor: '#283618',
    fontHref: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Share+Tech+Mono&display=optional',
    jsonLd: organization,
    staticMarkup: `<div class="static-loader" role="status" aria-label="Loading µLearn Sahrdaya"><div class="static-loader__inner"><div class="static-loader__wordmark">µlearn</div><div class="static-loader__campus">Sahrdaya</div><div class="static-loader__track"><div class="static-loader__bar"></div></div><div class="static-loader__label">Loading...</div></div></div><main class="seo-fallback static-shell static-shell--home"><p>µLearn Sahrdaya</p><h1>Peer learning, projects and community at Sahrdaya CET</h1><p>Student-led workshops, events and collaborative learning in Thrissur, Kerala.</p></main>`
  },
  '/orientation-2026': {
    title: 'The Meme Archive | µLearn Orientation 2026',
    description: 'Explore 216 funny meme recreations from µLearn Sahrdaya Orientation 2026, organized by meme and animal team.',
    canonical: `${SITE_URL}/orientation-2026`,
    image: `${SITE_URL}/assets/og/orientation-2026.webp`,
    themeColor: '#f4efdf',
    fontHref: 'https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700;800;900&family=Inter:wght@600;700;800&display=optional',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'The Meme Archive — µLearn Orientation 2026',
      url: `${SITE_URL}/orientation-2026`,
      description: 'A curated archive of 216 meme recreations from µLearn Sahrdaya Orientation 2026.',
      isPartOf: organization
    },
    staticMarkup: `<main class="seo-fallback static-shell static-shell--archive"><p>µLearn Orientation · 2026</p><h1>The Meme Archive</h1><p>216 photos · 14 memes · zero context</p><a href="#archive-wall">Enter the evidence</a></main>`
  },
  '/team': {
    title: 'Our Team | µLearn Sahrdaya',
    description: 'Meet the campus leads, executive team and interest-group leads who run µLearn Sahrdaya at Sahrdaya CET.',
    canonical: `${SITE_URL}/team`,
    image: `${SITE_URL}/assets/og/team.webp`,
    themeColor: '#283618',
    fontHref: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=optional',
    preloadImage: { href: '/assets/team/optimized/YadhuKrishna-320.webp', srcset: '/assets/team/optimized/YadhuKrishna-320.webp 320w, /assets/team/optimized/YadhuKrishna-640.webp 640w', sizes: '(max-width: 640px) 44vw, 280px' },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'Our Team — µLearn Sahrdaya',
      url: `${SITE_URL}/team`,
      about: organization
    },
    staticMarkup: `<main class="seo-fallback static-shell"><p>µLearn Sahrdaya</p><h1>Our Team</h1><p>Meet the students leading the campus community and its interest groups.</p><a href="/">Back home</a></main>`
  },
  '/karma-war': {
    title: 'Karma War 2026 Event Recap | µLearn Sahrdaya',
    description: 'See the winners and highlights from Karma War 2026, µLearn Sahrdaya’s completed campus challenge.',
    canonical: `${SITE_URL}/karma-war`,
    image: `${SITE_URL}/assets/og/karma-war.webp`,
    themeColor: '#7c7ce0',
    fontHref: 'https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Inter:wght@400;600;700;800&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Special+Elite&display=optional',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'Karma War 2026',
      eventStatus: 'https://schema.org/EventCompleted',
      location: organization.address,
      organizer: organization,
      url: `${SITE_URL}/karma-war`
    },
    staticMarkup: `<main class="seo-fallback static-shell static-shell--karma"><p>µLearn Sahrdaya</p><h1>Karma War 2026</h1><p>The event is complete. View the winners and event recap.</p><a href="/">Back home</a></main>`
  },
  '*': {
    title: 'Page Not Found | µLearn Sahrdaya',
    description: 'The page you were looking for could not be found. Return to µLearn Sahrdaya or explore the Meme Archive.',
    canonical: null,
    image: `${SITE_URL}/assets/og/home.webp`,
    themeColor: '#fefae0',
    fontHref: 'https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800;900&display=optional',
    robots: 'noindex, follow',
    jsonLd: null,
    staticMarkup: `<main class="seo-fallback static-shell static-shell--404"><p>µLearn Sahrdaya</p><h1>404</h1><h2>This page wandered off.</h2><p>The link may be outdated, mistyped or lost somewhere between two sections.</p><nav><a href="/">Go home</a><a href="/orientation-2026">Open the Meme Archive</a><a href="/team">Meet the team</a></nav></main>`
  }
}

export const getSeoForPath = (pathname) => SEO_ROUTES[pathname] || SEO_ROUTES['*']
export { SITE_URL }
