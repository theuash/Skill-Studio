import { Link } from 'react-router-dom'

export default function Logo({ size = 'md', to = '/' }) {
  const sizes = {
    sm: { icon: 20, text: 'text-lg' },
    md: { icon: 24, text: 'text-xl' },
    lg: { icon: 32, text: 'text-2xl' },
  }
  const s = sizes[size]

  return (
    <Link to={to} className="flex items-center gap-2.5 group">
      <div
        className="rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
        style={{
          width: s.icon + 16,
          height: s.icon + 16,
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        }}
      >
        <svg width={s.icon} height={s.icon} viewBox="0 0 24 24" fill="none">
          <path d="M3 6L12 2L21 6V12C21 16.5 16.5 20.5 12 22C7.5 20.5 3 16.5 3 12V6Z" stroke="white" strokeWidth="2" fill="none" />
          <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className={`font-heading font-bold ${s.text}`} style={{ color: 'var(--text)' }}>
        Skill<span className="gradient-text">Studio</span>
      </span>
    </Link>
  )
}
