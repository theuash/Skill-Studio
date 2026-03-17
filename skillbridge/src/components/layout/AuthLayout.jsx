import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'
import ThemeToggle from '../ui/ThemeToggle'
import RoadmapIcon from '../icons/RoadmapIcon'
import CompanyIcon from '../icons/CompanyIcon'
import BrainIcon from '../icons/BrainIcon'

function AnimatedVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A0A0F 0%, #12121A 50%, #0A0A0F 100%)' }}>
      {/* Grid */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(108,99,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

      {/* Orbs */}
      {[
        { size: 400, x: '20%', y: '30%', color: '#6C63FF', delay: 0, dur: 10 },
        { size: 300, x: '60%', y: '50%', color: '#00D4FF', delay: 2, dur: 12 },
        { size: 200, x: '10%', y: '70%', color: '#FF6B6B', delay: 1, dur: 9 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color}30 0%, transparent 70%)`,
            filter: 'blur(2px)',
          }}
          animate={{ y: [0, -20, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: orb.dur, delay: orb.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Central card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center px-8 max-w-sm"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-8"
        >
          <div className="mb-6 flex justify-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/assets/logo.png"
                alt="SkillStudio Logo"
                className="flex-shrink-0 transition-transform group-hover:scale-105 rounded-xl"
                style={{
                  width: 64,
                  height: 64,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 20px rgba(108,99,255,0.3))'
                }}
              />
              <span className="font-heading font-bold text-2xl text-white">
                Skill<span style={{ background: 'linear-gradient(90deg, #6C63FF, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Studio</span>
              </span>
            </Link>
          </div>

  
          <p className="text-gray-400 text-sm leading-relaxed">
            Your AI-powered companion for navigating the tech job market.
          </p>
        </motion.div>

        {/* Feature pills */}
        <div className="space-y-3">
          {[
            { icon: RoadmapIcon, text: 'AI-personalized career roadmaps' },
            { icon: CompanyIcon, text: '500+ top company skill maps' },
            { icon: BrainIcon, text: 'Instant AI code evaluation' },
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
              className="px-4 py-2.5 rounded-xl text-sm text-left text-gray-300 flex items-center gap-3"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <feat.icon size={16} style={{ color: '#6C63FF', flexShrink: 0 }} />
              {feat.text}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Left visual — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] sticky top-0 h-screen">
        <AnimatedVisual />
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5">
          <Logo size="sm" />
          <ThemeToggle />
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            <div className="mb-8">
              <h1 className="font-heading font-extrabold text-3xl mb-2" style={{ color: 'var(--text)' }}>
                {title}
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
            </div>
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
