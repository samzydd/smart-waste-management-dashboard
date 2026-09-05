import { wasteBreakdown } from '../../data/mock'

export function ValuableWasteCard() {
  return (
    <div className="flex h-[164px] flex-1 flex-col overflow-hidden rounded-lg border border-border bg-bg p-4">
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-base font-medium text-text-secondary">Valuable waste</p>
          <p className="text-sm text-text-secondary/80">Wastes that can be recycled</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1">
            {wasteBreakdown.map((w) => (
              <div
                key={w.label}
                className="group relative h-10 rounded-lg transition-[filter] hover:brightness-110"
                style={{ backgroundColor: w.color, flex: w.label === 'Metal' ? '1 0 0' : `0 0 ${w.pct * 3.9}px` }}
              >
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-bg-raised px-2 py-1 text-xs text-text-primary opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  {w.label} · {w.pct}%
                  <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-bg-raised" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {wasteBreakdown.map((w) => (
              <div key={w.label} className="flex items-center gap-1">
                <span className="size-3 rounded-sm" style={{ backgroundColor: w.color }} />
                <span className="whitespace-nowrap text-xs text-[#d1d1d1]">
                  {w.label} {w.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
