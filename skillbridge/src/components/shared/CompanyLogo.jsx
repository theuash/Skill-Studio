import { useState } from 'react'

const CompanyLogo = ({ logoUrl, companyName, size = 56 }) => {
  const [imgError, setImgError] = useState(false)
  const initial = companyName?.charAt(0).toUpperCase() || '?'

  // Generate consistent gradient color from company name
  const colors = [
    ['#6C4BFF', '#1DB97C'],
    ['#FF6B6B', '#FFE66D'],
    ['#4ECDC4', '#6C4BFF'],
    ['#FF8C00', '#FF6B6B'],
    ['#1DB97C', '#4ECDC4'],
  ]
  const colorIndex = companyName
    ? companyName.charCodeAt(0) % colors.length
    : 0
  const [from, to] = colors[colorIndex]

  if (logoUrl && !imgError) {
    return (
      <div style={{
        width: size,
        height: size,
        borderRadius: size * 0.25,
        overflow: 'hidden',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        border: '1px solid var(--glass-border)',
        padding: 6,
        boxSizing: 'border-box',
      }}>
        <img
          src={logoUrl}
          alt={companyName}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>
    )
  }

  // Fallback: gradient circle with initial
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: size * 0.25,
      background: `linear-gradient(135deg, ${from}, ${to})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.4,
      fontWeight: 700,
      color: 'white',
      flexShrink: 0,
    }}>
      {initial}
    </div>
  )
}

export default CompanyLogo
