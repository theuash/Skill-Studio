import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import AuthLayout from '../components/layout/AuthLayout'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function VerifyOtpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const email = location.state?.email || ''

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const refs = useRef([])

  useEffect(() => {
    refs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (timer <= 0) return
    const id = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [timer])

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[idx] = val
    setOtp(next)
    if (val && idx < 5) refs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      refs.current[idx - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && idx > 0) refs.current[idx - 1]?.focus()
    if (e.key === 'ArrowRight' && idx < 5) refs.current[idx + 1]?.focus()
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length) {
      const next = [...pasted.split(''), ...Array(6).fill('')].slice(0, 6)
      setOtp(next)
      refs.current[Math.min(pasted.length, 5)]?.focus()
      e.preventDefault()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) { toast.error('Enter all 6 digits'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/verify-otp', { email, otp: code })
      const { token, user } = res.data.data
      login(token, user)
      toast.success('Email verified! Welcome aboard 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP')
      setOtp(['', '', '', '', '', ''])
      refs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    try {
      await api.post('/auth/register', { email, resend: true })
      toast.success('New OTP sent!')
      setTimer(60)
      setOtp(['', '', '', '', '', ''])
      refs.current[0]?.focus()
    } catch {
      toast.error('Failed to resend OTP')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`We sent a 6-digit code to ${email || 'your email'}. Enter it below.`}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3 justify-center mb-8" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <motion.input
              key={idx}
              ref={el => refs.current[idx] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(idx, e.target.value)}
              onKeyDown={e => handleKeyDown(idx, e)}
              className="otp-input"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.07 }}
            />
          ))}
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
          Verify Email
        </Button>

        <div className="text-center mt-6">
          {timer > 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Resend code in{' '}
              <span className="font-semibold tabular-nums" style={{ color: 'var(--accent)' }}>
                {String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              className="text-sm font-semibold"
              style={{ color: 'var(--accent)' }}
            >
              {resendLoading ? 'Sending...' : 'Resend OTP'}
            </button>
          )}
        </div>

        <p className="text-center text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
          Wrong email?{' '}
          <Link to="/register" className="font-semibold" style={{ color: 'var(--accent)' }}>
            Go back
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
