export default function SkeletonCard() {
  return (
    <div className="bg-navy-light border border-navy-lighter rounded-xl p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-navy-lighter animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-8 w-20 bg-navy-lighter rounded animate-pulse" />
        <div className="h-3 w-36 bg-navy-lighter rounded animate-pulse" />
      </div>
    </div>
  )
}
