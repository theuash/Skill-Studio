import { Link } from 'react-router-dom'

export default function Logo({ size = 'md', to = '/' }) {
  const sizes = {
    sm: 40,
    md: 48,
    lg: 64,
  }
  const logoSize = sizes[size]

  return (
    <Link to={to} className="flex items-center gap-2.5 group">
      <img
        src="/assets/logo.png"
        alt="SkillBridge Logo"
        className="flex-shrink-0 transition-transform group-hover:scale-105 rounded-xl"
        style={{
          width: logoSize,
          height: logoSize,
          objectFit: 'contain',
        }}
      />
      <span className={`font-heading font-bold ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'}`} style={{ color: 'var(--text)' }}>
        Skill<span className="gradient-text">Studio</span>
      </span>
    </Link>
  )
}
