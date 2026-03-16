import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthLayout from '../components/layout/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email.includes('@')) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors(err => ({ ...err, [field]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      const { token, user } = res.data.data
      login(token, user)
      toast.success(`Welcome back! Sign in successful.`)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials'
      toast.error(msg)
      setErrors({ password: msg })
    } finally {
      setLoading(false)
    }
  }

  // Demo login without backend
  const handleDemoLogin = () => {
    login('demo_token_123', {
      id: 'demo',
      name: 'Alex Johnson',
      email: 'alex@skillstudio.dev',
      avatar: null,
      roadmapsStarted: 3,
      projectsSubmitted: 1,
      skillsLearned: 12,
    })
    toast.success('Demo mode activated. Explore Skill Studio!')
    navigate('/dashboard')
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your learning journey."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={handleChange('email')}
          error={errors.email}
          icon={<Mail size={16} />}
          required
          autoComplete="email"
        />
        <div>
          <Input
            label="Password"
            type="password"
            placeholder="Your password"
            value={form.password}
            onChange={handleChange('password')}
            error={errors.password}
            icon={<Lock size={16} />}
            required
            autoComplete="current-password"
          />
          <div className="flex justify-end mt-1.5">
            <a href="#" className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
              Forgot password?
            </a>
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
          Sign In
        </Button>

        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>

        <Button type="button" variant="ghost" size="lg" fullWidth onClick={handleDemoLogin}>
          Try Demo Account
        </Button>

        <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold" style={{ color: 'var(--accent)' }}>
            Create one free
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
