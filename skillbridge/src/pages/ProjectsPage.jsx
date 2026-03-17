import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, Github, Zap, CheckCircle, Code2, ListChecks, Sparkles, X } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Button from '../components/ui/Button'
import BrainIcon from '../components/icons/BrainIcon'
import toast from 'react-hot-toast'
import api from '../api/axios'

const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Go',
  'Java', 'Swift', 'Kotlin', 'PostgreSQL', 'MongoDB', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'GraphQL', 'Next.js', 'Express',
  'Machine Learning', 'Data Science', 'Terraform',
  'React Native', 'Flutter', 'Rust', 'C++', 'PHP', 'Ruby',
  'MySQL', 'Firebase', 'Elasticsearch',
]

export default function ProjectsPage() {
  const [selectedSkills, setSelectedSkills] = useState([])
  const [difficulty, setDifficulty] = useState('Intermediate')
  const [generating, setGenerating] = useState(false)
  const [generatedProject, setGeneratedProject] = useState(null)
  const [repoUrl, setRepoUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [urlError, setUrlError] = useState('')
  const [showPanel, setShowPanel] = useState(false)

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill))
    } else if (selectedSkills.length < 8) {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

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

  const handleGenerate = async () => {
    if (selectedSkills.length < 2) {
      toast.error('Select at least 2 skills')
      return
    }

    setGenerating(true)
    try {
      const res = await api.post('/projects/generate-custom', {
        skills: selectedSkills.map(s => ({ name: s, level: difficulty })),
        difficulty,
      })

      if (res.data.success) {
        setGeneratedProject(res.data.data)
        setShowPanel(true)
        toast.success('Project challenge generated!')
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate project')
    } finally {
      setGenerating(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validateUrl(repoUrl)
    if (err) {
      setUrlError(err)
      return
    }

    setUrlError('')
    setSubmitting(true)

    try {
      await api.post('/projects/analyze', {
        problemId: generatedProject.problemId,
        githubUrl: repoUrl,
        skills: selectedSkills.map(s => ({ name: s, level: difficulty })),
        problemStatement: {
          title: generatedProject.title,
          description: generatedProject.description,
          acceptanceCriteria: generatedProject.acceptanceCriteria,
        },
      })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed')
      setSubmitting(false)
      return
    }

    setSubmitting(false)
    setAnalyzing(true)

    setTimeout(() => {
      setAnalyzing(false)
      toast.success('Analysis complete! Your report is ready.')
      setShowPanel(false)
      setGeneratedProject(null)
    }, 3500)
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-heading font-extrabold text-3xl mb-2" style={{ color: 'var(--text)' }}>
            🎯 Generate a Custom Project Challenge
          </h1>
          <p className="text-base" style={{ color: 'var(--text-muted)' }}>
            Select the skills you want to practice and our AI will create a tailored project for you
          </p>
        </motion.div>

        {/* Generator Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(108,99,255,0.08), rgba(0,212,255,0.05))',
            border: '1px solid rgba(108,99,255,0.2)',
          }}
        >
          {/* Skill Selector */}
          <div className="mb-8">
            <label className="block font-heading font-bold text-base mb-1" style={{ color: 'var(--text)' }}>
              Select Skills to Practice
            </label>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              Choose multiple skills (min 2, max 8)
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {COMMON_SKILLS.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: selectedSkills.includes(skill)
                      ? 'linear-gradient(135deg, rgba(108,99,255,0.3), rgba(0,212,255,0.2))'
                      : 'var(--surface)',
                    border: selectedSkills.includes(skill)
                      ? '1px solid rgba(108,99,255,0.5)'
                      : '1px solid var(--border)',
                    color: selectedSkills.includes(skill)
                      ? 'var(--accent)'
                      : 'var(--text-muted)',
                  }}
                >
                  {selectedSkills.includes(skill) && (
                    <span className="mr-2">✓</span>
                  )}
                  {skill}
                </button>
              ))}
            </div>

            <div className="text-sm mb-6"
              style={{
                color: selectedSkills.length < 2
                  ? 'var(--text-muted)'
                  : selectedSkills.length > 8
                    ? '#EF5350'
                    : 'var(--text-muted)',
              }}>
              {selectedSkills.length === 0 && 'No skills selected'}
              {selectedSkills.length === 1 && 'Select at least 2 skills'}
              {selectedSkills.length >= 2 && selectedSkills.length <= 8 && `${selectedSkills.length} skills selected`}
              {selectedSkills.length > 8 && `Maximum 8 skills allowed`}
            </div>
          </div>

          {/* Difficulty Selector */}
          <div className="mb-8">
            <label className="block font-heading font-bold text-base mb-3" style={{ color: 'var(--text)' }}>
              Difficulty Level
            </label>
            <div className="flex gap-3">
              {[
                { level: 'Beginner', icon: '🟢' },
                { level: 'Intermediate', icon: '🟡' },
                { level: 'Advanced', icon: '🔴' },
              ].map(({ level, icon }) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all"
                  style={{
                    background: difficulty === level
                      ? 'linear-gradient(135deg, rgba(108,99,255,0.3), rgba(0,212,255,0.2))'
                      : 'var(--surface)',
                    border: difficulty === level
                      ? '1px solid rgba(108,99,255,0.5)'
                      : '1px solid var(--border)',
                    color: difficulty === level
                      ? 'var(--accent)'
                      : 'var(--text-muted)',
                  }}
                >
                  <span>{icon}</span>
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={selectedSkills.length < 2 || generating}
            className="w-full py-3 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2"
            style={{
              background: selectedSkills.length >= 2
                ? 'linear-gradient(135deg, var(--accent), rgba(0,212,255,0.8))'
                : 'rgba(108,99,255,0.2)',
              color: selectedSkills.length >= 2 ? 'white' : 'var(--text-muted)',
              cursor: selectedSkills.length >= 2 ? 'pointer' : 'not-allowed',
            }}
          >
            {generating ? (
              <>
                <Zap size={18} className="animate-spin" />
                🤖 Creating your challenge...
              </>
            ) : (
              <>
                ✨ Generate Project Challenge →
              </>
            )}
          </button>
        </motion.div>
      </div>

      {/* Slide-out Panel */}
      <AnimatePresence>
        {showPanel && generatedProject && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPanel(false)}
              className="fixed inset-0"
              style={{
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                zIndex: 999,
              }}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: 600 }}
              animate={{ x: 0 }}
              exit={{ x: 600 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full md:w-[600px] flex flex-col"
              style={{
                background: '#0D0F1A',
                borderLeft: '1px solid rgba(108,99,255,0.2)',
                boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.6)',
                overflowY: 'auto',
                zIndex: 1000,
              }}
            >
              {/* Header */}
              <div
                className="flex-shrink-0 px-6 py-5 border-b flex items-center justify-between"
                style={{
                  borderColor: 'rgba(108,99,255,0.2)',
                  background: '#0D0F1A',
                }}
              >
                <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--text)' }}>
                  Project Challenge
                </h2>
                <button
                  onClick={() => setShowPanel(false)}
                  className="p-1.5 rounded-lg transition-all"
                  style={{
                    background: 'rgba(108,99,255,0.1)',
                    color: 'var(--text-muted)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(108,99,255,0.1)'}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6" style={{ background: '#0D0F1A' }}>
                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5"
                    style={{ background: 'rgba(108,99,255,0.12)', color: 'var(--accent)', border: '1px solid rgba(108,99,255,0.25)' }}>
                    <BrainIcon size={13} />
                    AI Generated
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full"
                    style={{ background: 'rgba(255,107,107,0.1)', color: '#FF6B6B', border: '1px solid rgba(255,107,107,0.25)' }}>
                    ⏱ {generatedProject.estimatedTime}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full"
                    style={{ background: 'rgba(76,205,196,0.1)', color: '#4ECDC4', border: '1px solid rgba(76,205,196,0.25)' }}>
                    {generatedProject.difficulty}
                  </span>
                </div>

                {/* Title and Description */}
                <div>
                  <h3 className="font-heading font-extrabold text-xl mb-2" style={{ color: 'var(--text)' }}>
                    {generatedProject.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {generatedProject.description}
                  </p>
                </div>

                {/* Tech Stack and Bonus Features */}
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="p-4 rounded-xl"
                    style={{ background: 'rgba(108,99,255,0.05)', border: '1px solid rgba(108,99,255,0.15)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Code2 size={16} style={{ color: 'var(--accent)' }} />
                      <h4 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Tech Stack</h4>
                    </div>
                    <div className="space-y-2">
                      {generatedProject.techStack?.slice(0, 4).map(tech => (
                        <div key={tech} className="text-xs px-2 py-1 rounded bg-opacity-50"
                          style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--accent)' }}>
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="p-4 rounded-xl"
                    style={{ background: 'rgba(76,205,196,0.05)', border: '1px solid rgba(76,205,196,0.15)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={16} style={{ color: '#4ECDC4' }} />
                      <h4 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Bonus</h4>
                    </div>
                    <ul className="space-y-2">
                      {generatedProject.bonusFeatures?.slice(0, 2).map((feat, i) => (
                        <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--text-muted)' }}>
                          <span style={{ color: '#4ECDC4' }}>✦</span>
                          <span className="line-clamp-2">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Acceptance Criteria */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ListChecks size={16} style={{ color: '#4ECDC4' }} />
                    <h4 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Acceptance Criteria</h4>
                  </div>
                  <ol className="space-y-2 ml-6">
                    {generatedProject.acceptanceCriteria?.map((crit, i) => (
                      <li key={i} className="text-sm list-decimal" style={{ color: 'var(--text-muted)' }}>
                        {crit}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Submit Section */}
                <div
                  className="p-4 rounded-xl mt-6"
                  style={{
                    background: 'linear-gradient(135deg, rgba(108,99,255,0.08), rgba(0,212,255,0.05))',
                    border: '1px solid rgba(108,99,255,0.2)',
                  }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Github size={16} style={{ color: 'var(--text)' }} />
                    <h4 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Submit Your Project</h4>
                  </div>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                    Push your code to GitHub and paste the URL below for AI analysis.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="url"
                            placeholder="https://github.com/user/repo"
                            value={repoUrl}
                            onChange={e => { setRepoUrl(e.target.value); setUrlError('') }}
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                            style={{
                              background: 'rgba(255,255,255,0.05)',
                              border: urlError ? '1px solid #EF4444' : '1px solid rgba(108,99,255,0.2)',
                              color: 'var(--text)',
                            }}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2"
                          style={{
                            background: 'linear-gradient(135deg, var(--accent), rgba(0,212,255,0.8))',
                            color: 'white',
                            cursor: submitting ? 'not-allowed' : 'pointer',
                            opacity: submitting ? 0.7 : 1,
                          }}
                        >
                          {submitting ? (
                            <>
                              <Zap size={14} className="animate-spin" />
                            </>
                          ) : (
                            <Send size={14} />
                          )}
                        </button>
                      </div>
                      {urlError && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><span>⚠</span>{urlError}</p>}
                    </div>
                  </form>
                </div>

                {/* Regenerate Button */}
                <button
                  onClick={() => setShowPanel(false)}
                  className="w-full py-2.5 rounded-lg font-medium text-sm transition-all"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(108,99,255,0.2)',
                    color: 'var(--text-muted)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  ← Generate Another
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
