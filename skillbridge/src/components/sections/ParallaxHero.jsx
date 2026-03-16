import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, Star } from 'lucide-react'
import Button from '../ui/Button'

function FloatingOrb({ size, x, y, color, delay = 0, duration = 8 }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: `radial-gradient(circle, ${color}40 0%, ${color}08 60%, transparent 100%)`,
        filter: 'blur(1px)',
      }}
      animate={{
        y: [0, -30, 0],
        scale: [1, 1.1, 1],
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

function GridLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--accent)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  )
}

function Particle({ x, y, delay }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full"
      style={{ left: x, top: y, background: 'var(--secondary)' }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
      transition={{ duration: 3, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: `${Math.random() * 100}%`,
  y: `${Math.random() * 100}%`,
  delay: Math.random() * 4,
}))

const badges = [
  { icon: Sparkles, label: 'AI-Powered Roadmaps', color: '#6C63FF', x: '8%', y: '25%', delay: 0 },
  { icon: Zap, label: '500+ Companies', color: '#00D4FF', x: '82%', y: '20%', delay: 0.5 },
  { icon: Star, label: '50+ Tech Sectors', color: '#FF6B6B', x: '85%', y: '70%', delay: 1 },
]

export default function ParallaxHero() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -80])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      <GridLines />

      {/* Orbs layer — parallax */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: y1 }}>
        <FloatingOrb size={600} x="60%" y="-15%" color="#6C63FF" delay={0} duration={10} />
        <FloatingOrb size={400} x="-10%" y="30%" color="#00D4FF" delay={2} duration={12} />
        <FloatingOrb size={300} x="70%" y="55%" color="#FF6B6B" delay={1} duration={9} />
        <FloatingOrb size={200} x="20%" y="10%" color="#6C63FF" delay={3} duration={11} />
      </motion.div>

      {/* Particles */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: y2 }}>
        {particles.map(p => <Particle key={p.id} {...p} />)}
      </motion.div>

      {/* Floating badges */}
      <motion.div className="absolute inset-0 pointer-events-none hidden lg:block" style={{ y: y3 }}>
        {badges.map(({ icon: Icon, label, color, x, y, delay }) => (
          <motion.div
            key={label}
            className="absolute glass rounded-2xl px-4 py-3 flex items-center gap-2.5"
            style={{ left: x, top: y }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay }}
            >
              <Icon size={16} color={color} />
            </motion.div>
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center"
        style={{ opacity, scale }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{
            background: 'rgba(108,99,255,0.12)',
            border: '1px solid rgba(108,99,255,0.3)',
          }}
        >
          <Sparkles size={14} color="var(--accent)" />
          <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
            AI-Powered Career Guidance Platform
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full text-white font-semibold"
            style={{ background: 'var(--accent)' }}>NEW</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading font-extrabold leading-[1.08] tracking-tight mb-6"
          style={{
            fontSize: 'clamp(2.8rem, 8vw, 6.5rem)',
            color: 'var(--text)',
          }}
        >
          Bridge the Gap
          <br />
          <span className="gradient-text">Between Learning</span>
          <br />
          and Earning
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          style={{ color: 'var(--text-muted)' }}
        >
          Get personalized, company-specific skill roadmaps. Build real projects. Get AI feedback.
          Land your dream job at top tech companies.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(108,99,255,0.5)' }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--secondary))' }}
            >
              Start for Free
              <ArrowRight size={18} />
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base cursor-pointer"
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            See How It Works
          </motion.button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-14"
          style={{ color: 'var(--text-muted)' }}
        >
          <div className="flex -space-x-2">
            {['#6C63FF', '#00D4FF', '#FF6B6B', '#4ECDC4', '#FFEAA7'].map((c, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                style={{ background: c, borderColor: 'var(--bg)' }}>
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <span className="text-sm">Trusted by <strong style={{ color: 'var(--text)' }}>10,000+</strong> developers worldwide</span>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="var(--secondary)" color="var(--secondary)" />
            ))}
          </div>
          <span className="text-sm font-medium">4.9/5 rating</span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ opacity: 0.5 }}
      >
        <div className="w-6 h-10 rounded-full flex items-start justify-center pt-2"
          style={{ border: '2px solid var(--border)' }}>
          <motion.div
            className="w-1 h-2.5 rounded-full"
            style={{ background: 'var(--accent)' }}
            animate={{ opacity: [1, 0, 1], scaleY: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}
