import { useEffect, useRef, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { drivers } from '../../data/mock'

interface Driver {
  name: string
  avatar: string
}

interface DriverPickerProps {
  initialDriver: Driver
}

export function DriverPicker({ initialDriver }: DriverPickerProps) {
  const [driver, setDriver] = useState(initialDriver)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative w-[188px] shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded-lg border border-border bg-bg px-2 py-1.5 hover:bg-white/5"
      >
        <img src={driver.avatar} alt="" className="size-6 shrink-0 rounded-full object-cover" />
        <span className="flex-1 truncate text-left text-sm text-text-primary">{driver.name}</span>
        <ChevronDownIcon className="size-4 shrink-0 text-text-tertiary" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[600] mt-2 w-56 overflow-hidden rounded-lg border border-border bg-bg-raised py-1 shadow-xl">
          <p className="px-3 pb-1 pt-2 text-xs font-medium text-text-muted">Assign driver</p>
          <div className="max-h-64 overflow-y-auto">
            {drivers.map((d) => (
              <button
                key={d.name}
                onClick={() => {
                  setDriver(d)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-white/5 ${
                  d.name === driver.name ? 'text-accent-soft' : 'text-text-secondary'
                }`}
              >
                <img src={d.avatar} alt="" className="size-6 shrink-0 rounded-full object-cover" />
                <span className="truncate">{d.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
