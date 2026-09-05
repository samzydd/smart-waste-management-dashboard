import { ChevronDownIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid'
import { binRecords } from '../../data/mock'
import type { BinFillReport } from '../../types'

const reportStyles: Record<BinFillReport, { label: string; dot: string }> = {
  filled: { label: 'Filled', dot: 'bg-[#f55540]' },
  'almost-filled': { label: 'Almost filled', dot: 'bg-status-filled' },
  emptied: { label: 'Emptied', dot: 'bg-status-empty' },
  'in-progress': { label: 'In progress', dot: 'bg-[#347efb]' },
}

const columns = [
  { key: 'area', label: 'Province/Area', width: 'w-[330px] pl-4' },
  { key: 'report', label: 'IoT Report', width: 'w-36' },
  { key: 'estWeight', label: 'Est. Weight', width: 'w-[110px] justify-center' },
  { key: 'truck', label: 'Truck Assigned', width: 'w-[200px]' },
  { key: 'departure', label: 'Est. Departure', width: 'flex-1' },
  { key: 'eta', label: 'ETA', width: 'flex-1' },
  { key: 'menu', label: '', width: 'w-11' },
]

function FilterPill({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-text-secondary">{label}</span>
      <button className="flex items-center gap-2 rounded-lg border border-border bg-bg px-2 py-1 text-sm text-white">
        {label === 'Sort by' ? 'Status' : 'All'}
        <ChevronDownIcon className="size-4" />
      </button>
    </div>
  )
}

export function BinTable() {
  return (
    <div className="flex w-full flex-col items-start overflow-hidden rounded-t-xl border border-border bg-bg">
      <div className="flex w-full items-center gap-6 border-b border-border bg-black/25 p-4">
        <FilterPill label="Sort by" />
        <FilterPill label="Show" />
      </div>

      <div className="flex w-full items-center justify-between pb-0.5 pt-2">
        {columns.map((c) => (
          <div key={c.key} className={`flex items-center px-3 py-1.5 ${c.width}`}>
            <p className="whitespace-nowrap text-sm font-medium text-text-muted">{c.label}</p>
          </div>
        ))}
      </div>

      {binRecords.map((record, i) => (
        <div
          key={record.id}
          className={`flex w-full items-center justify-between border-t border-border transition-colors hover:bg-[#171717] ${
            i % 5 === 2 ? 'bg-bg-raised' : ''
          }`}
        >
          <div className="flex h-[54px] w-[330px] items-center pl-4 pr-3 py-1.5">
            <p className="truncate text-sm text-text-body">{record.area}</p>
          </div>
          <div className="flex h-[54px] w-36 items-center px-3 py-1.5">
            <span className="flex items-center gap-1 text-sm text-text-body">
              <span className={`size-2 rounded-full ${reportStyles[record.report].dot}`} />
              {reportStyles[record.report].label}
            </span>
          </div>
          <div className="flex h-[54px] w-[110px] items-center justify-center px-3 py-1.5">
            <p className="text-sm text-text-body">{record.estWeight}</p>
          </div>
          <div className="flex h-[54px] w-[200px] items-center px-3 py-1.5">
            <p className="whitespace-nowrap text-sm text-text-body">{record.truckAssigned}</p>
          </div>
          <div className="flex h-[54px] flex-1 items-center px-3 py-1.5">
            <p className="whitespace-nowrap text-sm text-text-body">{record.departure}</p>
          </div>
          <div className="flex h-[54px] flex-1 items-center px-3 py-1.5">
            <p className="whitespace-nowrap text-sm text-text-body">{record.eta}</p>
          </div>
          <div className="flex h-[54px] w-11 items-center justify-center px-3 py-1.5">
            <button className="flex items-center justify-center rounded-md p-1 text-text-tertiary hover:bg-white/10 hover:text-text-secondary">
              <EllipsisVerticalIcon className="size-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
