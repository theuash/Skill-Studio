import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Search, Building2, Map, Code2, Star } from 'lucide-react'

const steps = [
  { icon: Search, label: 'Pick a Sector', description: 'Choose from 10+ tech domains that match your career goals.', color: '#6C63FF', number: '01' },
  { icon: Building2, label: 'Choose a Company', description: 'Select your dream employer from 500+ top tech companies.', color: '#00D4FF', number: '02' },
  { icon: Map, label: 'Get Your Roadmap', description: 'Receive an AI-generated, personalized learning path instantly.', color: '#4ECDC4', number: '03' },
  { icon: Code2, label: 'Build Real Projects', description: 'Apply your skills in production-grade portfolio projects.', color: '#FF6B6B', number: '04' },
  { icon: Star, label: 'Get AI Evaluated', description: 'Submit your work and receive detailed expert-level feedback.', color: '#FFEAA7', number: '05' },
]

export default function HowItWorksSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="how-it-works" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: 'var(--surface)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)' }}>
            <span className="text-sm font-medium" style={{ color: 'var(--secondary)' }}>
              Simple Process
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-4xl sm:text-5xl mb-6" style={{ color: 'var(--text)' }}>
            Get Started in 
            <br/>
            <span className="gradient-text">5 Simple Steps</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Our streamlined process guides you from choosing your path to building real projects that showcase your skills.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-14 left-0 right-0 h-0.5 mx-28"
            style={{ background: 'linear-gradient(90deg, var(--accent), var(--secondary))' }} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative">
            {steps.map(({ icon: Icon, label, description, color, number }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center text-center"
              >
                {/* Step circle */}
                <div className="relative mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10"
                    style={{
                      background: `${color}18`,
                      border: `2px solid ${color}50`,
                    }}
                  >
                    <Icon size={26} color={color} />
                  </motion.div>
                  {/* Number badge */}
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white z-20"
                    style={{ background: color }}
                  >
                    {i + 1}
                  </div>
                </div>

                <span className="font-heading font-bold text-base mb-2" style={{ color: 'var(--text)' }}>
                  {label}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex justify-center mt-16"
        >
          <a href="/register">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(108,99,255,0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 rounded-2xl font-semibold text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--secondary))' }}
            >
              Get Started Now
            </motion.button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
