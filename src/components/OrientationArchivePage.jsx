import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FaArrowLeft, FaArrowRight, FaDownload, FaInstagram, FaLink, FaXmark } from 'react-icons/fa6'
import './OrientationArchivePage.css'

const MANIFEST_URL = '/assets/orientation/archive/manifest.json'
const HERO_IDS = ['003', '015', '057', '080', '109', '139', '175', '216']
const BATCH_SIZE = 24

const initialParams = new URLSearchParams(window.location.search)
const initialFilterType = initialParams.has('team') ? 'team' : initialParams.has('meme') ? 'meme' : 'all'
const initialFilterValue = initialParams.get('team') || initialParams.get('meme') || 'all'
const initialMode = initialParams.get('mode') === 'shuffle' ? 'shuffle' : 'wall'
const initialPhoto = initialParams.get('photo')

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const archiveAsset = (path) => path
const referenceAsset = (file) => `/assets/orientation/archive/references/${file}`

function seededOrder(items, seed) {
  const score = (id) => {
    let value = seed * 2654435761
    for (const char of id) value = Math.imul(value ^ char.charCodeAt(0), 16777619)
    return value >>> 0
  }
  return [...items].sort((a, b) => score(a.id) - score(b.id))
}

function updateUrl({ filterType, filterValue, mode, photo }) {
  const params = new URLSearchParams()
  if (filterType === 'team' && filterValue !== 'all') params.set('team', filterValue)
  if (filterType === 'meme' && filterValue !== 'all') params.set('meme', filterValue)
  if (mode === 'shuffle') params.set('mode', 'shuffle')
  if (photo) params.set('photo', photo)
  const query = params.toString()
  window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}`)
}

function ArchiveCard({ photo, index, mode, onOpen, onSeen, priority = false }) {
  const cardRef = useRef(null)
  const [showReference, setShowReference] = useState(false)
  const tilt = ((Number(photo.id) * 7) % 9) - 4
  const lift = ((Number(photo.id) * 13) % 16) - 8

  useEffect(() => {
    const node = cardRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onSeen(photo.id)
        observer.disconnect()
      }
    }, { threshold: 0.35 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [photo.id, onSeen])

  return (
    <motion.article
      ref={cardRef}
      className={`archive-card archive-card--${mode} ${showReference ? 'is-reference' : ''}`}
      data-photo-id={photo.id}
      style={{ '--tilt': `${tilt}deg`, '--lift': `${lift}px`, '--ratio': photo.ratio }}
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.5, delay: Math.min(index, 12) * 0.018, ease: [0.22, 1, 0.36, 1] }}
    >
      <button className="archive-card__open" type="button" onClick={() => onOpen(photo.id)} aria-label={`Open ${photo.meme} photo from ${photo.team} team`}>
        <img
          className="archive-card__image"
          src={archiveAsset(photo.thumb)}
          alt={`${photo.meme} recreation by ${photo.team} team`}
          width={photo.width}
          height={photo.height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
        />
        <span className="archive-card__reference" aria-hidden="true">
          <img src={referenceAsset(photo.reference)} alt="" loading="lazy" />
        </span>
      </button>
      <button
        className="archive-card__dot"
        type="button"
        aria-label={showReference ? 'Show recreation' : 'Show original meme reference'}
        aria-pressed={showReference}
        onClick={(event) => { event.stopPropagation(); setShowReference((value) => !value) }}
      />
    </motion.article>
  )
}

function PhotoDialog({ photo, list, onClose, onMove }) {
  const dialogRef = useRef(null)
  const [reference, setReference] = useState(false)
  const [copied, setCopied] = useState(false)
  const touchStart = useRef(null)
  const index = list.findIndex((item) => item.id === photo?.id)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !photo) return
    setReference(false)
    setCopied(false)
    if (!dialog.open) dialog.showModal()
    document.body.classList.add('archive-dialog-open')
    return () => document.body.classList.remove('archive-dialog-open')
  }, [photo])

  useEffect(() => {
    const keydown = (event) => {
      if (!photo) return
      if (event.key === 'ArrowRight') onMove(1)
      if (event.key === 'ArrowLeft') onMove(-1)
    }
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [photo, onMove])

  if (!photo) return null
  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <dialog ref={dialogRef} className="archive-lightbox" onClose={onClose} onCancel={onClose}>
      <div className="archive-lightbox__chrome">
        <div className="archive-lightbox__meta">
          <span>{String(index + 1).padStart(3, '0')} / {String(list.length).padStart(3, '0')}</span>
          <span>{photo.team} · {photo.meme}</span>
        </div>
        <button type="button" className="archive-lightbox__close" onClick={() => dialogRef.current?.close()} aria-label="Close photo"><FaXmark /></button>
      </div>

      <div
        className={`archive-lightbox__media ${reference ? 'is-reference' : ''}`}
        onTouchStart={(event) => { const touch = event.touches[0]; touchStart.current = { x: touch.clientX, y: touch.clientY } }}
        onTouchEnd={(event) => {
          if (!touchStart.current) return
          const touch = event.changedTouches[0]
          const dx = touch.clientX - touchStart.current.x
          const dy = touch.clientY - touchStart.current.y
          touchStart.current = null
          if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) onMove(dx > 0 ? -1 : 1)
        }}
      >
        <img className="archive-lightbox__reality" src={photo.full} alt={`${photo.meme} recreation by ${photo.team} team`} />
        <span className="archive-lightbox__reference" aria-hidden="true"><img src={referenceAsset(photo.reference)} alt="" /></span>
      </div>

      <button className="archive-lightbox__arrow archive-lightbox__arrow--left" type="button" onClick={() => onMove(-1)} aria-label="Previous photo"><FaArrowLeft /></button>
      <button className="archive-lightbox__arrow archive-lightbox__arrow--right" type="button" onClick={() => onMove(1)} aria-label="Next photo"><FaArrowRight /></button>

      <div className="archive-lightbox__actions">
        <button type="button" className={reference ? '' : 'is-active'} onClick={() => setReference(false)}>Reality</button>
        <button type="button" className={reference ? 'is-active' : ''} onClick={() => setReference(true)}>Reference</button>
        <span className="archive-lightbox__divider" />
        <a href={photo.full} download={`mulearn-orientation-${photo.id}.webp`}><FaDownload /><span>Download</span></a>
        <button type="button" onClick={copyLink}><FaLink /><span>{copied ? 'Copied' : 'Copy link'}</span></button>
      </div>
    </dialog>
  )
}

export default function OrientationArchivePage() {
  const reduceMotion = useReducedMotion()
  const [manifest, setManifest] = useState(null)
  const [error, setError] = useState(null)
  const [filterType, setFilterType] = useState(initialFilterType)
  const [filterValue, setFilterValue] = useState(initialFilterValue)
  const [mode, setMode] = useState(initialMode)
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)
  const [shuffleSeed, setShuffleSeed] = useState(1)
  const [selectedId, setSelectedId] = useState(initialPhoto)
  const [discovered, setDiscovered] = useState(() => new Set())

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'The Meme Archive · µLearn Sahrdaya'
    return () => { document.title = previousTitle }
  }, [])

  useEffect(() => {
    fetch(MANIFEST_URL)
      .then((response) => { if (!response.ok) throw new Error('Archive failed to load'); return response.json() })
      .then(setManifest)
      .catch((reason) => setError(reason.message))
  }, [])

  const photos = manifest?.photos || []
  const options = useMemo(() => {
    if (!manifest) return []
    if (filterType === 'team') return manifest.teams.map((team) => ({ label: team, value: slugify(team), count: photos.filter((photo) => photo.teamSlug === slugify(team)).length }))
    if (filterType === 'meme') return manifest.memes.map((meme) => ({ label: meme, value: slugify(meme), count: photos.filter((photo) => photo.memeSlug === slugify(meme)).length }))
    return []
  }, [filterType, manifest, photos])

  useEffect(() => {
    if (!manifest || filterValue === 'all') return
    if (!options.some((option) => option.value === filterValue)) setFilterValue('all')
  }, [filterValue, manifest, options])

  const filtered = useMemo(() => photos.filter((photo) => {
    if (filterType === 'team' && filterValue !== 'all') return photo.teamSlug === filterValue
    if (filterType === 'meme' && filterValue !== 'all') return photo.memeSlug === filterValue
    return true
  }), [filterType, filterValue, photos])

  const ordered = useMemo(() => mode === 'shuffle' ? seededOrder(filtered, shuffleSeed) : filtered, [filtered, mode, shuffleSeed])
  const shown = ordered.slice(0, visibleCount)
  const selected = photos.find((photo) => photo.id === selectedId) || null
  const viewerList = ordered.some((photo) => photo.id === selectedId) ? ordered : photos
  const heroPhotos = HERO_IDS.map((id) => photos.find((photo) => photo.id === id)).filter(Boolean)

  useEffect(() => {
    updateUrl({ filterType, filterValue, mode, photo: selectedId })
  }, [filterType, filterValue, mode, selectedId])

  useEffect(() => { setVisibleCount(BATCH_SIZE) }, [filterType, filterValue, mode])

  const switchFilter = (type) => {
    setFilterType(type)
    setFilterValue('all')
  }
  const markSeen = (id) => setDiscovered((current) => current.has(id) ? current : new Set([...current, id]))
  const openRandom = () => {
    if (!ordered.length) return
    const next = ordered[Math.floor(Math.random() * ordered.length)]
    setSelectedId(next.id)
  }
  const movePhoto = (delta) => {
    if (!selected || !viewerList.length) return
    const current = viewerList.findIndex((photo) => photo.id === selected.id)
    const next = (current + delta + viewerList.length) % viewerList.length
    setSelectedId(viewerList[next].id)
  }

  useEffect(() => {
    const randomKey = (event) => {
      if ((event.key === 'r' || event.key === 'R') && !selectedId && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) openRandom()
    }
    window.addEventListener('keydown', randomKey)
    return () => window.removeEventListener('keydown', randomKey)
  })

  if (error) return <main className="archive-error"><h1>The archive could not load.</h1><p>{error}</p><Link to="/">Back home</Link></main>

  return (
    <main className="orientation-archive">
      <nav className="archive-nav">
        <Link className="archive-nav__brand" to="/">µlearn <span>Sahrdaya</span></Link>
        <div className="archive-nav__count">{manifest ? `${manifest.count} PHOTOS · ${manifest.teams.length} TEAMS` : 'LOADING ARCHIVE'}</div>
        <Link className="archive-nav__back" to="/"><FaArrowLeft /> Back home</Link>
      </nav>

      <section className="archive-hero" aria-labelledby="archive-title">
        <div className="archive-hero__orb archive-hero__orb--purple" aria-hidden="true" />
        <div className="archive-hero__orb archive-hero__orb--orange" aria-hidden="true" />
        <div className="archive-hero__photos" aria-hidden="true">
          {heroPhotos.map((photo, index) => (
            <motion.img
              key={photo.id}
              className={`archive-hero__photo archive-hero__photo--${index + 1}`}
              src={photo.thumb}
              alt=""
              initial={reduceMotion ? false : { opacity: 0, y: 70, rotate: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </div>
        <motion.div className="archive-hero__copy" initial={reduceMotion ? false : { opacity: 0, y: 35 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.75 }}>
          <p>µLEARN ORIENTATION · 2026</p>
          <h1 id="archive-title"><span>THE</span><span>MEME</span><span>ARCHIVE</span></h1>
          <div className="archive-hero__facts"><span>{manifest ? `${manifest.count} PHOTOS` : 'LOADING PHOTOS'}</span><i /> <span>19 TEAMS</span><i /> <span>ZERO CONTEXT</span></div>
          <a href="#archive-wall" className="archive-hero__enter">Enter the evidence <span>↓</span></a>
        </motion.div>
      </section>

      <section id="archive-wall" className="archive-browser" aria-label="Orientation photo archive">
        <div className="archive-toolbar">
          <div className="archive-toolbar__top">
            <div className="archive-toolbar__filters" role="group" aria-label="Filter photos">
              <button className={filterType === 'all' ? 'is-active' : ''} onClick={() => switchFilter('all')}>All <span>{manifest?.count || 0}</span></button>
              <button className={filterType === 'meme' ? 'is-active' : ''} onClick={() => switchFilter('meme')}>By meme</button>
              <button className={filterType === 'team' ? 'is-active' : ''} onClick={() => switchFilter('team')}>By team</button>
            </div>
            <div className="archive-toolbar__modes" role="group" aria-label="Gallery layout">
              <button className={mode === 'wall' ? 'is-active' : ''} onClick={() => setMode('wall')}>Wall</button>
              <button className={mode === 'shuffle' ? 'is-active' : ''} onClick={() => setMode('shuffle')}>Shuffle</button>
            </div>
          </div>
          <AnimatePresence initial={false}>
            {filterType !== 'all' && (
              <motion.div className="archive-toolbar__options" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <button className={filterValue === 'all' ? 'is-active' : ''} onClick={() => setFilterValue('all')}>All {filterType === 'team' ? 'teams' : 'memes'} <span>{manifest?.count}</span></button>
                {options.map((option) => <button key={option.value} className={filterValue === option.value ? 'is-active' : ''} onClick={() => setFilterValue(option.value)}>{option.label} <span>{option.count}</span></button>)}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="archive-toolbar__status">
            <span>Showing {Math.min(visibleCount, ordered.length)} of {ordered.length}</span>
            <span>{discovered.size} discovered</span>
            {mode === 'shuffle' && <button onClick={() => setShuffleSeed((seed) => seed + 1)}>Reshuffle ↻</button>}
          </div>
        </div>

        {!manifest ? (
          <div className="archive-loading"><span /><p>Developing the evidence…</p></div>
        ) : (
          <>
            <div className={`archive-grid archive-grid--${mode}`}>
              {shown.map((photo, index) => <ArchiveCard key={`${mode}-${shuffleSeed}-${photo.id}`} photo={photo} index={index} mode={mode} onOpen={setSelectedId} onSeen={markSeen} priority={index < 4} />)}
            </div>
            <div className="archive-after-grid">
              {visibleCount < ordered.length && <button className="archive-load-more" onClick={() => setVisibleCount((count) => count + BATCH_SIZE)}>Load more chaos <span>+{Math.min(BATCH_SIZE, ordered.length - visibleCount)}</span></button>}
              <button className="archive-random" onClick={openRandom}><span>R</span> Show me something funny</button>
            </div>
          </>
        )}
      </section>

      <footer className="archive-footer">
        <div><p>THE OFFICIAL RECAP</p><h2>See how the chaos happened.</h2></div>
        <a href="https://www.instagram.com/reel/DbYbImLQ9Kz/" target="_blank" rel="noreferrer"><FaInstagram /> Watch the reel ↗</a>
        <Link to="/">Back to µLearn Sahrdaya ↗</Link>
        <a className="archive-footer__removal" href="mailto:mulearn@sahrdaya.ac.in?subject=Orientation%202026%20photo%20removal%20request">Need a photo removed?</a>
      </footer>

      <PhotoDialog photo={selected} list={viewerList} onClose={() => setSelectedId(null)} onMove={movePhoto} />
    </main>
  )
}
