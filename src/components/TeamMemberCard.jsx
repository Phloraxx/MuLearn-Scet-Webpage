import { motion } from 'framer-motion'
import { FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa'

const TeamMemberCard = ({ member, index = 0 }) => {
  const { name, role, image, social } = member
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()
  const hasImage = image && image.trim() !== ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
      className="group"
    >
      {/* Photo pops out above the white frame; border visible on left/right/bottom */}
      <div className="relative pt-14 sm:pt-16">
        <div className="relative bg-gradient-to-br from-tigers-eye/30 to-pakistan-green/30 border-[6px] border-white shadow-xl rounded-xl aspect-[3/4]">
          {hasImage ? (
            <div className="absolute -top-14 left-0 right-0 bottom-0 overflow-hidden rounded-xl">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-tigers-eye/20 to-pakistan-green/20 flex items-center justify-center rounded-xl">
              <span className="text-5xl font-bold text-pakistan-green/40 select-none">
                {initials}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="text-center mt-4 px-1">
        <h3 className="text-base sm:text-lg font-bold text-pakistan-green leading-tight">
          {name}
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-tigers-eye mt-1.5 inline-block px-3 py-1 rounded-full bg-tigers-eye/10">
          {role}
        </p>
        {(social?.instagram || social?.linkedin || social?.github) && (
          <div className="flex justify-center gap-3 mt-3">
            {social.instagram && social.instagram !== '#' && (
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pakistan-green/60 hover:text-pakistan-green transition-colors"
                aria-label={`${name}'s Instagram`}
              >
                <FaInstagram className="text-lg" />
              </a>
            )}
            {social.linkedin && (
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pakistan-green/60 hover:text-pakistan-green transition-colors"
                aria-label={`${name}'s LinkedIn`}
              >
                <FaLinkedin className="text-lg" />
              </a>
            )}
            {social.github && (
              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pakistan-green/60 hover:text-pakistan-green transition-colors"
                aria-label={`${name}'s GitHub`}
              >
                <FaGithub className="text-lg" />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default TeamMemberCard
