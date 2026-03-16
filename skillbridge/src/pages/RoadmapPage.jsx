import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Circle, ChevronDown, ChevronUp, Youtube, FileText, Clock, Zap, X } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Button from '../components/ui/Button'
import { ROADMAP_NODES, COMPANIES } from '../utils/data'
import toast from 'react-hot-toast'

const DIFFICULTY_COLORS = {
  Beginner: { bg: 'rgba(76,205,196,0.15)', text: '#4ECDC4', border: 'rgba(76,205,196,0.4)', dot: '#4ECDC4' },
  Intermediate: { bg: 'rgba(108,99,255,0.15)', text: '#6C63FF', border: 'rgba(108,99,255,0.4)', dot: '#6C63FF' },
  Advanced: { bg: 'rgba(255,107,107,0.15)', text: '#FF6B6B', border: 'rgba(255,107,107,0.4)', dot: '#FF6B6B' },
}

function NodeCard({ node, index, checked, onToggle, expanded, onToggleExpand }) {
  const colors = DIFFICULTY_COLORS[node.difficulty]
  const isChecked = checked

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Connector line */}
      {index > 0 && (
        <div className="absolute -top-6 left-7 w-0.5 h-6"
          style={{ background: isChecked ? '#4ECDC4' : 'var(--border)' }} />
      )}

      <div
        className="rounded-2xl overflow-hidden transition-all cursor-pointer"
        style={{
          background: 'var(--surface)',
          border: `1px solid ${isChecked ? '#4ECDC430' : 'var(--border)'}`,
          boxShadow: isChecked ? '0 0 20px rgba(76,205,196,0.1)' : 'none',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-4 p-5"
          onClick={() => onToggleExpand(node.id)}
        >
          {/* Step number & check */}
          <div className="relative flex-shrink-0">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-heading font-bold text-lg"
              style={{
                background: isChecked ? 'rgba(76,205,196,0.15)' : colors.bg,
                border: `1px solid ${isChecked ? '#4ECDC440' : colors.border}`,
                color: isChecked ? '#4ECDC4' : colors.text,
              }}
            >
              {isChecked ? <CheckCircle2 size={24} /> : index + 1}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-heading font-bold text-base ${isChecked ? 'line-through opacity-60' : ''}`}
                style={{ color: 'var(--text)' }}>
                {node.title}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
                {node.difficulty}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Clock size={11} />
                {node.time}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {node.subtopics.length} subtopics
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={e => { e.stopPropagation(); onToggle(node.id) }}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
              style={{
                background: isChecked ? 'rgba(76,205,196,0.15)' : 'rgba(108,99,255,0.1)',
                color: isChecked ? '#4ECDC4' : 'var(--accent)',
                border: `1px solid ${isChecked ? 'rgba(76,205,196,0.3)' : 'rgba(108,99,255,0.25)'}`,
              }}
            >
              {isChecked ? '✓ Known' : 'Mark Known'}
            </button>
            {expanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
          </div>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <div className="p-5 space-y-4">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {node.description}
                </p>

                {/* Subtopics */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                    Topics Covered
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {node.subtopics.map(t => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(108,99,255,0.08)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                    Free Resources
                  </h4>
                  <div className="space-y-2">
                    {node.resources.map((url, ri) => (
                      <a key={ri} href={url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 text-sm hover:underline"
                        style={{ color: 'var(--accent)' }}>
                        {url.includes('youtube') ? <Youtube size={14} /> : <FileText size={14} />}
                        {url.includes('youtube') ? 'Watch on YouTube' : 'Official Documentation'}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function RoadmapPage() {
  const { companyId, jobRole } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [nodes, setNodes] = useState([])
  const [checked, setChecked] = useState(new Set())
  const [expanded, setExpanded] = useState(null)
  const [company, setCompany] = useState(null)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const nodeData = ROADMAP_NODES['web-development'] || []
      setNodes(nodeData)
      // Find company across all sectors
      let found = null
      Object.values(COMPANIES).forEach(sector => {
        const c = sector.find(c => c.id === companyId)
        if (c) found = c
      })
      setCompany(found || { id: companyId, name: companyId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), domain: companyId + '.com', skills: [] })
      setLoading(false)
    }, 900)
  }, [companyId, jobRole])

  const toggleCheck = (id) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleExpand = (id) => setExpanded(prev => prev === id ? null : id)

  const progress = nodes.length ? Math.round((checked.size / nodes.length) * 100) : 0
  const readyForProject = progress >= 70

  const jobTitle = jobRole?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Software Engineer'

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm mb-6"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ArrowLeft size={16} /> Back
        </button>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <div className="flex gap-8 items-start">
            {/* Main roadmap */}
            <div className="flex-1 min-w-0">
              {/* Progress bar */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-5 rounded-2xl"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-heading font-bold text-sm" style={{ color: 'var(--text)' }}>
                    Your Progress
                  </span>
                  <span className="font-heading font-extrabold text-2xl gradient-text">
                    {progress}%
                  </span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                  {checked.size} of {nodes.length} topics marked as known
                  {readyForProject && ' — You\'re ready for a project!'}
                </p>
              </motion.div>

              {/* Nodes */}
              <div className="space-y-6">
                {nodes.map((node, i) => (
                  <NodeCard
                    key={node.id}
                    node={node}
                    index={i}
                    checked={checked.has(node.id)}
                    onToggle={toggleCheck}
                    expanded={expanded === node.id}
                    onToggleExpand={toggleExpand}
                  />
                ))}
              </div>

              {/* Project CTA */}
              <AnimatePresence>
                {readyForProject && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mt-8 p-6 rounded-2xl text-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(0,212,255,0.1))',
                      border: '1px solid rgba(108,99,255,0.3)',
                    }}
                  >
                    <Zap size={32} color="var(--accent)" className="mx-auto mb-3" />
                    <h3 className="font-heading font-bold text-xl mb-2" style={{ color: 'var(--text)' }}>
                      You're Ready for a Project!
                    </h3>
                    <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
                      You've marked {progress}% of skills as known. Time to prove it with a real project.
                    </p>
                    <Link to={`/project/${companyId}-${jobRole}`}>
                      <Button variant="primary" size="lg" icon={<Zap size={16} />}>
                        Get My Project Brief
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block w-72 flex-shrink-0 space-y-4">
              {/* Company info */}
              <div className="p-5 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center"
                    style={{ background: 'rgba(108,99,255,0.08)' }}>
                    <img src={`https://logo.clearbit.com/${company?.domain}`} alt={company?.name}
                      className="w-8 h-8 object-contain"
                      onError={e => { e.target.style.display = 'none' }} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm" style={{ color: 'var(--text)' }}>{company?.name}</h4>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{jobTitle}</p>
                  </div>
                </div>

                <h5 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                  Required Skills
                </h5>
                <div className="flex flex-wrap gap-2">
                  {(company?.skills || []).map((skill, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--accent)', border: '1px solid rgba(108,99,255,0.2)' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress stats */}
              <div className="p-5 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <h5 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
                  Checklist Summary
                </h5>
                <div className="space-y-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map(level => {
                    const total = nodes.filter(n => n.difficulty === level).length
                    const done = nodes.filter(n => n.difficulty === level && checked.has(n.id)).length
                    const colors = DIFFICULTY_COLORS[level]
                    return (
                      <div key={level}>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: colors.text }}>{level}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{done}/{total}</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: total ? `${(done / total) * 100}%` : '0%', background: colors.dot }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* CTA button */}
              {!readyForProject && (
                <div className="p-4 rounded-2xl text-center text-sm"
                  style={{ background: 'rgba(108,99,255,0.06)', border: '1px dashed rgba(108,99,255,0.25)' }}>
                  <p style={{ color: 'var(--text-muted)' }}>
                    Mark <strong style={{ color: 'var(--accent)' }}>{Math.ceil(nodes.length * 0.7) - checked.size} more</strong> skills to unlock your project brief
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
