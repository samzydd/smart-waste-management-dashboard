import { Calendar, ChevronDown } from 'lucide-react'

export function DateRangeFilter() {
  return (
    <div className="flex items-center">
      <button className="flex items-center gap-2 rounded-l-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary">
        Last 7 days
        <ChevronDown size={20} />
      </button>
      <button className="flex items-center gap-2 rounded-r-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary">
        <Calendar size={20} />
        <span className="flex items-center gap-1">
          3 Jun <span className="inline-block h-px w-2 bg-text-secondary" /> 10 Jun
        </span>
        <ChevronDown size={20} />
      </button>
    </div>
  )
}
