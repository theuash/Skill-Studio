import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Github, Send, Zap, CheckCircle, Code2, ListChecks, Sparkles } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Button from '../components/ui/Button'
import BrainIcon from '../components/icons/BrainIcon'
import toast from 'react-hot-toast'
import api from '../api/axios'

const DEMO_PROJECT = {
  title: 'Full-Stack E-Commerce Platform',
  description: `Build a production-grade e-commerce platform with React, Node.js, and PostgreSQL. 
This project mirrors what engineers at top tech companies build daily — it combines 
real-time inventory management, secure payment processing, and AI-powered product 
recommendations.`,
  techStack: ['React.js', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'Stripe API', 'TypeScript', 'Docker'],
  acceptanceCriteria: [
    'User authentication with JWT & OAuth (Google/GitHub)',
    'Product catalog with search, filter, and pagination',
    'Shopping cart with real-time stock updates via WebSockets',
    'Checkout flow integrated with Stripe payment gateway',
    'Admin dashboard with order management and analytics',
    'Responsive design with mobile-first approach',
    'REST API documented with Swagger/OpenAPI',
    'At least 80% test coverage (unit + integration)',
  ],
  bonusFeatures: [
    'AI product recommendations using collaborative filtering',
    'Real-time notifications with email + SMS',
    'Multi-language support (i18n)',
    'Dark/light mode with persisted preference',
    'Progressive Web App (PWA) capabilities',
  ],
  estimatedTime: '2-3 weeks',
  difficulty: 'Intermediate',
}

export default function ProjectPage() {
  const { roadmapId } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [repoUrl, setRepoUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [urlError, setUrlError] = useState('')

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setProject(DEMO_PROJECT)
      setLoading(false)
    }, 1200)
  }, [roadmapId])

  const validateUrl = (url) => {
    try {
      const u = new URL(url)
      if (!u.hostname.includes('github.com') && !u.hostname.includes('gitlab.com')) {
        return 'Please provide a GitHub or GitLab URL'
      }
      return ''
    } catch {
      return 'Please enter a valid URL'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validateUrl(repoUrl)
    if (err) { setUrlError(err); return }
    setUrlError('')
    setSubmitting(true)

    try {
      await api.post('/project/submit', { repoUrl, projectId: roadmapId })
    } catch {
      // Demo mode — proceed anyway
    }

    setSubmitting(false)
    setAnalyzing(true)

    setTimeout(() => {
      setAnalyzing(false)
      toast.success('Analysis complete! Your report is ready.')
      navigate(`/analysis/${roadmapId}`)
    }, 3500)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 flex items-center justify-center min-h-96">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 rounded-full border-2 border-t-transparent mx-auto mb-4"
              style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
            />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Generating your project brief...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-4xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm mb-6"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ArrowLeft size={16} /> Back to Roadmap
        </button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 "
              style={{ background: 'rgba(108,99,255,0.12)', color: 'var(--accent)', border: '1px solid rgba(108,99,255,0.25)' }}>
              <BrainIcon size={13} />
              AI Generated
            </span>
            <span className="text-xs px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,107,107,0.1)', color: '#FF6B6B', border: '1px solid rgba(255,107,107,0.25)' }}>
              ⏱ {project?.estimatedTime}
            </span>
            <span className="text-xs px-3 py-1 rounded-full"
              style={{ background: 'rgba(76,205,196,0.1)', color: '#4ECDC4', border: '1px solid rgba(76,205,196,0.25)' }}>
              {project?.difficulty}
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl mb-3" style={{ color: 'var(--text)' }}>
            {project?.title}
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {project?.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Tech Stack */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Code2 size={18} color="var(--accent)" />
              <h2 className="font-heading font-bold text-base" style={{ color: 'var(--text)' }}>Tech Stack</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {project?.techStack.map(tech => (
                <span key={tech} className="text-sm px-3 py-1.5 rounded-xl font-medium"
                  style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--accent)', border: '1px solid rgba(108,99,255,0.2)' }}>
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Bonus Features */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} color="var(--secondary)" />
              <h2 className="font-heading font-bold text-base" style={{ color: 'var(--text)' }}>Bonus Features</h2>
            </div>
            <ul className="space-y-2">
              {project?.bonusFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <span className="mt-0.5 text-xs" style={{ color: 'var(--secondary)' }}>✦</span>
                  {feat}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Acceptance Criteria */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="p-6 rounded-2xl mb-8" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-5">
            <ListChecks size={18} color="#4ECDC4" />
            <h2 className="font-heading font-bold text-base" style={{ color: 'var(--text)' }}>Acceptance Criteria</h2>
          </div>
          <ul className="space-y-3">
            {project?.acceptanceCriteria.map((crit, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-start gap-3 text-sm" style={{ color: 'var(--text)' }}>
                <CheckCircle size={16} className="mt-0.5 flex-shrink-0" color="#4ECDC4" />
                {crit}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Submission */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="p-6 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(108,99,255,0.08), rgba(0,212,255,0.05))',
            border: '1px solid rgba(108,99,255,0.2)',
          }}>
          <div className="flex items-center gap-2 mb-2">
            <Github size={20} color="var(--text)" />
            <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--text)' }}>Submit Your Project</h2>
          </div>
          <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
            Push your code to GitHub and paste the repository URL below. Our AI will analyze your code automatically.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Github size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="url"
                    placeholder="https://github.com/username/repo-name"
                    value={repoUrl}
                    onChange={e => { setRepoUrl(e.target.value); setUrlError('') }}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
                    style={{
                      background: 'var(--surface)',
                      border: urlError ? '1px solid #EF4444' : '1px solid var(--border)',
                      color: 'var(--text)',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.15)' }}
                    onBlur={e => { if (!urlError) { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' } }}
                  />
                </div>
                <Button type="submit" variant="primary" loading={submitting} icon={<Send size={16} />}>
                  Submit
                </Button>
              </div>
              {urlError && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><span>⚠</span>{urlError}</p>}
            </div>
          </form>
        </motion.div>
      </div>

      {/* Analyzing overlay */}
      <AnimatePresence>
        {analyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center max-w-sm px-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 rounded-full border-4 border-t-transparent mx-auto mb-6"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
              />
              <h3 className="font-heading font-bold text-2xl text-white mb-3">AI is Analyzing...</h3>
              <div className="space-y-2 text-sm text-gray-400">
                {['Cloning your repository...', 'Scanning code quality...', 'Evaluating architecture...', 'Generating feedback...'].map((step, i) => (
                  <motion.p key={step}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.7 }}>
                    {step}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
