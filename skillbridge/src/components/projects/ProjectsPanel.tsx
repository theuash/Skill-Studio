import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Github, CheckCircle, XCircle, AlertTriangle, Zap, FileText, Code2, Check, ArrowRight } from 'lucide-react'
import Button from '../ui/Button'
import toast from 'react-hot-toast'
import api from '../../api/axios'

const DIFFICULTY_COLORS = {
  Beginner: { bg: 'rgba(76,205,196,0.15)', text: '#4ECDC4', border: 'rgba(76,205,196,0.3)' },
  Intermediate: { bg: 'rgba(108,99,255,0.15)', text: '#6C63FF', border: 'rgba(108,99,255,0.3)' },
  Advanced: { bg: 'rgba(255,107,107,0.15)', text: '#FF6B6B', border: 'rgba(255,107,107,0.3)' },
}

const STATUS_COLORS = {
  PASS: { bg: 'rgba(76,205,196,0.15)', text: '#4ECDC4', border: 'rgba(76,205,196,0.3)' },
  FAIL: { bg: 'rgba(255,107,107,0.15)', text: '#FF6B6B', border: 'rgba(255,107,107,0.3)' },
  NEEDS_IMPROVEMENT: { bg: 'rgba(255,193,7,0.15)', text: '#FFC107', border: 'rgba(255,193,7,0.3)' },
}

const RESULT_COLORS = {
  PASS: { bg: 'rgba(76,205,196,0.1)', text: '#4ECDC4', border: 'rgba(76,205,196,0.3)' },
  PARTIAL: { bg: 'rgba(255,193,7,0.1)', text: '#FFC107', border: 'rgba(255,193,7,0.3)' },
  FAIL: { bg: 'rgba(255,107,107,0.1)', text: '#FF6B6B', border: 'rgba(255,107,107,0.3)' },
}

function AnimatedCounter({ value, duration = 2000 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value, duration])

  return <span>{count}</span>
}

function LoadingState({ skillsCount }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-20 h-20 rounded-full mb-6"
        style={{
          background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
          opacity: 0.8,
        }}
      />
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-heading font-bold mb-2"
        style={{ color: 'var(--text)' }}
      >
        🤖 Generating your project challenge...
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-sm"
        style={{ color: 'var(--text-muted)' }}
      >
        Crafting a problem that covers all {skillsCount} required skills
      </motion.p>
    </div>
  )
}

