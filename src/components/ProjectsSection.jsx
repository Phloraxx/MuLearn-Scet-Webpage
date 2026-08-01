import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router'
import InstagramPreviewCard from './InstagramPreviewCard'

const ProjectsSection = () => {
  const videoRef = useRef(null)
  const [isMuted, setIsMuted] = useState(true)

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative py-24 bg-gradient-to-b from-gray-900 via-gray-950 to-black overflow-hidden" id="projects">
      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}></div>

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)' }}></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block">
            <p className="text-tigers-eye font-mono text-xs tracking-[0.3em] uppercase mb-4">// event recap</p>
            <h2 className="text-6xl lg:text-7xl font-black tracking-tighter glitch-text text-white" data-text="KARMA WAR 2026">
              KARMA WAR 2026
            </h2>
            <div className="h-px bg-gradient-to-r from-transparent via-tigers-eye to-transparent w-48 mx-auto mt-6"></div>
          </div>
          <p className="text-gray-300 font-mono text-sm max-w-2xl mx-auto mt-6 leading-relaxed">
            The battle is over. The teams fought, one emerged victorious. Here's how it went down.
          </p>
        </div>

        {/* Hero Video */}
        <div className="max-w-5xl mx-auto mb-24">
          <div className="relative group">
            {/* Glow behind */}
            <div className="absolute -inset-4 bg-gradient-to-r from-tigers-eye/20 via-purple-500/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            {/* TV-style border */}
            <div className="relative border border-gray-800 rounded-xl overflow-hidden shadow-2xl bg-black">
              <div className="absolute top-2 right-4 z-20 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">Live</span>
              </div>
              <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                <div className="absolute inset-0 pointer-events-none z-10" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)' }}></div>
                <video
                  ref={videoRef}
                  src="/assets/karmawar/kochuvid.mp4"
                  preload="none"
                  poster="/assets/karmawar/kochuvid_Thumbnail.jpg"
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  onClick={toggleMute}
                />
                <button
                  onClick={toggleMute}
                  className="absolute bottom-4 left-4 z-20 bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all"
                  aria-label={isMuted ? 'Sound off — turn sound on' : 'Sound on — turn sound off'}
                  aria-pressed={!isMuted}
                >
                  {isMuted ? '[ SOUND OFF ]' : '[ SOUND ON ]'}
                </button>
              </div>
            </div>
              <p className="text-gray-400 font-mono text-xs tracking-wider mt-4 text-center">{'>'} KARMA WAR — HIGHLIGHT REEL // 00:00</p>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start max-w-5xl mx-auto mb-16">
          {/* Photo Album */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-tigers-eye"></span>
              <h3 className="text-white font-mono text-sm tracking-[0.2em] uppercase">Event Gallery</h3>
            </div>
            <InstagramPreviewCard
              href="https://www.instagram.com/p/DTpIrNdkd3I/"
              image="/assets/karmawar/previews/karma-album-v4.webp"
              title="Photo album"
              width={1440}
              height={1919}
              className="aspect-[3/4]"
            />
          </div>

          {/* More Highlights */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-tigers-eye"></span>
              <h3 className="text-white font-mono text-sm tracking-[0.2em] uppercase">More Highlights</h3>
            </div>
            <InstagramPreviewCard
              href="https://www.instagram.com/p/DTpE75dEXK6/"
              image="/assets/karmawar/previews/karma-highlights-v3.webp"
              title="More highlights"
              width={640}
              height={1136}
              className="aspect-[4/5]"
            />
          </div>
        </div>

        {/* Footer line */}
        <div className="text-center pt-12 border-t border-gray-800 max-w-2xl mx-auto space-y-4">
          <p className="text-gray-400 font-mono text-xs tracking-wide">
            // end of transmission — KARMA WAR 2026
          </p>
          <Link
            to="/karma-war"
            className="inline-block text-tigers-eye hover:text-tigers-eye-400 font-mono text-sm tracking-wider transition-colors underline underline-offset-4 decoration-tigers-eye/30"
          >
            Full Event Recap →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
