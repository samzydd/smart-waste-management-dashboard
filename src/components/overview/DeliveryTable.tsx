import { ChevronDown } from 'lucide-react'
import { deliveries } from '../../data/mock'
import type { Delivery } from '../../types'

const statusStyles: Record<Delivery['status'], { label: string; dot: string }> = {
  picked: { label: 'Picked', dot: 'bg-status-empty' },
  'en-route': { label: 'En route', dot: 'bg-[#347efb]' },
  'in-progress': { label: 'In progress', dot: 'bg-status-filled' },
}

const gradeStyles: Record<Delivery['grade'], string> = {
  A: 'bg-status-green',
  B: 'bg-status-amber',
  C: 'bg-[#8b1e1e]',
}

const columns = [
  { key: 'orderNo', label: 'Delivery/Order No.', width: 'w-[200px] pl-4' },
  { key: 'site', label: 'Site', width: 'w-[330px]' },
  { key: 'status', label: 'Status', width: 'w-36' },
  { key: 'estWeight', label: 'Est. Weight', width: 'w-[110px]' },
  { key: 'grade', label: 'Grade', width: 'w-[73px] justify-center' },
  { key: 'departure', label: 'Departure', width: 'flex-1' },
  { key: 'eta', label: 'ETA', width: 'flex-1' },
]

function FilterPill({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-text-secondary">{label}</span>
      <button className="flex items-center gap-2 rounded-lg border border-border bg-bg px-2 py-1 text-sm text-white">
        {label === 'Sort by' ? 'Status' : 'All'}
        <ChevronDown size={16} />
      </button>
    </div>
  )
}

export function DeliveryTable() {
  return (
    <div className="flex w-full flex-col items-start overflow-hidden rounded-b-lg border border-t-0 border-border bg-bg">
      <div className="flex w-full items-center gap-6 bg-black/25 p-4">
        <FilterPill label="Sort by" />
        <FilterPill label="Show" />
      </div>

      <div className="flex w-full items-center justify-between border-b border-border pb-0.5 pt-2">
        {columns.map((c) => (
          <div key={c.key} className={`flex items-center px-3 py-1.5 ${c.width}`}>
            <p className="whitespace-nowrap text-sm font-medium text-text-muted">{c.label}</p>
          </div>
        ))}
      </div>

      {deliveries.map((d) => (
        <div key={d.orderNo} className="flex w-full items-center justify-between border-b border-border">
          <div className="flex h-[54px] w-[200px] items-center py-1.5 pl-4 pr-3">
            <p className="whitespace-nowrap text-sm text-text-body">{d.orderNo}</p>
          </div>
          <div className="flex h-[54px] w-[330px] items-center px-3 py-1.5">
            <p className="truncate text-sm text-text-body">{d.site}</p>
          </div>
          <div className="flex h-[54px] w-36 items-center px-3 py-1.5">
            <span className="flex items-center gap-1 text-sm text-text-body">
              <span className={`size-2 rounded-full ${statusStyles[d.status].dot}`} />
              {statusStyles[d.status].label}
            </span>
          </div>
          <div className="flex h-[54px] w-[110px] items-center px-3 py-1.5">
            <p className="text-sm text-text-body">{d.estWeight}</p>
          </div>
          <div className="flex h-[54px] w-[73px] items-center justify-center px-3 py-1.5">
            <span className={`flex size-7 items-center justify-center rounded-full text-sm text-white ${gradeStyles[d.grade]}`}>
              {d.grade}
            </span>
          </div>
          <div className="flex h-[54px] flex-1 items-center px-3 py-1.5">
            <p className="whitespace-nowrap text-sm text-text-body">{d.departure}</p>
          </div>
          <div className="flex h-[54px] flex-1 items-center px-3 py-1.5">
            <p className="whitespace-nowrap text-sm text-text-body">{d.eta}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
