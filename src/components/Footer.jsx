import { motion } from 'framer-motion'
import { FaHeart, FaCode, FaDiscord, FaGithub, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import MuLearnLogo from './MuLearnLogo'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    "Quick Links": [
      { label: "About Us", href: "#about" },
      { label: "Gallery", href: "#gallery" },
      { label: "Team", href: "#team" },
      { label: "MuJourney", href: "https://app.mulearn.org/dashboard/mujourney" },
    ],
    "Community": [
      { label: "Join Discord", href: "https://discord.gg/3jbpEubWRA" },
      { label: "Join WhatsApp", href: "https://chat.whatsapp.com/IxnzOfJo4Kt3Zzg8ZBZdCl" },
      { label: "Join MuLearn", href: "https://app.mulearn.org" },
    ]
  }

  const socialLinks = [
    { icon: FaDiscord, href: "https://discord.gg/3jbpEubWRA", label: "Discord", color: "hover:text-blue-600" },
    { icon: FaGithub, href: "https://github.com/gtech-mulearn", label: "GitHub", color: "hover:text-gray-400" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/company/mulearn/", label: "LinkedIn", color: "hover:text-blue-500" },
    { icon: FaInstagram, href: "https://www.instagram.com/mulearn.scet/", label: "Instagram", color: "hover:text-pink-500" }
  ]

  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer className="bg-gradient-to-br from-pakistan-green to-dark-moss-green text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-10 py-16 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-full items-center gap-3 mb-4 flex">
                <MuLearnLogo 
                  size="default" 
                  className="text-white"
                />
                <span className="text-2xl font-bold text-tigers-eye">Sahrdaya</span>
              </div>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Empowering students through peer learning and innovation. Join our community 
                of passionate learners and build the future together.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.icon === FaDiscord ? "https://discord.gg/3jbpEubWRA" : social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-white/10 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 ${social.color}`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    title={social.label}
                  >
                    <social.icon className="text-xl" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-semibold mb-4 text-tigers-eye">{category}</h4>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    {link.href.startsWith('#') ? (
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-semibold mb-4 text-tigers-eye">Contact</h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="mailto:mulearn@sahrdaya.ac.in" className="hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <FaEnvelope className="text-tigers-eye shrink-0" />
                  <span>mulearn@sahrdaya.ac.in</span>
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FaPhone className="text-tigers-eye shrink-0 mt-1" />
                <span>
                  <a href="tel:+919746222670" className="hover:text-white transition-colors duration-300">+91 97462 22670</a>
                  <div className="text-sm text-gray-400">Anil Antony</div>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-tigers-eye shrink-0 mt-1" />
                <a href="https://maps.app.goo.gl/zeFMTMfB3fPeBNHq9" target="_blank" rel="noopener noreferrer" className="leading-relaxed whitespace-nowrap hover:text-white transition-colors duration-300">
                  Sahrdaya College of<br />Engineering & Technology,<br />Kodakara, Thrissur, Kerala
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-white/20"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-2xl font-bold mb-2">Stay Updated</h4>
              <p className="text-gray-300">
                Get the latest updates about workshops, events, and learning opportunities.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row w-full gap-3">
              <input
                type="email"
                placeholder="this dont work"
                className="flex px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-tigers-eye"
              />
              <motion.button
                className="bg-tigers-eye hover:bg-tigers-eye-600 px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://discord.gg/3jbpEubWRA', '_blank')}
                aria-label="Join our Discord (opens in new tab)"
              >
                <FaDiscord className="text-lg" />
                Join our Discord
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-10 py-6">
          <div className="flex items-center flex-col md:flex-row justify-between gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-gray-300"
            >
              <span>© {currentYear} µLearn Sahrdaya.</span><span className="flex items-center gap-1"> Made with 
              <FaHeart className="text-red-500 custom-pulse" />
              by <a href="https://linkedin.com/in/souravpbijoy" target="_blank" rel="noopener noreferrer">Sourav P Bijoy</a></span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-gray-300"
            >
              <FaCode className="text-tigers-eye custom-ping" />
              <span>Mulearn Scet Tech Team</span>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
