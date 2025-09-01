import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const TestTeamPage = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })

  // Test with Abel's data
  const testMember = {
    name: "Abel MD",
    role: "Media Lead",
    image: "/assets/team/Abel md.png",
  }

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-orange-50 to-purple-50 min-h-screen flex items-center justify-center" id="test-team">
          {/* Image popping out */}
            <div className="p-8 w-64 h-64 absolute">
                <div className="bg-white rounded-2xl shadow-2xl bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-3xl shadow-2xl w-3/4 h-3/4 z-10 absolute">
                </div>
                <div className="text-center z-15 absolute">
                    <h3 className="text-8xl font-bold text-gray-800 overflow-visible whitespace-nowrap">
                    {testMember.name}
                    </h3>
                </div>
                <img
                            src={testMember.image}
                            alt={testMember.name}
                            className="object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-500 overflow-y-visible relative z-20 bottom-14"
                            onError={(e) => {
                            e.target.src = '/assets/team/placeholder.jpg';
                            }}
                        />
            </div>
          {/* Content overlay */}
          <div className="text-center mt-8">
            <h3 className="text-4xl font-bold text-gray-800 mb-2">
              {testMember.name}
            </h3>
            <p className="text-xl text-gray-600 font-semibold">
              {testMember.role}
            </p>
          </div>
    </section>
  )
}

export default TestTeamPage
