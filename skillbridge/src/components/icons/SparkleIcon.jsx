export default function SparkleIcon({ size = 24, className = '' }) {
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
      <path d="M12 3v6m0 6v6" />
      <path d="M3 12h6m6 0h6" />
      <path d="M5.64 5.64l4.24 4.24M18.36 5.64l-4.24 4.24" />
      <path d="M5.64 18.36l4.24-4.24M18.36 18.36l-4.24-4.24" />
    </svg>
  )
}
