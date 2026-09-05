import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'
import { truckCards } from '../../data/mock'
import type { TruckCardStatus } from '../../types'
import { DriverPicker } from './DriverPicker'

const statusStyles: Record<TruckCardStatus, { label: string; className: string }> = {
  'in-field': { label: 'In Field', className: 'bg-[#1f9d55] text-white' },
  idle: { label: 'Idle/Available', className: 'bg-[#333333] text-[#d1d1d1]' },
  maintenance: { label: 'In maintenance', className: 'bg-[#767c1e] text-white' },
  offline: { label: 'Offline', className: 'bg-[#8b2020] text-white' },
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-sm">
      <span className="text-text-tertiary">{label} </span>
      <span className="text-text-primary">{value}</span>
    </p>
  )
}

export function TruckList() {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto rounded-xl border border-border">
      {truckCards.map((truck) => (
        <div
          key={truck.id}
          className="flex w-full items-center gap-4 border-b border-border bg-bg p-4 transition-colors last:border-b-0 hover:bg-[#171717]"
        >
          <img
            src={truck.photo}
            alt=""
            className="size-24 shrink-0 rounded-lg border border-border object-cover"
          />

          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <p className="text-base font-medium text-text-primary">{truck.tag}</p>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[truck.status].className}`}
              >
                {statusStyles[truck.status].label}
              </span>
            </div>
            <DetailRow label="Capacity vol." value={truck.capacityVol} />
            <DetailRow label="Last known location" value={truck.lastKnownLocation} />
            <DetailRow label="Odometer" value={truck.odometer} />
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="w-12 shrink-0 text-sm text-text-tertiary">Driver</span>
            <DriverPicker initialDriver={{ name: truck.driverName, avatar: truck.driverAvatar }} />
          </div>

          <button className="flex shrink-0 items-center justify-center rounded-md p-1 text-text-tertiary hover:bg-white/10 hover:text-text-secondary">
            <EllipsisVerticalIcon className="size-5" />
          </button>
        </div>
      ))}
    </div>
  )
}
