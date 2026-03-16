import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthLayout from '../components/layout/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import api from '../api/axios'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email.includes('@')) e.email = 'Enter a valid email'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (!/[A-Za-z]/.test(form.password)) e.password = 'Password must contain at least one letter'
    if (!/\d/.test(form.password)) e.password = 'Password must contain at least one number'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
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
      await api.post('/auth/register', { fullName: form.name, email: form.email, password: form.password, confirmPassword: form.confirmPassword })
      toast.success('OTP sent to your email!')
      navigate('/verify-otp', { state: { email: form.email } })
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      toast.error(msg)
      if (msg.toLowerCase().includes('email')) setErrors(e => ({ ...e, email: msg }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Join thousands of developers leveling up their careers.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange('name')}
          error={errors.name}
          icon={<User size={16} />}
          required
          autoComplete="name"
        />
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
        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          value={form.password}
          onChange={handleChange('password')}
          error={errors.password}
          icon={<Lock size={16} />}
          required
          autoComplete="new-password"
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat password"
          value={form.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={errors.confirmPassword}
          icon={<Lock size={16} />}
          required
          autoComplete="new-password"
        />

        <div className="flex items-start gap-2 pt-1">
          <input type="checkbox" required id="terms" className="mt-1 accent-purple-600" />
          <label htmlFor="terms" className="text-sm" style={{ color: 'var(--text-muted)' }}>
            I agree to the{' '}
            <a href="#" className="underline" style={{ color: 'var(--accent)' }}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="underline" style={{ color: 'var(--accent)' }}>Privacy Policy</a>
          </label>
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
          Create Account
        </Button>

        <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold" style={{ color: 'var(--accent)' }}>
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
