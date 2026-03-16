import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Building2, Layers, Map, Users } from 'lucide-react'

function useCounter(target, duration = 2000, active = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, target, duration])

  return count
}

const stats = [
  { icon: Building2, value: 500, suffix: '+', label: 'Top Companies', description: 'From Google to startups', color: '#44444E' },
  { icon: Layers, value: 50, suffix: '+', label: 'Tech Sectors', description: 'Covering every domain', color: '#6C6E36' },
  { icon: Map, value: 10000, suffix: '+', label: 'Roadmaps Generated', description: 'Personalized paths', color: '#44444E' },
  { icon: Users, value: 25000, suffix: '+', label: 'Developers Guided', description: 'And growing daily', color: '#6C6E36' },
]

function StatCard({ stat, index, active }) {
  const { icon: Icon, value, suffix, label, description, color } = stat
  const count = useCounter(value, 2000 + index * 200, active)

  const display = value >= 1000
    ? count >= 1000 ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K` : count
    : count

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="text-center p-8 rounded-2xl relative overflow-hidden group transition-all duration-300"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at center, ${color}08 0%, transparent 70%)` }}
      />

      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
      >
        <Icon size={22} color={color} strokeWidth={2} />
      </div>

      <div className="font-heading font-extrabold text-4xl sm:text-5xl mb-2" style={{ color }}>
        {display}{suffix}
      </div>
      <div className="font-semibold text-base mb-1" style={{ color: 'var(--text)' }}>{label}</div>
      <div className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>{description}</div>
    </motion.div>
  )
}

export default function StatsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="stats" ref={ref} className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <h2 className="font-heading font-extrabold text-4xl sm:text-5xl mb-4" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Trusted by <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-lg font-normal" style={{ color: 'var(--text-muted)' }}>
            Numbers that speak for themselves.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} active={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
