export default function StatCard({ label, value, icon }) {
  return (
    <div className="bg-navy-light border border-navy-lighter rounded-xl p-5 flex items-center gap-4 hover:border-accent/50 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-2xl">
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold text-accent">{value}</p>
        <p className="text-sm text-slate-400 mt-0.5">{label}</p>
      </div>
    </div>
  )
}
