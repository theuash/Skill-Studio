export default function PerformanceIcon({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="21 8 21 21 3 21 3 8" />
      <line x1="1" y1="3" x2="23" y2="3" />
      <path d="M10 12v5" />
      <path d="M14 12v5" />
      <path d="M6 8v3" />
      <path d="M18 8v3" />
    </svg>
  )
}
