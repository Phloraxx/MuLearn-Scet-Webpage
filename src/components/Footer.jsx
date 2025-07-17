import { motion } from 'framer-motion'
import { FaHeart, FaCode, FaDiscord, FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    "Quick Links": [
      { label: "About Us", href: "#about" },
      { label: "Projects", href: "#projects" },
      { label: "Gallery", href: "#gallery" },
      { label: "Contact", href: "#contact" }
    ],
    "Community": [
      { label: "Join Discord", href: "#" },
      { label: "Workshops", href: "#" },
      { label: "Events", href: "#" },
      { label: "Mentorship", href: "#" }
    ],
    "Resources": [
      { label: "Learning Materials", href: "#" },
      { label: "Project Ideas", href: "#" },
      { label: "Tech Talks", href: "#" },
      { label: "Career Guidance", href: "#" }
    ]
  }

  const socialLinks = [
    { icon: FaDiscord, href: "#", label: "Discord", color: "hover:text-blue-600" },
    { icon: FaGithub, href: "#", label: "GitHub", color: "hover:text-gray-400" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-500" },
    { icon: FaInstagram, href: "#", label: "Instagram", color: "hover:text-pink-500" }
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
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold mb-4">
                µLearn <span className="text-tigers-eye">Sahrdaya</span>
              </h3>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Empowering students through peer learning and innovation. Join our community 
                of passionate learners and build the future together.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`bg-white bg-opacity-10 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 ${social.color}`}
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
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
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
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-tigers-eye"
              />
              <motion.button
                className="bg-tigers-eye hover:bg-tigers-eye-600 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-gray-300"
            >
              <span>© {currentYear} µLearn Sahrdaya. Made with</span>
              <FaHeart className="text-red-500 animate-pulse" />
              <span>by the community</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-gray-300"
            >
              <FaCode className="text-tigers-eye" />
              <span>Built with React & Tailwind CSS</span>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
