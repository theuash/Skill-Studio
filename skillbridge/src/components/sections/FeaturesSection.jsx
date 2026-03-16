import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Map, BarChart3, Building2, Brain, Target, Trophy } from 'lucide-react'

const features = [
  {
    icon: Map,
    color: '#6C63FF',
    title: 'AI-Powered Roadmaps',
    description: 'Get personalized learning paths tailored to your target company and job role. Our AI analyzes thousands of job postings to build the perfect roadmap.',
    highlights: ['Company-specific skills', 'Adaptive to your level', 'Weekly updates'],
  },
  {
    icon: BarChart3,
    color: '#00D4FF',
    title: 'Skill Gap Analysis',
    description: 'Instantly identify what skills you\'re missing and what to prioritize. Stop guessing — start learning with purpose and direction.',
    highlights: ['Real-time assessment', 'Priority ranking', 'Progress tracking'],
  },
  {
    icon: Building2,
    color: '#4ECDC4',
    title: 'Company-Specific Learning',
    description: 'Learn exactly what Google, Meta, Netflix, or your dream company actually uses. Stack-specific projects and real interview preparation.',
    highlights: ['500+ top companies', 'Tech stack mapping', 'Interview prep'],
  },
  {
    icon: Brain,
    color: '#FF6B6B',
    title: 'AI Code Review',
    description: 'Submit your project repo and receive detailed AI feedback on code quality, architecture patterns, and industry best practices.',
    highlights: ['Automated analysis', 'Detailed scoring', 'Actionable feedback'],
  },
  {
    icon: Target,
    color: '#FFEAA7',
    title: 'Project-Based Learning',
    description: 'Build real-world projects aligned with company expectations. Every roadmap ends with a production-grade project that proves your skills.',
    highlights: ['Real projects', 'GitHub integration', 'Portfolio ready'],
  },
  {
    icon: Trophy,
    color: '#DFD3FF',
    title: 'Track Your Progress',
    description: 'Visual progress tracking across all your roadmaps. Earn skill badges, track completion rates, and see your growth over time.',
    highlights: ['Visual dashboard', 'Skill badges', 'Completion history'],
  },
]

function FeatureCard({ feature, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { icon: Icon, color, title, description, highlights } = feature

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="gradient-border group cursor-default"
      style={{ background: 'var(--surface)', padding: '1.75rem', borderRadius: '20px' }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
      >
        <Icon size={22} color={color} />
      </div>

      <h3 className="font-heading font-bold text-lg mb-3" style={{ color: 'var(--text)' }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
        {description}
      </p>

      <ul className="space-y-2">
        {highlights.map(h => (
          <li key={h} className="flex items-center gap-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
            <span style={{ color: 'var(--text-muted)' }}>{h}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function FeaturesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
            style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.25)' }}>
            <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
              Everything You Need
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-4xl sm:text-5xl mb-4" style={{ color: 'var(--text)' }}>
            Your Career. <span className="gradient-text">Supercharged.</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            From skill gaps to job offers — SkillBridge gives you every tool to navigate your career journey with confidence.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
