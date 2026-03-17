export default function CompanyIcon({ size = 24, className = '' }) {
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
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      <line x1="6" y1="11" x2="6" y2="15" />
      <line x1="10" y1="11" x2="10" y2="15" />
      <line x1="14" y1="11" x2="14" y2="15" />
      <line x1="18" y1="11" x2="18" y2="15" />
    </svg>
  )
}
