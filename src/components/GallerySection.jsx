import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FaExpand, FaTimes } from 'react-icons/fa'

const GallerySection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })
  const [selectedImage, setSelectedImage] = useState(null)

  // Gallery images from the assets
  const galleryImages = [
    {
      src: "/assets/fwdaiworkshop (2)/1742023268416.jpeg",
      alt: "Workshop Session 1",
      title: "AI Workshop - Introduction to Machine Learning"
    },
    {
      src: "/assets/fwdaiworkshop (2)/1742023268425.jpeg",
      alt: "Workshop Session 2",
      title: "Hands-on Coding Session"
    },
    {
      src: "/assets/fwdaiworkshop (2)/1742023268432.jpeg",
      alt: "Workshop Session 3",
      title: "Team Collaboration"
    },
    {
      src: "/assets/fwdaiworkshop (2)/1742023268442.jpeg",
      alt: "Workshop Session 4",
      title: "Project Presentation"
    },
    {
      src: "/assets/fwdaiworkshop (2)/1742023268457.jpeg",
      alt: "Workshop Session 6",
      title: "Technical Deep Dive"
    },
    {
      src: "/assets/fwdaiworkshop (2)/1742023268465.jpeg",
      alt: "Workshop Session 7",
      title: "Problem Solving Session"
    },
    {
      src: "/assets/fwdaiworkshop (2)/1742023268486.jpeg",
      alt: "Workshop Session 10",
      title: "Award Ceremony"
    },
    {
      src: "/assets/fwdaiworkshop (2)/1742023268493.jpeg",
      alt: "Workshop Session 11",
      title: "Group Photo"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <section ref={ref} className="py-20 bg-cornsilk-900" id="gallery">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-pakistan-green mb-6">
            Event Gallery
          </h2>
          <p className="text-xl text-pakistan-green-600 max-w-3xl mx-auto">
            Explore moments from our workshops, seminars, and community events that showcase the vibrant learning culture at µLearn Sahrdaya.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg bg-white"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 text-white w-full">
                  <h3 className="font-semibold text-sm mb-2">{image.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-80">Click to expand</span>
                    <FaExpand className="text-sm" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: "50+", label: "Events Organized" },
            { number: "1000+", label: "Students Reached" },
            { number: "25+", label: "Workshops Conducted" },
            { number: "15+", label: "Industry Experts" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <motion.div
                className="text-4xl md:text-5xl font-bold text-tigers-eye mb-2"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              >
                {stat.number}
              </motion.div>
              <div className="text-pakistan-green-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-12 right-0 text-white hover:text-tigers-eye text-2xl transition-colors duration-200"
              onClick={() => setSelectedImage(null)}
            >
              <FaTimes />
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <h3 className="text-white text-xl font-semibold">{selectedImage.title}</h3>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

export default GallerySection
