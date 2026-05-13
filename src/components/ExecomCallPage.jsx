import { motion } from 'framer-motion'
import Navigation from './Navigation'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const ExecomCallPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navigation />
      
      {/* Custom CSS for iframe scrollbars */}
      <style jsx>{`
        @media (max-width: 768px) {
          .no-scroll-iframe {
            overflow: auto;
            -webkit-overflow-scrolling: touch;
          }
          .no-scroll-iframe iframe {
            overflow: auto;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* Internet Explorer 10+ */
          }
          .no-scroll-iframe iframe::-webkit-scrollbar {
            display: none; /* WebKit */
          }
        }
      `}</style>
      
      <div className="container mx-auto px-1 py-8 pt-20">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🚀 Join the μLearn Force! 🚀
          </h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 mb-6">
              We're looking for passionate minds to lead our missions in:
            </p>
            <div className="flex md:flex-auto justify-center items-center gap-4 text-lg font-medium text-purple-600">
              <div className="flex items-center gap-2">
                ✨ Web Development
              </div>
              <div className="flex items-center gap-2">
                ✨ Cybersecurity
              </div>
              <div className="flex items-center gap-2">
                ✨ Comic Creation
              </div>
            </div>
            <p className="text-lg text-gray-700 mt-6 font-semibold">
              Apply Now by filling out the Google Form below
            </p>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.2 }}
          className="w-full"
        >
          <div className="w-full">
            <div className="bg-white drop-shadow-2xl no-scroll-iframe">
              <iframe 
                src="https://docs.google.com/forms/d/e/1FAIpQLSc6kyeUcirqierR9OnZo54vdIQ-n9eGsJNRQ4xf7NX_XVonmw/viewform?embedded=true" 
                width="100%=" 
                height="2145" 
                frameBorder="0" 
                marginHeight="0" 
                marginWidth="0"
                className="w-full"
                title="μLearn Execom Application Form"
              >
                Loading…
              </iframe>
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8 text-gray-600"
        >
          <p className="text-sm">
            Having trouble with the form? Contact us directly at{' '}
            <a 
              href="mailto:mulearn@sahrdaya.ac.in" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              mulearn@sahrdaya.ac.in
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default ExecomCallPage