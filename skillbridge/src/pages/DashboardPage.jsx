import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Map, FolderGit2, Zap, ChevronDown, ArrowRight, Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { SECTORS } from '../utils/data'
import toast from 'react-hot-toast'

function StatCard({ icon: Icon, label, value, color, delay }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const target = parseInt(value) || 0
    if (target === 0) return

    const duration = 1.5
    const steps = 50
    const increment = target / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration * 1000 / steps)

    return () => clearInterval(timer)
  }, [value])

  const displayValue = typeof value === 'string' && value.endsWith('%') ? count + '%' : count

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
      <div className="text-3xl font-heading font-extrabold mb-1" style={{ color: 'var(--text)' }}>{displayValue}</div>
      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</div>
    </motion.div>
  )
}

function ContinueLearningCard({ roadmap, index, onContinue }) {
  const getStatusColor = (status) => {
    return status === 'completed' ? 'var(--accent)' : status === 'in_progress' ? 'var(--secondary)' : 'var(--text-muted)'
  }

  const getProgressColor = (percent) => {
    if (percent >= 70) return 'var(--accent)'
    if (percent >= 30) return 'var(--secondary)'
    return '#FF6B6B'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.55 + index * 0.08 }}
      className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all group"
      style={{
        background: 'var(--surface)',
        border: `2px solid ${getStatusColor(roadmap.status)}`,
        borderLeft: `4px solid ${getStatusColor(roadmap.status)}`,
      }}
      onClick={() => onContinue(roadmap.roadmapId)}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >
      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm text-white"
        style={{ background: `linear-gradient(135deg, var(--accent), rgba(0,212,255,0.7))` }}>
        {roadmap.companyInitial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{roadmap.companyName}</span>
          <span className="text-xs font-bold" style={{ color: getProgressColor(roadmap.progressPercent) }}>
            {roadmap.progressPercent}%
          </span>
        </div>
        <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{roadmap.jobRole}</p>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <div className="h-1.5 flex-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${roadmap.progressPercent}%` }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
              style={{ background: getProgressColor(roadmap.progressPercent) }}
            />
          </div>
          <span className="whitespace-nowrap">{roadmap.completedNodes}/{roadmap.totalNodes}</span>
        </div>
      </div>
    </motion.div>
  )
}

