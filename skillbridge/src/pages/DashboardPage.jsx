import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Map, FolderGit2, Zap, ChevronDown, ArrowRight, Clock, TrendingUp } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import { SECTORS, COMPANIES } from '../utils/data'

const RECENT_COMPANIES = [
  { id: 'google', name: 'Google', domain: 'google.com', sector: 'web-development', role: 'Software Engineer', progress: 68 },
  { id: 'openai', name: 'OpenAI', domain: 'openai.com', sector: 'ai-ml', role: 'ML Engineer', progress: 35 },
  { id: 'stripe', name: 'Stripe', domain: 'stripe.com', sector: 'web-development', role: 'Backend Engineer', progress: 12 },
]

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="p-6 rounded-2xl relative overflow-hidden"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-8 translate-x-8"
        style={{ background: `${color}10` }} />
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `${color}15` }}>
        <Icon size={18} color={color} />
      </div>
      <div className="text-3xl font-heading font-extrabold mb-1" style={{ color: 'var(--text)' }}>{value}</div>
      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedSector, setSelectedSector] = useState('')
  const [sectorOpen, setSectorOpen] = useState(false)

  const firstName = user?.name?.split(' ')[0] || 'Developer'

  const stats = [
    { icon: Map, label: 'Roadmaps Started', value: user?.roadmapsStarted ?? 3, color: '#6C63FF', delay: 0.1 },
    { icon: FolderGit2, label: 'Projects Submitted', value: user?.projectsSubmitted ?? 1, color: '#00D4FF', delay: 0.2 },
    { icon: Zap, label: 'Skills Learned', value: user?.skillsLearned ?? 12, color: '#4ECDC4', delay: 0.3 },
    { icon: TrendingUp, label: 'Avg. Completion', value: '38%', color: '#FF6B6B', delay: 0.4 },
  ]

  const handleSectorSelect = (sector) => {
    setSelectedSector(sector.name)
    setSectorOpen(false)
    navigate(`/sector/${sector.id}`)
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-6xl">
        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl p-8 mb-8 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(0,212,255,0.1) 100%)',
            border: '1px solid rgba(108,99,255,0.25)',
          }}
        >
          <div className="absolute right-0 top-0 w-64 h-64 opacity-10"
            style={{
              background: 'radial-gradient(circle, var(--accent), transparent)',
              transform: 'translate(30%, -30%)',
            }} />
          <div className="relative z-10">
            <p className="text-sm mb-1" style={{ color: 'var(--accent)' }}>Good {getGreeting()},</p>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl mb-3" style={{ color: 'var(--text)' }}>
              {firstName} 👋
            </h1>
            <p className="text-sm max-w-md mb-6" style={{ color: 'var(--text-muted)' }}>
              You have 2 roadmaps in progress. Keep pushing — you're 68% through your Google SWE path!
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSectorOpen(o => !o)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--secondary))' }}
              >
                Start Exploring
                <ArrowRight size={15} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text)' }}
                onClick={() => navigate('/roadmap/google/software-engineer')}
              >
                Continue Google Roadmap
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Sector dropdown */}
        <div className="relative mb-8 inline-block">
          <button
            onClick={() => setSectorOpen(o => !o)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          >
            🔍 Browse by Sector
            <ChevronDown size={15} className={`transition-transform ${sectorOpen ? 'rotate-180' : ''}`} />
          </button>

          {sectorOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute top-full mt-2 left-0 z-50 rounded-2xl p-2 grid grid-cols-2 gap-1 w-72 shadow-xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              {SECTORS.map(sector => (
                <button
                  key={sector.id}
                  onClick={() => handleSectorSelect(sector)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left w-full cursor-pointer transition-colors hover:bg-opacity-100"
                  style={{ color: 'var(--text)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span>{sector.icon}</span>
                  <span className="text-xs">{sector.name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Recent companies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-xl" style={{ color: 'var(--text)' }}>
              Continue Learning
            </h2>
            <button className="text-sm font-medium" style={{ color: 'var(--accent)' }}
              onClick={() => navigate('/sector/web-development')}>
              View all →
            </button>
          </div>

          <div className="space-y-3">
            {RECENT_COMPANIES.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.08 }}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                onClick={() => navigate(`/roadmap/${c.id}/software-engineer`)}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(108,99,255,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                  style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid var(--border)' }}>
                  <img src={`https://logo.clearbit.com/${c.domain}`} alt={c.name}
                    className="w-8 h-8 object-contain"
                    onError={e => { e.target.style.display = 'none' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{c.name}</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.progress}%</span>
                  </div>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{c.role}</p>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${c.progress}%` }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                    />
                  </div>
                </div>
                <Clock size={16} style={{ color: 'var(--text-muted)' }} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 18) return 'afternoon'
  return 'evening'
}