function ProblemState({ problem, githubUrl, setGithubUrl, urlError, submitting }) {
  const colors = DIFFICULTY_COLORS[problem.difficulty]

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
            >
              {problem.difficulty}
            </span>
          </div>
          <h2 className="text-2xl font-heading font-bold mb-2" style={{ color: 'var(--text)' }}>
            {problem.title}
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            This project covers: {problem.technicalRequirements?.map(req => req.skill).join(' · ')}
          </p>
        </div>

        {/* The Challenge */}
        <div
          className="p-4 rounded-xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <h3 className="font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>
            The Challenge
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {problem.description}
          </p>
        </div>

        {/* Technical Requirements */}
        <div
          className="p-4 rounded-xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <h3 className="font-heading font-semibold mb-4" style={{ color: 'var(--text)' }}>
            Technical Requirements
          </h3>
          <div className="space-y-3">
            {problem.technicalRequirements?.map((req, i) => {
              const skillColors = DIFFICULTY_COLORS.Intermediate // Default, could be mapped from skill level
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg"
                  style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
                >
                  <span
                    className="px-2 py-1 rounded text-xs font-semibold flex-shrink-0 mt-0.5"
                    style={{ background: skillColors.bg, color: skillColors.text }}
                  >
                    {req.skill}
                  </span>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {req.requirement}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Acceptance Criteria */}
        <div
          className="p-4 rounded-xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <h3 className="font-heading font-semibold mb-4" style={{ color: 'var(--text)' }}>
            Acceptance Criteria
          </h3>
          <div className="space-y-2">
            {problem.acceptanceCriteria?.map((criterion, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-start gap-3"
              >
                <CheckCircle size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {criterion}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Deliverables */}
        <div
          className="p-4 rounded-xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <h3 className="font-heading font-semibold mb-4" style={{ color: 'var(--text)' }}>
            Deliverables
          </h3>
          <div className="space-y-2">
            {problem.deliverables?.map((deliverable, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-start gap-3"
              >
                <FileText size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {deliverable}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AnalysisState({ analysis, onTryAgain, companyId }) {
  // Safety checks to prevent black screen crashes
  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <div className="text-center space-y-4">
          <XCircle size={48} style={{ color: '#FF6B6B' }} />
          <h3 className="text-lg font-heading font-bold" style={{ color: 'var(--text)' }}>
            Analysis Failed
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No analysis data received. Please try again.
          </p>
          <Button onClick={onTryAgain} variant="secondary">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const resultColors = RESULT_COLORS[analysis.overallResult] || RESULT_COLORS.FAIL
  const overallScore = analysis.overallScore ?? 0
  const summary = analysis.summary ?? 'No summary available'
  const skillResults = analysis.skillResults ?? []
  const criteriaResults = analysis.criteriaResults ?? []
  const strengths = analysis.strengths ?? []
  const weaknesses = analysis.weaknesses ?? []

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Result Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl text-center"
          style={{
            background: resultColors.bg,
            border: `1px solid ${resultColors.border}`,
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            {analysis.overallResult === 'PASS' && <CheckCircle size={24} style={{ color: resultColors.text }} />}
            {analysis.overallResult === 'PARTIAL' && <AlertTriangle size={24} style={{ color: resultColors.text }} />}
            {analysis.overallResult === 'FAIL' && <XCircle size={24} style={{ color: resultColors.text }} />}
            <span className="text-lg font-heading font-bold" style={{ color: resultColors.text }}>
              {analysis.overallResult === 'PASS' && '✅ Project Passed!'}
              {analysis.overallResult === 'PARTIAL' && '⚠️ Partially Complete'}
              {analysis.overallResult === 'FAIL' && '❌ Needs More Work'}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl font-heading font-extrabold" style={{ color: resultColors.text }}>
              <AnimatedCounter value={overallScore} />
            </span>
            <span className="text-lg" style={{ color: 'var(--text-muted)' }}>/100</span>
          </div>
        </motion.div>

        {/* AI Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <h3 className="font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>
            AI Summary
          </h3>
          <p className="text-sm italic leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {summary}
          </p>
        </motion.div>

        {/* Skill-by-Skill Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <h3 className="font-heading font-semibold mb-4" style={{ color: 'var(--text)' }}>
            Skill-by-Skill Breakdown
          </h3>
          <div className="space-y-4">
            {skillResults.length > 0 ? skillResults.map((skill, i) => {
              const statusColors = STATUS_COLORS[skill?.status] || STATUS_COLORS.FAIL
              const skillScore = skill?.score ?? 0
              const skillName = skill?.skill ?? 'Unknown Skill'
              const feedback = skill?.feedback ?? 'No feedback available'
              const improvements = skill?.improvements ?? []

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="p-3 rounded-lg"
                  style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                        {skillName}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: statusColors.bg, color: statusColors.text }}
                      >
                        {skill?.status?.replace('_', ' ') ?? 'UNKNOWN'}
                      </span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: statusColors.text }}>
                      {skillScore}/100
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full mb-2"
                    style={{ background: 'var(--border)' }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: statusColors.text }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(skillScore, 100)}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                    />
                  </div>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                    {feedback}
                  </p>
                  {(skill?.status === 'FAIL' || skill?.status === 'NEEDS_IMPROVEMENT') && improvements.length > 0 && (
                    <div className="space-y-1">
                      {improvements.map((imp, j) => (
                        <p key={j} className="text-xs" style={{ color: statusColors.text }}>
                          • {imp}
                        </p>
                      ))}
                    </div>
                  )}
                </motion.div>
              )
            }) : (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                No skill analysis available
              </p>
            )}
          </div>
        </motion.div>

        {/* Criteria Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <h3 className="font-heading font-semibold mb-4" style={{ color: 'var(--text)' }}>
            Criteria Checklist
          </h3>
          <div className="space-y-3">
            {criteriaResults.length > 0 ? criteriaResults.map((criterion, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="flex items-start gap-3"
              >
                {criterion?.met ? (
                  <CheckCircle size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#4ECDC4' }} />
                ) : (
                  <XCircle size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#FF6B6B' }} />
                )}
                <div className="flex-1">
                  <p className="text-sm" style={{ color: 'var(--text)' }}>
                    {criterion?.criterion ?? 'Unknown criterion'}
                  </p>
                  {criterion?.comment && (
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {criterion.comment}
                    </p>
                  )}
                </div>
              </motion.div>
            )) : (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                No criteria analysis available
              </p>
            )}
          </div>
        </motion.div>

        {/* Strengths & Weaknesses */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid md:grid-cols-2 gap-4"
        >
          <div
            className="p-4 rounded-xl"
            style={{ background: 'var(--surface)', border: '1px solid rgba(76,205,196,0.2)' }}
          >
            <h4 className="font-heading font-semibold mb-3 flex items-center gap-2" style={{ color: '#4ECDC4' }}>
              💪 Strengths
            </h4>
            <div className="space-y-2">
              {strengths.length > 0 ? strengths.map((strength, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.05 }}
                  className="px-3 py-2 rounded-lg text-xs"
                  style={{ background: 'rgba(76,205,196,0.1)', color: 'var(--text)' }}
                >
                  {strength}
                </motion.div>
              )) : (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  No strengths identified
                </p>
              )}
            </div>
          </div>

          <div
            className="p-4 rounded-xl"
            style={{ background: 'var(--surface)', border: '1px solid rgba(255,107,107,0.2)' }}
          >
            <h4 className="font-heading font-semibold mb-3 flex items-center gap-2" style={{ color: '#FF6B6B' }}>
              ⚠️ Weaknesses
            </h4>
            <div className="space-y-2">
              {weaknesses.length > 0 ? weaknesses.map((weakness, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.05 }}
                  className="px-3 py-2 rounded-lg text-xs"
                  style={{ background: 'rgba(255,107,107,0.1)', color: 'var(--text)' }}
                >
                  {weakness}
                </motion.div>
              )) : (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  No areas for improvement identified
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex gap-3 pt-4"
        >
          <Button variant="secondary" onClick={onTryAgain} className="flex-1">
            Try Different Repo
          </Button>
          <Button variant="primary" onClick={() => window.location.href = `/roadmap/${companyId}/software-engineer`} className="flex-1">
            View My Roadmap
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default function ProjectsPanel({ companyName, skills, companyId, onClose }) {
  const [state, setState] = useState('generating') // 'generating' | 'problem' | 'analysis'
  const [problem, setProblem] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [githubUrl, setGithubUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loadingTextIdx, setLoadingTextIdx] = useState(0)

  const loadingTexts = [
    '📦 Fetching your repository...',
    '📖 Reading your code...',
    '🧠 AI is reviewing your work...',
    '📊 Generating your rating...',
  ]

  useEffect(() => {
    // Auto-generate problem on mount
    generateProblem()
  }, [])

  useEffect(() => {
    if (!submitting) return
    const interval = setInterval(() => {
      setLoadingTextIdx((prev) => (prev + 1) % loadingTexts.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [submitting, loadingTexts.length])

  const generateProblem = async () => {
    try {
      const skillsWithLevel = skills.map((skill) => ({
        name: typeof skill === 'string' ? skill : skill.name,
        level: typeof skill === 'object' && skill.level ? skill.level : 'Intermediate',
      }))

      const res = await api.post('/projects/generate-problem', {
        companyId,
        companyName,
        skills: skillsWithLevel,
      })
      setProblem(res.data.data)
      setState('problem')
    } catch (err) {
      const errorMsg = err?.response?.data?.error || err?.response?.data?.message || 'Failed to generate problem. Please try again.'
      toast.error(errorMsg)
      console.error('Problem generation error:', err)
    }
  }

  const validateUrl = (url) => {
    try {
      const u = new URL(url)
      if (!u.hostname.includes('github.com')) {
        return 'Please provide a GitHub URL'
      }
      const pathParts = u.pathname.split('/').filter(p => p)
      if (pathParts.length !== 2) {
        return 'Please provide a valid GitHub repository URL'
      }
      return ''
    } catch {
      return 'Please enter a valid URL'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validateUrl(githubUrl)
    if (err) {
      setUrlError(err)
      return
    }
    setUrlError('')
    setSubmitting(true)
    setLoadingTextIdx(0)

    try {
      const res = await api.post('/projects/analyze', {
        problemId: problem._id,
        githubUrl,
        skills: skills.map((s) => ({
          name: typeof s === 'string' ? s : s.name,
          level: typeof s === 'object' && s.level ? s.level : 'Intermediate',
        })),
        problemStatement: problem,
      })
      setAnalysis(res.data.data)
      setState('analysis')
      toast.success('Analysis complete!')
    } catch (err) {
      const errorMsg = err?.response?.data?.error || err?.response?.data?.message || 'Analysis failed. Please try again.'
      toast.error(errorMsg)
      console.error('Analysis error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleTryAgain = () => {
    setState('problem')
    setAnalysis(null)
    setGithubUrl('')
    setUrlError('')
  }

  return (
    <AnimatePresence>
      <>
        {/* Overlay backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 999,
          }}
        />

        {/* Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed top-0 right-0 h-full w-full max-w-lg z-50 flex flex-col"
          style={{
            background: '#0D0F1A',
            borderLeft: '1px solid rgba(108,99,255,0.2)',
            boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.6)',
            zIndex: 1000,
          }}
        >
          {/* Header - Fixed */}
          <div className="flex items-center justify-between p-4 border-b flex-shrink-0" style={{ borderColor: 'rgba(108,99,255,0.2)', background: '#0D0F1A' }}>
            <h1 className="font-heading font-bold text-lg" style={{ color: 'var(--text)' }}>
              Project Challenge
            </h1>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-opacity-20 transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto" style={{ background: '#0D0F1A' }}>
            {state === 'generating' && <LoadingState skillsCount={skills?.length || 0} />}
            {state === 'problem' && (
              <ProblemState
                problem={problem}
                githubUrl={githubUrl}
                setGithubUrl={setGithubUrl}
                urlError={urlError}
                submitting={submitting}
              />
            )}
            {state === 'analysis' && (
              <AnalysisState
                analysis={analysis}
                onTryAgain={handleTryAgain}
                companyId={companyId}
              />
            )}
          </div>

          {/* Footer - Fixed (only show for problem state) */}
          {state === 'problem' && (
            <div
              className="flex-shrink-0 p-4 border-t"
              style={{
                background: '#0D0F1A',
                borderColor: 'rgba(108,99,255,0.2)',
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="relative">
                    <Github size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="url"
                      placeholder="https://github.com/yourusername/your-repo"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
                      style={{
                        background: 'var(--surface)',
                        border: urlError ? '1px solid #EF4444' : '1px solid var(--border)',
                        color: 'var(--text)',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent)'
                        e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.15)'
                      }}
                      onBlur={(e) => {
                        if (!urlError) {
                          e.target.style.borderColor = 'var(--border)'
                          e.target.style.boxShadow = 'none'
                        }
                      }}
                    />
                  </div>
                  {urlError && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <span>⚠</span>{urlError}
                    </p>
                  )}
                </div>

                <Button type="submit" loading={submitting} className="w-full">
                  {submitting ? loadingTexts[loadingTextIdx] : 'Analyze My Project →'}
                </Button>
              </form>
            </div>
          )}
        </motion.div>
      </>
    </AnimatePresence>
  )
}
