import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Edit2, Save, X, User, Mail, Award, FolderGit2, Map, Star } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import CompanyLogo from '../components/shared/CompanyLogo'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import api from '../api/axios'

const SKILL_BADGES = [
  { name: 'React', level: 'Intermediate', color: '#61DAFB' },
  { name: 'TypeScript', level: 'Beginner', color: '#3178C6' },
  { name: 'Node.js', level: 'Intermediate', color: '#68A063' },
  { name: 'PostgreSQL', level: 'Beginner', color: '#4169E1' },
  { name: 'Docker', level: 'Beginner', color: '#2496ED' },
  { name: 'GraphQL', level: 'Beginner', color: '#E10098' },
  { name: 'Redis', level: 'Intermediate', color: '#DC382D' },
  { name: 'Git', level: 'Intermediate', color: '#F05032' },
  { name: 'AWS Basics', level: 'Beginner', color: '#FF9900' },
  { name: 'Jest', level: 'Beginner', color: '#C21325' },
  { name: 'REST APIs', level: 'Intermediate', color: '#00D4FF' },
  { name: 'JWT Auth', level: 'Intermediate', color: '#6C63FF' },
]

const SUBMITTED_PROJECTS = [
  { id: '1', title: 'Full-Stack E-Commerce Platform', company: 'Google', sector: 'Web Development', score: 78, grade: 'B+', date: '2025-01-15' },
  { id: '2', title: 'Real-Time Chat Application', company: 'Discord', sector: 'Mobile Development', score: 85, grade: 'A-', date: '2025-01-03' },
]

const ROADMAP_HISTORY = [
  { company: 'Google', role: 'Software Engineer', sector: 'Web Development', progress: 68, domain: 'google.com' },
  { company: 'OpenAI', role: 'ML Engineer', sector: 'AI/ML', progress: 35, domain: 'openai.com' },
  { company: 'Stripe', role: 'Backend Engineer', sector: 'Web Development', progress: 12, domain: 'stripe.com' },
]

const LEVEL_STYLES = {
  Beginner: { bg: 'rgba(76,205,196,0.12)', text: '#4ECDC4', border: 'rgba(76,205,196,0.25)' },
  Intermediate: { bg: 'rgba(108,99,255,0.12)', text: '#6C63FF', border: 'rgba(108,99,255,0.25)' },
  Advanced: { bg: 'rgba(255,107,107,0.12)', text: '#FF6B6B', border: 'rgba(255,107,107,0.25)' },
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [errors, setErrors] = useState({})
  const fileRef = useRef(null)

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'SB'

  const handleSave = async () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    setErrors(e)
    if (Object.keys(e).length) return

    setSaving(true)
    try {
      await api.put('/user/profile', form)
      updateUser(form)
      setEditing(false)
      toast.success('Profile updated!')
    } catch {
      // Demo mode
      updateUser(form)
      setEditing(false)
      toast.success('Profile updated!')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setForm({ name: user?.name || '', email: user?.email || '' })
    setEditing(false)
    setErrors({})
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-4xl">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-8 mb-8 relative overflow-hidden"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 opacity-5 rounded-full -translate-y-16 translate-x-16"
            style={{ background: 'radial-gradient(circle, var(--accent), transparent)' }} />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
            {/* Avatar */}
            <div className="relative">
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center font-heading font-extrabold text-3xl text-white"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--secondary))' }}
              >
                {initials}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <Camera size={14} color="var(--text-muted)" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="space-y-3">
                  <Input
                    label="Full Name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    error={errors.name}
                    icon={<User size={15} />}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    error={errors.email}
                    icon={<Mail size={15} />}
                  />
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" onClick={handleSave} loading={saving} icon={<Save size={14} />}>
                      Save Changes
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleCancel} icon={<X size={14} />}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="font-heading font-extrabold text-2xl mb-1" style={{ color: 'var(--text)' }}>
                    {user?.name || 'Developer'}
                  </h1>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                  <Button variant="ghost" size="sm" onClick={() => setEditing(true)} icon={<Edit2 size={14} />}>
                    Edit Profile
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6 flex-shrink-0">
              {[
                { icon: Map, value: ROADMAP_HISTORY.length, label: 'Roadmaps', color: '#6C63FF' },
                { icon: FolderGit2, value: SUBMITTED_PROJECTS.length, label: 'Projects', color: '#00D4FF' },
                { icon: Award, value: SKILL_BADGES.length, label: 'Skills', color: '#4ECDC4' },
              ].map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="text-center">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-1"
                    style={{ background: `${color}15` }}>
                    <Icon size={16} color={color} />
                  </div>
                  <div className="font-heading font-bold text-xl" style={{ color: 'var(--text)' }}>{value}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-5">
            <Award size={18} color="var(--accent)" />
            <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--text)' }}>Skills Earned</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {SKILL_BADGES.map((badge, i) => {
              const styles = LEVEL_STYLES[badge.level]
              return (
                <motion.span
                  key={badge.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.04 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium"
                  style={{ background: styles.bg, color: styles.text, border: `1px solid ${styles.border}` }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: badge.color }} />
                  {badge.name}
                </motion.span>
              )
            })}
          </div>
        </motion.div>

        {/* Submitted Projects */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-6 mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-5">
            <FolderGit2 size={18} color="var(--secondary)" />
            <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--text)' }}>Submitted Projects</h2>
          </div>
          <div className="space-y-3">
            {SUBMITTED_PROJECTS.map(project => (
              <div key={project.id} className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: 'rgba(108,99,255,0.05)', border: '1px solid var(--border)' }}>
                <div>
                  <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text)' }}>{project.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {project.company} · {project.sector} · {project.date}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div>
                    <div className="font-heading font-bold text-right" style={{ color: 'var(--accent)' }}>{project.grade}</div>
                    <div className="text-xs text-right" style={{ color: 'var(--text-muted)' }}>{project.score}/100</div>
                  </div>
                  <Star size={14} fill="var(--secondary)" color="var(--secondary)" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Roadmap History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-5">
            <Map size={18} color="#4ECDC4" />
            <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--text)' }}>Roadmap History</h2>
          </div>
          <div className="space-y-3">
            {ROADMAP_HISTORY.map(roadmap => (
              <div key={roadmap.company} className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: 'rgba(108,99,255,0.04)', border: '1px solid var(--border)' }}>
                <CompanyLogo 
                  logoUrl={`https://logo.clearbit.com/${roadmap.domain}`}
                  companyName={roadmap.company}
                  size={40}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{roadmap.company}</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{roadmap.progress}%</span>
                  </div>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{roadmap.role} · {roadmap.sector}</p>
                  <div className="progress-bar h-1.5">
                    <div className="h-full rounded-full" style={{ width: `${roadmap.progress}%`, background: 'linear-gradient(90deg, var(--accent), var(--secondary))' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
