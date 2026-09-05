import { TruckIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon as ChevronDownOutlineIcon } from '@heroicons/react/24/outline'
import {
  OverviewKeyIcon,
  TrashBinIcon,
  BinRecycleIcon,
  DeviceSsdIcon,
  FileFilledIcon,
  MessageSolidIcon,
  NotificationSolidIcon,
  GearFillIcon,
} from '../icons'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

const primaryNav = [
  { to: '/', label: 'Overview', icon: OverviewKeyIcon },
  { to: '/bin-status', label: 'Bin status', icon: TrashBinIcon },
  { to: '/trucks', label: 'Trucks', icon: TruckIcon },
  { to: '/recycle-house', label: 'Recycle house', icon: BinRecycleIcon },
  { to: '/iot-devices', label: 'IoT device manager', icon: DeviceSsdIcon },
  { to: '/report', label: 'Report', icon: FileFilledIcon },
]

const secondaryNav = [
  { to: '/messages', label: 'Messages', icon: MessageSolidIcon },
  { to: '/notifications', label: 'Notifications', icon: NotificationSolidIcon },
  { to: '/settings', label: 'Settings', icon: GearFillIcon },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-[254px] shrink-0 flex-col items-center gap-5 overflow-hidden border-r border-border bg-bg">
      <div className="flex w-full flex-col items-start">
        <div className="flex h-16 w-full items-center gap-2 border-b border-border px-5 py-4">
          <div className="flex flex-1 items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg border border-border-strong bg-black">
              <p className="text-xs font-bold leading-none">
                <span className="text-[#ff8665]">W</span>
                <span className="text-accent">D</span>
              </p>
            </div>
            <p className="whitespace-nowrap text-sm font-medium text-text-primary">Waste delivery</p>
          </div>
          <ChevronDownIcon className="size-4 text-text-tertiary" />
        </div>
        <div className="flex w-full items-center border-b border-border p-5">
          <label className="flex h-9 w-full items-center gap-2 rounded-lg border border-border-strong bg-black p-3 focus-within:border-accent">
            <MagnifyingGlassIcon className="size-4 shrink-0 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search all pages"
              className="w-full min-w-0 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
            />
          </label>
        </div>
      </div>

      <div className="flex w-[214px] flex-1 flex-col items-start justify-between">
        <nav className="flex w-full flex-col items-start gap-1">
          {primaryNav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                clsx(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'bg-accent-bg font-medium text-accent-soft shadow-[0_0_4px_0_rgba(0,0,0,0.6)]'
                    : 'text-text-tertiary hover:bg-white/5 hover:text-text-secondary',
                )
              }
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex w-full flex-col items-start gap-5 pb-5">
          <nav className="flex w-full flex-col items-start gap-1 border-t border-b border-border py-5">
            {secondaryNav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  clsx(
                    'flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors',
                    isActive ? 'text-text-primary' : 'text-text-tertiary hover:text-text-secondary',
                  )
                }
              >
                <Icon className="size-4 shrink-0" />
                <span className="flex-1 truncate">{label}</span>
              </NavLink>
            ))}
          </nav>

          <button className="flex w-full items-center justify-between rounded-xl bg-bg-raised px-3 py-4 text-left">
            <div className="flex items-center gap-1">
              <div className="size-8 shrink-0 rounded-full bg-gradient-to-br from-[#ffbd3b] to-[#f55540]" />
              <div className="leading-tight">
                <p className="w-[110px] truncate text-[13px] font-semibold text-text-primary">Sami Joco</p>
                <p className="w-[110px] truncate text-[11px] text-text-tertiary">johndoe@gmail.com</p>
              </div>
            </div>
            <ChevronDownOutlineIcon className="size-4 shrink-0 text-text-tertiary" />
          </button>
        </div>
      </div>
    </aside>
  )
}
