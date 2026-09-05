import type { ComponentType, SVGProps } from 'react'
import { AssistantDeviceIcon, WifiSolidIcon, BinEmptyIcon, RecycleBinThrowIcon } from '../icons'

interface Metric {
  label: string
  value: string
  caption: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  color: string
}

const metrics: Metric[] = [
  {
    label: 'Registered device',
    value: '12,233',
    caption: 'Total devices enrolled',
    icon: AssistantDeviceIcon,
    color: 'text-accent',
  },
  {
    label: 'Total active',
    value: '10,120',
    caption: 'Devices online (last 15m)',
    icon: WifiSolidIcon,
    color: 'text-accent',
  },
  {
    label: 'Un-filled bin',
    value: '4,112',
    caption: 'Bins placed in the field',
    icon: BinEmptyIcon,
    color: 'text-[#f55540]',
  },
  {
    label: 'Filled bin',
    value: '6,008',
    caption: 'Bins at/above fill threshold',
    icon: RecycleBinThrowIcon,
    color: 'text-[#f55540]',
  },
]

export function BinMetricsRow() {
  return (
    <div className="flex w-full items-center gap-4">
      {metrics.map(({ label, value, caption, icon: Icon, color }) => (
        <div
          key={label}
          className="flex flex-1 items-start gap-1 overflow-hidden rounded-xl border border-border bg-bg-raised px-4 py-3"
        >
          <div className="flex h-[86px] flex-1 flex-col gap-1">
            <p className="w-full text-base text-text-secondary">{label}</p>
            <div className="flex flex-col items-start justify-end gap-1">
              <p className="whitespace-nowrap text-[28px] font-medium leading-8 text-text-primary">{value}</p>
              <div className="flex items-end pb-0.5">
                <p className="whitespace-nowrap text-sm text-text-tertiary">{caption}</p>
              </div>
            </div>
          </div>
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-bg">
            <Icon className={`size-5 ${color}`} />
          </div>
        </div>
      ))}
    </div>
  )
}
