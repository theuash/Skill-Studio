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
        background: `radial-gradient(circle, ${color}25 0%, ${color}08 60%, transparent 100%)`,
        filter: 'blur(1px)',
      }}
      animate={{
        y: [0, -25, 0],
        scale: [1, 1.08, 1],
        opacity: [0.6, 0.8, 0.6],
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
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--primary)" strokeWidth="0.5" />
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
      style={{ left: x, top: y, background: 'var(--primary)' }}
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
  { icon: Zap, label: '500+ Top Companies', color: '#6C6E36', x: '8%', y: '20%', delay: 0 },
  { icon: Star, label: '50+ Tech Sectors', color: '#44444E', x: '82%', y: '70%', delay: 0.5 },
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
        <FloatingOrb size={500} x="55%" y="-10%" color="#6C6E36" delay={0} duration={10} />
        <FloatingOrb size={350} x="-8%" y="25%" color="#44444E" delay={2} duration={12} />
        <FloatingOrb size={250} x="70%" y="50%" color="#6C6E36" delay={1} duration={9} />
        <FloatingOrb size={180} x="15%" y="5%" color="#44444E" delay={3} duration={11} />
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
            className="absolute glass rounded-2xl px-5 py-4 flex items-center gap-3 backdrop-blur-md"
            style={{ left: x, top: y }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay }}
            >
              <Icon size={18} color={color} strokeWidth={2.5} />
            </motion.div>
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{label}</span>
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
            background: 'rgba(68, 68, 78, 0.08)',
            border: '1px solid rgba(108, 110, 54, 0.25)',
          }}
        >
          <Sparkles size={14} color="var(--primary)" strokeWidth={2.5} />
          <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
            AI-Powered Career Guidance Platform
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full text-white font-semibold"
            style={{ background: 'var(--primary)' }}>NEW</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading font-extrabold leading-[1.1] tracking-tight mb-6"
          style={{
            fontSize: 'clamp(2.8rem, 8vw, 6rem)',
            color: 'var(--text)',
            letterSpacing: '-0.02em',
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
          className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-normal"
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
              whileHover={{ scale: 1.05, boxShadow: '0 8px 32px rgba(108, 110, 54, 0.25)' }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base text-white cursor-pointer transition-all"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
            >
              Start for Free
              <ArrowRight size={18} strokeWidth={2.5} />
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base cursor-pointer transition-all"
            style={{
              background: 'transparent',
              border: '2px solid var(--primary)',
              color: 'var(--primary)',
            }}
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More
            <ArrowRight size={18} strokeWidth={2.5} />
          </motion.button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-16"
          style={{ color: 'var(--text-muted)' }}
        >
          <div className="flex -space-x-2">
            {['#6C6E36', '#44444E', '#D3DAD9'].map((c, i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                style={{ background: c, borderColor: 'var(--bg)' }}>
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>10,000+</span>
            <span className="text-xs">Developers Guided</span>
          </div>
          <div className="w-px h-8" style={{ background: 'var(--border)' }} />
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="var(--secondary)" color="var(--secondary)" />
            ))}
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>4.9/5 rating</span>
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
            style={{ background: 'var(--primary)' }}
            animate={{ opacity: [1, 0, 1], scaleY: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}
