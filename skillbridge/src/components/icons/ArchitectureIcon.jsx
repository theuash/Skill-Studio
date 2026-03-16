export default function ArchitectureIcon({ size = 24, className = '' }) {
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
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <line x1="7" y1="10" x2="7" y2="14" />
      <line x1="10" y1="7" x2="14" y2="7" />
      <line x1="17" y1="10" x2="17" y2="14" />
      <line x1="10" y1="17" x2="14" y2="17" />
    </svg>
  )
}
