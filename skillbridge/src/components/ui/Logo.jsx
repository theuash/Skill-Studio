import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Logo({ size = 'md', to = '/' }) {
  const [logoError, setLogoError] = useState(false)
  
  const sizes = {
    sm: 40,
    md: 48,
    lg: 64,
  }
  const logoSize = sizes[size]

  return (
    <Link to={to} className="flex items-center gap-2.5 group">
      {!logoError && (
        <img
          src="/assets/logo.png"
          alt="SkillStudio Logo"
          onError={() => setLogoError(true)}
          className="flex-shrink-0 transition-transform group-hover:scale-105 rounded-xl"
          style={{
            width: logoSize,
            height: logoSize,
            objectFit: 'contain',
          }}
        />
      )}
      {logoError && (
        <div
          className="flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 rounded-xl font-heading font-bold text-white"
          style={{
            width: logoSize,
            height: logoSize,
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          }}
        >
          SS
        </div>
      )}
      <span className={`font-heading font-bold ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'}`} style={{ color: 'var(--text)' }}>
        Skill<span className="gradient-text">Studio</span>
      </span>
    </Link>
  )
}
