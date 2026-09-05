interface Segment {
  label: string
  value: string
  pctLabel: string
}

const segments: Segment[] = [
  { label: 'Valuable waste', value: '24.42', pctLabel: '56% of total waste' },
  { label: 'Ordinary waste', value: '20.14', pctLabel: '44% of total waste' },
]

export function PickupMetricCard() {
  return (
    <div className="flex h-[164px] w-[480px] shrink-0 flex-col gap-3 overflow-hidden rounded-lg border border-border bg-bg">
      <div className="flex flex-col gap-1 px-4 pt-4">
        <p className="text-base font-medium text-text-secondary">Total pickup's in June</p>
        <div className="flex items-end gap-1 whitespace-nowrap">
          <p className="text-[28px] font-medium leading-8 text-text-primary">54.56</p>
          <div className="flex items-end gap-1 pb-0.5 text-sm">
            <span className="text-text-tertiary">Tons</span>
            <span className="text-text-primary">based on 1653 pickup's</span>
          </div>
        </div>
      </div>
      <div className="flex w-full">
        {segments.map((s, i) => (
          <div
            key={s.label}
            className={
              'flex flex-1 flex-col gap-2 bg-bg-raised px-4 py-3' +
              (i === 0 ? ' border-r border-t border-border' : ' border-t border-border')
            }
          >
            <p className="text-sm text-text-tertiary">{s.label}</p>
            <div className="flex items-end gap-1">
              <p className="text-xl font-semibold text-text-primary">{s.value}</p>
              <div className="flex items-end gap-1 text-xs">
                <span className="text-text-tertiary">Tons</span>
                <span className="font-medium text-accent">{s.pctLabel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
