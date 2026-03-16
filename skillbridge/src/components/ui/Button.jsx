import { motion } from 'framer-motion'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  icon,
  fullWidth = false,
}) {
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
      color: 'white',
      border: 'none',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--accent)',
      border: '1px solid var(--accent)',
    },
    ghost: {
      background: 'rgba(108,99,255,0.08)',
      color: 'var(--text)',
      border: '1px solid var(--border)',
    },
    danger: {
      background: 'rgba(239,68,68,0.1)',
      color: '#EF4444',
      border: '1px solid rgba(239,68,68,0.3)',
    },
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.03, y: -2 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`font-medium rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm
        ${sizes[size]} ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md'}
        ${className}`}
      style={variants[variant]}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  )
}
