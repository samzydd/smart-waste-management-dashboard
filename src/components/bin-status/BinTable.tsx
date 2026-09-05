import { useEffect, useMemo, useRef, useState } from 'react'
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

type SortKey = 'status' | 'area' | 'weight'
type ShowKey = 'all' | BinFillReport

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'status', label: 'Status' },
  { value: 'area', label: 'Province/Area' },
  { value: 'weight', label: 'Est. Weight' },
]

const SHOW_OPTIONS: { value: ShowKey; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'filled', label: 'Filled' },
  { value: 'almost-filled', label: 'Almost filled' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'emptied', label: 'Emptied' },
]

const STATUS_ORDER: Record<BinFillReport, number> = {
  filled: 0,
  'in-progress': 1,
  'almost-filled': 2,
  emptied: 3,
}

function useClickOutside(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onOutside])
  return ref
}

interface FilterPillProps<T extends string> {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}

function FilterPill<T extends string>({ label, value, options, onChange }: FilterPillProps<T>) {
  const [open, setOpen] = useState(false)
  const ref = useClickOutside(() => setOpen(false))
  const current = options.find((o) => o.value === value)

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-text-secondary">{label}</span>
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg border border-border bg-bg px-2 py-1 text-sm text-white hover:bg-white/5"
        >
          {current?.label ?? value}
          <ChevronDownIcon className="size-4" />
        </button>
        {open && (
          <div className="absolute left-0 top-full z-[600] mt-2 w-44 overflow-hidden rounded-lg border border-border bg-bg-raised py-1 shadow-xl">
            {options.map((o) => (
              <button
                key={o.value}
                onClick={() => {
                  onChange(o.value)
                  setOpen(false)
                }}
                className={`flex w-full items-center px-3 py-2 text-left text-sm hover:bg-white/5 ${
                  o.value === value ? 'text-accent-soft' : 'text-text-secondary'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function BinTable() {
  const [sortBy, setSortBy] = useState<SortKey>('status')
  const [show, setShow] = useState<ShowKey>('all')

  const visibleRecords = useMemo(() => {
    const filtered = show === 'all' ? binRecords : binRecords.filter((r) => r.report === show)
    const sorted = [...filtered]
    if (sortBy === 'status') {
      sorted.sort((a, b) => STATUS_ORDER[a.report] - STATUS_ORDER[b.report])
    } else if (sortBy === 'area') {
      sorted.sort((a, b) => a.area.localeCompare(b.area))
    } else if (sortBy === 'weight') {
      sorted.sort((a, b) => (parseInt(b.estWeight) || -1) - (parseInt(a.estWeight) || -1))
    }
    return sorted
  }, [sortBy, show])

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col items-start overflow-hidden rounded-t-xl border border-border bg-bg">
      <div className="flex w-full shrink-0 items-center gap-6 border-b border-border bg-black/25 p-4">
        <FilterPill label="Sort by" value={sortBy} options={SORT_OPTIONS} onChange={setSortBy} />
        <FilterPill label="Show" value={show} options={SHOW_OPTIONS} onChange={setShow} />
        {visibleRecords.length !== binRecords.length && (
          <span className="text-sm text-text-tertiary">
            {visibleRecords.length} of {binRecords.length}
          </span>
        )}
      </div>

      <div className="min-h-0 w-full flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 flex w-full items-center justify-between border-b border-border bg-bg pb-0.5 pt-2">
          {columns.map((c) => (
            <div key={c.key} className={`flex items-center px-3 py-1.5 ${c.width}`}>
              <p className="whitespace-nowrap text-sm font-medium text-text-muted">{c.label}</p>
            </div>
          ))}
        </div>

        {visibleRecords.length === 0 && (
          <div className="flex w-full items-center justify-center py-12">
            <p className="text-sm text-text-tertiary">No bins match this filter.</p>
          </div>
        )}

        {visibleRecords.map((record) => (
          <div
            key={record.id}
            className="flex w-full items-center justify-between border-t border-border bg-bg transition-colors hover:bg-[#171717]"
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
    </div>
  )
}
