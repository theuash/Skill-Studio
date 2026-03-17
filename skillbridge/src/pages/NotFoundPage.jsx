import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import Logo from '../components/ui/Logo'
import ThemeToggle from '../components/ui/ThemeToggle'
import LinkIcon from '../components/icons/LinkIcon'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Grid bg */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(108,99,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

      {/* Orbs */}
      {[
        { size: 500, x: '70%', y: '10%', color: '#6C63FF', delay: 0 },
        { size: 350, x: '-5%', y: '60%', color: '#00D4FF', delay: 1.5 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size, height: orb.size, left: orb.x, top: orb.y,
            background: `radial-gradient(circle, ${orb.color}25 0%, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, delay: orb.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Nav */}
      <div className="flex items-center justify-between px-8 py-5 relative z-10">
        <Logo />
        <ThemeToggle />
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="text-center max-w-lg">
          {/* Giant 404 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-6"
          >
            <div
              className="font-heading font-extrabold select-none"
              style={{
                fontSize: 'clamp(7rem, 22vw, 14rem)',
                lineHeight: 1,
                background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(0,212,255,0.1))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.05em',
              }}
            >
              404
            </div>

            {/* Floating broken link icon */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
                  boxShadow: '0 0 60px rgba(108,99,255,0.4)',
                }}
              >
                <LinkIcon size={40} style={{ color: 'white' }} />
              </div>
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-heading font-extrabold text-3xl sm:text-4xl mb-4"
            style={{ color: 'var(--text)' }}
          >
            This bridge leads nowhere
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="text-base mb-10 leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            The page you're looking for has drifted off the map. Maybe it moved, was deleted, or never existed.
            Let's get you back on track.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(108,99,255,0.4)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-base text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--secondary))' }}
            >
              <Home size={18} />
              Go Home
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-base cursor-pointer"
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            >
              <ArrowLeft size={18} />
              Go Back
            </motion.button>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="mt-14"
          >
            <p className="text-xs mb-4 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Or explore these
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { label: '🏠 Home', href: '/' },
                { label: '🔑 Login', href: '/login' },
                { label: '📝 Register', href: '/register' },
                { label: '📊 Dashboard', href: '/dashboard' },
              ].map(({ label, href }) => (
                <button
                  key={href}
                  onClick={() => navigate(href)}
                  className="text-sm px-4 py-2 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent)'
                    e.currentTarget.style.color = 'var(--accent)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--text-muted)'
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
