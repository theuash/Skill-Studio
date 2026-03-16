export default function RoadmapIcon({ size = 24, className = '' }) {
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
      <path d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2" />
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="14" y="3" width="6" height="6" rx="1" />
      <rect x="8.5" y="12" width="6" height="6" rx="1" />
      <line x1="6" y1="9" x2="17" y2="12" />
      <line x1="17" y1="9" x2="11.5" y2="12" />
    </svg>
  )
}