function ProjectCard({ project, index, onViewResults }) {
  const getResultColor = (result) => {
    if (result === 'PASS') return 'var(--accent)'
    if (result === 'PARTIAL') return 'var(--secondary)'
    return '#FF6B6B'
  }

  const getResultIcon = (result) => {
    if (result === 'PASS') return '✅'
    if (result === 'PARTIAL') return '⚠️'
    return '❌'
  }

  const failedSkills = project.skillResults.filter(s => s.status === 'FAIL' || s.status === 'NEEDS_IMPROVEMENT')

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7 + index * 0.08 }}
      className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all group"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      onClick={() => onViewResults(project.analysisId)}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm text-white"
        style={{ background: `linear-gradient(135deg, var(--secondary), rgba(108,99,255,0.7))` }}>
        {project.companyName.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm mb-1 truncate" style={{ color: 'var(--text)' }}>
          {project.projectTitle}
        </p>
        <div className="flex flex-wrap gap-1 mb-1">
          {failedSkills.slice(0, 2).map((skill, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full text-white"
              style={{ background: '#FF6B6B99' }}>
              {skill.skill}
            </span>
          ))}
          {failedSkills.length > 2 && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: 'var(--text-muted)' }}>
              +{failedSkills.length - 2} more
            </span>
          )}
        </div>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Submitted {formatDate(project.analyzedAt)}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-center">
          <div className="text-sm font-bold" style={{ color: getResultColor(project.overallResult) }}>
            {project.overallScore}%
          </div>
          <div className="text-xs" style={{ color: getResultColor(project.overallResult) }}>
            {getResultIcon(project.overallResult)} {project.overallResult}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedSector, setSelectedSector] = useState('')
  const [sectorOpen, setSectorOpen] = useState(false)
  const [learningData, setLearningData] = useState([])
  const [recentProjects, setRecentProjects] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLearningProgress = async () => {
      try {
        const res = await api.get('/user/learning-progress')
        const { roadmaps, recentProjects: projects, stats: statsData } = res.data.data
        setLearningData(roadmaps)
        setRecentProjects(projects)
        setStats(statsData)
      } catch (err) {
        console.error('Failed to fetch learning progress:', err)
        toast.error('Failed to load learning progress')
      } finally {
        setLoading(false)
      }
    }
    fetchLearningProgress()
  }, [])

  const firstName = user?.name?.split(' ')[0] || 'Developer'

  const statCards = stats ? [
    { icon: Map, label: 'Roadmaps Started', value: stats.totalRoadmaps, color: '#6C63FF', delay: 0.1 },
    { icon: FolderGit2, label: 'Projects Submitted', value: stats.totalProjectsSubmitted, color: '#00D4FF', delay: 0.2 },
    { icon: Zap, label: 'Skills Learned', value: stats.totalSkillsCompleted, color: '#4ECDC4', delay: 0.3 },
    { icon: TrendingUp, label: 'Avg. Completion', value: stats.avgCompletion + '%', color: '#FF6B6B', delay: 0.4 },
  ] : []

  const handleSectorSelect = (sector) => {
    setSelectedSector(sector.name)
    setSectorOpen(false)
    navigate(`/sector/${sector.id}`)
  }

  const handleContinueRoadmap = (roadmapId) => {
    navigate(`/roadmap/${roadmapId}`)
  }

  const handleViewResults = (analysisId) => {
    navigate(`/project/analysis/${analysisId}`)
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
              {firstName}
            </h1>
            <p className="text-sm max-w-md mb-6" style={{ color: 'var(--text-muted)' }}>
              {learningData.length > 0
                ? `You have ${learningData.length} roadmap${learningData.length !== 1 ? 's' : ''} in progress. Keep pushing — you're doing great!`
                : 'Start your learning journey by exploring companies and sectors.'}
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
              {learningData.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text)' }}
                  onClick={() => handleContinueRoadmap(learningData[0].roadmapId)}
                >
                  Continue Learning
                </motion.button>
              )}
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
            Browse by Sector
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
          {statCards.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Continue Learning Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-xl" style={{ color: 'var(--text)' }}>
              Continue Learning
            </h2>
            {learningData.length > 0 && (
              <button className="text-sm font-medium" style={{ color: 'var(--accent)' }}
                onClick={() => navigate('/dashboard')}>
                View all →
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'var(--surface)' }} />
              ))}
            </div>
          ) : learningData.length === 0 ? (
            <div className="text-center py-12 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <Map size={32} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>No roadmaps started yet</p>
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                Start your learning journey by exploring companies and sectors
              </p>
              <button
                onClick={() => setSectorOpen(true)}
                className="text-xs font-semibold px-4 py-2 rounded-lg"
                style={{ color: 'white', background: 'linear-gradient(135deg, var(--accent), var(--secondary))' }}
              >
                Explore Companies →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {learningData.map((roadmap, i) => (
                <ContinueLearningCard
                  key={roadmap.roadmapId}
                  roadmap={roadmap}
                  index={i}
                  onContinue={handleContinueRoadmap}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Projects Section */}
        {recentProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-xl" style={{ color: 'var(--text)' }}>
                Recent Project Submissions
              </h2>
              <button className="text-sm font-medium" style={{ color: 'var(--accent)' }}
                onClick={() => navigate('/projects')}>
                View all →
              </button>
            </div>

            <div className="space-y-3">
              {recentProjects.map((project, i) => (
                <ProjectCard
                  key={project.analysisId}
                  project={project}
                  index={i}
                  onViewResults={handleViewResults}
                />
              ))}
            </div>
          </motion.div>
        )}
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

function formatDate(date) {
  if (!date) return 'recently'
  const diff = Date.now() - new Date(date).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  return `${days} days ago`
}
