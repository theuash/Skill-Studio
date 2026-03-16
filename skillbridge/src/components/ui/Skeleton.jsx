export function SkeletonCard() {
  return (
    <div className="rounded-2xl p-6 space-y-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="skeleton rounded-xl h-12 w-12" />
      <div className="space-y-2">
        <div className="skeleton rounded-lg h-5 w-3/4" />
        <div className="skeleton rounded-lg h-4 w-full" />
        <div className="skeleton rounded-lg h-4 w-2/3" />
      </div>
      <div className="skeleton rounded-lg h-9 w-full" />
    </div>
  )
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton rounded-lg h-4"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar({ size = 40 }) {
  return (
    <div
      className="skeleton rounded-full flex-shrink-0"
      style={{ width: size, height: size }}
    />
  )
}
