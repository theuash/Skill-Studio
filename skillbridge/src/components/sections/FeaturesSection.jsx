import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Map, BarChart3, Building2, Brain, Target, Trophy } from 'lucide-react'

const features = [
  {
    icon: BarChart3,
    colorVar: '--secondary',
    title: 'Skill Gap Analysis',
    description: 'Instantly identify what skills you\'re missing and what to prioritize. Stop guessing — start learning with purpose and direction.',
    highlights: ['Real-time assessment', 'Priority ranking', 'Progress tracking'],
  },
  {
    icon: Building2,
    colorVar: '--primary',
    title: 'Company-Specific Learning',
    description: 'Learn exactly what Google, Meta, Netflix, or your dream company actually uses. Stack-specific projects and real interview preparation.',
    highlights: ['500+ top companies', 'Tech stack mapping', 'Interview prep'],
  },
  {
    icon: Brain,
    colorVar: '--accent',
    title: 'AI Code Review',
    description: 'Submit your project repo and receive detailed AI feedback on code quality, architecture patterns, and industry best practices.',
    highlights: ['Automated analysis', 'Detailed scoring', 'Actionable feedback'],
  },
  {
    icon: Target,
    colorVar: '--secondary',
    title: 'Project-Based Learning',
    description: 'Build real-world projects aligned with company expectations. Every roadmap ends with a production-grade project that proves your skills.',
    highlights: ['Real projects', 'GitHub integration', 'Portfolio ready'],
  },
  {
    icon: Trophy,
    colorVar: '--primary',
    title: 'Track Your Progress',
    description: 'Visual progress tracking across all your roadmaps. Earn skill badges, track completion rates, and see your growth over time.',
    highlights: ['Visual dashboard', 'Skill badges', 'Completion history'],
  },
]

function FeatureCard({ feature, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { icon: Icon, colorVar, title, description, highlights } = feature
  const color = `var(${colorVar})`

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group cursor-default transition-all duration-300"
      style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)' }}
    >
      {/* Icon Container */}
      <motion.div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all"
        style={{ 
          background: `color-mix(in srgb, ${color} 12%, transparent)`,
          border: `1.5px solid color-mix(in srgb, ${color} 35%, transparent)`,
        }}
        whileHover={{ scale: 1.15, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <motion.div
          initial={{ scale: 1 }}
          animate={inView ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.8, delay: index * 0.12 + 0.3 }}
        >
          <Icon size={24} color={color} strokeWidth={2} />
        </motion.div>
      </motion.div>

      <motion.h3 
        className="font-heading font-bold text-lg mb-3" 
        style={{ color: 'var(--text)' }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.12 + 0.1 }}
      >
        {title}
      </motion.h3>
      
      <motion.p 
        className="text-sm leading-relaxed mb-6 font-normal" 
        style={{ color: 'var(--text-muted)' }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.12 + 0.15 }}
      >
        {description}
      </motion.p>

      <ul className="space-y-2.5">
        {highlights.map((h, i) => (
          <motion.li 
            key={h} 
            className="flex items-center gap-3 text-sm"
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: index * 0.12 + 0.2 + i * 0.05 }}
          >
            <motion.div 
              className="w-2 h-2 rounded-full flex-shrink-0" 
              style={{ background: color }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, delay: index * 0.12 + 0.3, repeat: Infinity }}
            />
            <span style={{ color: 'var(--text-muted)' }}>{h}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function FeaturesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="features" className="py-32 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: 'color-mix(in srgb, var(--accent) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }}
            animate={inView ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
              What We Offer
            </span>
          </motion.div>
          <h2 className="font-heading font-extrabold text-4xl sm:text-5xl mb-6" style={{ color: 'var(--text)' }}>
            Everything You Need
            <br />
            <span className="gradient-text">to Succeed</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Comprehensive tools designed to help you identify skill gaps, learn systematically, and build a portfolio that impresses top tech companies.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
