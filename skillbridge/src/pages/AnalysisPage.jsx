import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, Share2, TrendingUp, TrendingDown, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Button from '../components/ui/Button'

const DEMO_ANALYSIS = {
  overallScore: 78,
  grade: 'B+',
  summary: 'Strong implementation with solid architecture fundamentals. Code quality is good, with room for improvement in test coverage and performance optimization.',
  sections: [
    {
      title: 'Code Quality',
      score: 82,
      color: '#6C63FF',
      icon: '🧹',
      details: 'Clean, readable code with consistent naming conventions. ESLint rules properly configured. Minor issues with function length in some controllers.',
      items: ['✅ Consistent code style', '✅ Meaningful variable names', '⚠️ Some functions exceed 50 lines', '✅ Proper error handling'],
    },
    {
      title: 'Architecture',
      score: 85,
      color: '#00D4FF',
      icon: '🏗️',
      details: 'Well-structured MVC pattern with proper separation of concerns. Service layer correctly abstracts business logic from routes.',
      items: ['✅ MVC pattern followed', '✅ Service layer present', '✅ Middleware well-organized', '⚠️ Missing API versioning'],
    },
    {
      title: 'Best Practices',
      score: 74,
      color: '#4ECDC4',
      icon: '📋',
      details: 'Environment variables properly handled. Input validation present but inconsistent. SQL injection prevention via parameterized queries.',
      items: ['✅ .env file properly used', '✅ Parameterized SQL queries', '⚠️ Missing rate limiting', '❌ No API documentation'],
    },
    {
      title: 'Test Coverage',
      score: 58,
      color: '#FF6B6B',
      icon: '🧪',
      details: 'Basic unit tests present but integration tests are missing. Coverage at 42% — below the 80% requirement. Jest configured correctly.',
      items: ['✅ Jest configured', '⚠️ Coverage at 42% (target: 80%)', '❌ No integration tests', '✅ Critical paths tested'],
    },
    {
      title: 'Performance',
      score: 80,
      color: '#FFEAA7',
      icon: '⚡',
      details: 'Redis caching implemented for frequent queries. Database queries are optimized with proper indexing. Image optimization missing.',
      items: ['✅ Redis caching implemented', '✅ Database indexes present', '✅ Pagination implemented', '⚠️ No image compression'],
    },
    {
      title: 'Security',
      score: 88,
      color: '#A29BFE',
      icon: '🔐',
      details: 'JWT implemented correctly with refresh token rotation. CORS configured. Bcrypt used for password hashing. CSRF protection present.',
      items: ['✅ JWT with refresh tokens', '✅ CORS properly set', '✅ Bcrypt password hashing', '✅ CSRF protection'],
    },
  ],
  strengths: [
    'Excellent use of async/await patterns throughout the codebase',
    'Redis caching dramatically improves query performance',
    'Security implementation is above average — JWT done right',
    'Clean project structure that would scale well in production',
  ],
  improvements: [
    'Increase test coverage from 42% to minimum 80% — critical gap',
    'Add API documentation using Swagger/OpenAPI spec',
    'Implement rate limiting on authentication endpoints',
    'Add request validation middleware using Joi or Zod',
  ],
  nextSteps: [
    'Add comprehensive integration tests for the auth flow',
    'Document the API with Swagger and host it at /api/docs',
    'Consider adding a CI/CD pipeline (GitHub Actions)',
    'Explore adding real-time features with WebSockets or SSE',
  ],
}

function CircularProgress({ score, size = 140 }) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  const color = score >= 80 ? '#4ECDC4' : score >= 60 ? '#6C63FF' : '#FF6B6B'

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="circular-progress" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth="8" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-heading font-extrabold"
          style={{ fontSize: size * 0.23, color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {score}
        </motion.span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/ 100</span>
      </div>
    </div>
  )
}

function ScoreBar({ title, score, color, icon, details, items, delay }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      onClick={() => setExpanded(e => !e)}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span>{icon}</span>
            <span className="font-heading font-semibold text-sm" style={{ color: 'var(--text)' }}>{title}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-heading font-bold text-lg" style={{ color }}>
              {score}
            </span>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/100</span>
          </div>
        </div>
        <div className="progress-bar">
          <motion.div
            className="h-full rounded-full"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ delay: delay + 0.2, duration: 0.8 }}
          />
        </div>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{details}</p>
            <ul className="space-y-1.5">
              {items.map((item, i) => (
                <li key={i} className="text-sm" style={{ color: 'var(--text)' }}>{item}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default function AnalysisPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    setTimeout(() => {
      setData(DEMO_ANALYSIS)
      setLoading(false)
    }, 800)
  }, [projectId])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-4"
              style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading analysis...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-5xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm mb-6"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ArrowLeft size={16} /> Back to Project
        </button>

        {/* Overall score banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8"
          style={{
            background: 'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(0,212,255,0.08))',
            border: '1px solid rgba(108,99,255,0.25)',
          }}
        >
          <CircularProgress score={data.overallScore} size={160} />
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="font-heading font-extrabold text-3xl" style={{ color: 'var(--text)' }}>
                AI Code Analysis
              </h1>
              <span className="px-3 py-1 rounded-xl font-heading font-bold text-lg text-white"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--secondary))' }}>
                {data.grade}
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-5 max-w-lg" style={{ color: 'var(--text-muted)' }}>
              {data.summary}
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Button variant="primary" size="sm" icon={<Download size={15} />}>
                Download PDF
              </Button>
              <Button variant="secondary" size="sm" icon={<Share2 size={15} />}>
                Share Report
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Score sections grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {data.sections.map((section, i) => (
            <ScoreBar key={section.title} {...section} delay={0.1 + i * 0.07} />
          ))}
        </div>

        {/* Strengths & Improvements */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 rounded-2xl"
            style={{ background: 'var(--surface)', border: '1px solid rgba(76,205,196,0.2)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} color="#4ECDC4" />
              <h3 className="font-heading font-bold text-base" style={{ color: 'var(--text)' }}>Strengths</h3>
            </div>
            <ul className="space-y-3">
              {data.strengths.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <CheckCircle size={15} className="mt-0.5 flex-shrink-0" color="#4ECDC4" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-6 rounded-2xl"
            style={{ background: 'var(--surface)', border: '1px solid rgba(255,107,107,0.2)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown size={18} color="#FF6B6B" />
              <h3 className="font-heading font-bold text-base" style={{ color: 'var(--text)' }}>Areas to Improve</h3>
            </div>
            <ul className="space-y-3">
              {data.improvements.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <AlertCircle size={15} className="mt-0.5 flex-shrink-0" color="#FF6B6B" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-6 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(108,99,255,0.08), rgba(0,212,255,0.05))',
            border: '1px solid rgba(108,99,255,0.2)',
          }}
        >
          <h3 className="font-heading font-bold text-base mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <ArrowRight size={18} color="var(--accent)" />
            Recommended Next Steps
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {data.nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.12)' }}>
                <span className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                  style={{ background: 'var(--accent)' }}>
                  {i + 1}
                </span>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{step}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
