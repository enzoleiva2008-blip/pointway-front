export default function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <img src="/favicon.svg" alt="" className="h-8 w-8" />
      <span className={`font-display text-xl font-bold ${claro ? 'text-white' : 'text-marca-900'}`}>Pointway</span>
    </span>
  )
}
