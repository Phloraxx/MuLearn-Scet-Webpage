import { FaInstagram } from 'react-icons/fa6'

export default function InstagramPreviewCard({ href, image, title, className = '' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block overflow-hidden rounded-xl border border-gray-800 bg-black shadow-lg ${className}`}
      aria-label={`${title} on Instagram (opens in a new tab)`}
    >
      <img
        src={image}
        alt=""
        width="900"
        height="1100"
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025] group-hover:brightness-75"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-transparent" aria-hidden="true" />
      <span className="absolute left-5 right-5 bottom-5 flex items-end justify-between gap-4 text-white">
        <span>
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.22em] text-gray-300">Instagram recap</span>
          <strong className="block text-lg leading-tight">{title}</strong>
        </span>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/50 bg-black/40 text-lg backdrop-blur-sm transition group-hover:bg-white group-hover:text-black" aria-hidden="true"><FaInstagram /></span>
      </span>
    </a>
  )
}
