import { useEffect, useRef, useState } from 'react'
import { CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import { DayPicker, type DateRange } from 'react-day-picker'
import 'react-day-picker/style.css'

const PRESETS = [
  { label: 'Today', days: 0 },
  { label: 'Last 7 days', days: 6 },
  { label: 'Last 14 days', days: 13 },
  { label: 'Last 30 days', days: 29 },
  { label: 'Custom', days: null },
] as const

function fmt(date: Date) {
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}

function rangeFromDays(days: number): DateRange {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - days)
  return { from, to }
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

export function DateRangeFilter() {
  const [preset, setPreset] = useState<string>('Last 7 days')
  const [range, setRange] = useState<DateRange>(rangeFromDays(6))
  const [presetOpen, setPresetOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const presetRef = useClickOutside(() => setPresetOpen(false))
  const calendarRef = useClickOutside(() => setCalendarOpen(false))

  function choosePreset(label: string, days: number | null) {
    setPreset(label)
    setPresetOpen(false)
    if (days !== null) {
      setRange(rangeFromDays(days))
    } else {
      setCalendarOpen(true)
    }
  }

  function chooseRange(next: DateRange | undefined) {
    if (!next) return
    setRange(next)
    setPreset('Custom')
    if (next.from && next.to) setCalendarOpen(false)
  }

  return (
    <div className="flex items-center">
      <div ref={presetRef} className="relative">
        <button
          onClick={() => {
            setPresetOpen((v) => !v)
            setCalendarOpen(false)
          }}
          className="flex items-center gap-2 rounded-l-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-white/5"
        >
          {preset}
          <ChevronDownIcon className="size-5" />
        </button>
        {presetOpen && (
          <div className="absolute left-0 top-full z-[600] mt-2 w-44 overflow-hidden rounded-lg border border-border bg-bg-raised py-1 shadow-xl">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => choosePreset(p.label, p.days)}
                className={`flex w-full items-center px-3 py-2 text-left text-sm hover:bg-white/5 ${
                  preset === p.label ? 'text-accent-soft' : 'text-text-secondary'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div ref={calendarRef} className="relative">
        <button
          onClick={() => {
            setCalendarOpen((v) => !v)
            setPresetOpen(false)
          }}
          className="flex items-center gap-2 rounded-r-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-white/5"
        >
          <CalendarIcon className="size-5" />
          <span className="flex items-center gap-1">
            {range.from ? fmt(range.from) : '—'}
            <span className="inline-block h-px w-2 bg-text-secondary" />
            {range.to ? fmt(range.to) : '—'}
          </span>
          <ChevronDownIcon className="size-5" />
        </button>
        {calendarOpen && (
          <div className="dark-daypicker absolute left-0 top-full z-[600] mt-2 w-max rounded-lg border border-border bg-bg-raised p-2 shadow-xl">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={chooseRange}
              defaultMonth={range.to}
              numberOfMonths={2}
              showOutsideDays
            />
          </div>
        )}
      </div>
    </div>
  )
}
