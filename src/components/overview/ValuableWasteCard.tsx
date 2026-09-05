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
                className="h-10 rounded-lg"
                style={{ backgroundColor: w.color, flex: w.label === 'Metal' ? '1 0 0' : `0 0 ${w.pct * 3.9}px` }}
              />
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
