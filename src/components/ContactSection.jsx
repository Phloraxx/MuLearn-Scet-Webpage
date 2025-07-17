import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FaDiscord, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa'

const ContactSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Form submitted:', formData)
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: "Campus Location",
      details: "Sahrdaya College of Engineering & Technology, Kodakara, Kerala",
      gradient: "from-tigers-eye to-earth-yellow"
    },
    {
      icon: FaEnvelope,
      title: "Email Us",
      details: "mulearn@sahrdaya.ac.in",
      gradient: "from-dark-moss-green to-pakistan-green"
    },
    {
      icon: FaDiscord,
      title: "Discord Community",
      details: "Join our active Discord server",
      gradient: "from-earth-yellow to-tigers-eye"
    }
  ]

  const socialLinks = [
    { icon: FaDiscord, label: "Discord", href: "#", color: "hover:text-blue-600" },
    { icon: FaInstagram, label: "Instagram", href: "#", color: "hover:text-pink-600" },
    { icon: FaLinkedin, label: "LinkedIn", href: "#", color: "hover:text-blue-700" },
    { icon: FaGithub, label: "GitHub", href: "#", color: "hover:text-gray-800" }
  ]

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-cornsilk-800 to-cornsilk-700" id="contact">
  <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-pakistan-green mb-6">
            Get In Touch
          </h2>
          <p className="text-xl text-pakistan-green-600 max-w-3xl mx-auto">
            Ready to join our community or have questions? We'd love to hear from you. 
            Let's connect and start your learning journey together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-xl"
          >
            <h3 className="text-2xl font-bold text-pakistan-green mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-pakistan-green-600 font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-cornsilk-400 rounded-lg focus:ring-2 focus:ring-tigers-eye focus:border-transparent transition-all duration-300"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-pakistan-green-600 font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-cornsilk-400 rounded-lg focus:ring-2 focus:ring-tigers-eye focus:border-transparent transition-all duration-300"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-pakistan-green-600 font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-cornsilk-400 rounded-lg focus:ring-2 focus:ring-tigers-eye focus:border-transparent transition-all duration-300"
                  placeholder="What's this about?"
                  required
                />
              </div>
              
              <div>
                <label className="block text-pakistan-green-600 font-medium mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-3 border border-cornsilk-400 rounded-lg focus:ring-2 focus:ring-tigers-eye focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Tell us more about your inquiry..."
                  required
                ></textarea>
              </div>
              
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-tigers-eye to-earth-yellow text-white py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(188, 108, 37, 0.3)" }}
                whileTap={{ scale: 0.98 }}
              >
                <FaPaperPlane />
                Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-tigers-eye"
              >
                <div className="flex items-start gap-4">
                  <div className={`bg-gradient-to-r ${info.gradient} w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg`}>
                    <info.icon className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-pakistan-green mb-2">{info.title}</h4>
                    <p className="text-pakistan-green-600">{info.details}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-gradient-to-r from-dark-moss-green to-pakistan-green rounded-xl p-6 text-white"
            >
              <h4 className="text-xl font-bold mb-4">Follow Us</h4>
              <p className="mb-6 opacity-90">Stay connected with our community across all platforms</p>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`bg-white bg-opacity-20 w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all duration-300 ${social.color}`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    title={social.label}
                  >
                    <social.icon className="text-xl" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="bg-tigers-eye-100 rounded-xl p-6 border border-tigers-eye-200"
            >
              <h4 className="text-xl font-bold text-pakistan-green mb-3">
                Ready to Join?
              </h4>
              <p className="text-pakistan-green-600 mb-4">
                Jump into our Discord community and start learning with us today!
              </p>
              <motion.button
                className="bg-tigers-eye hover:bg-tigers-eye-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaDiscord />
                Join Discord
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
