import type { ComponentType, SVGProps } from 'react'
import { Squares2X2Icon, PlusIcon } from '@heroicons/react/24/solid'
import { OverviewKeyIcon, TrashBinIcon } from '../icons'

interface HeaderProps {
  title: string
  action?: { label: string; onClick?: () => void }
}

const TITLE_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  Overview: OverviewKeyIcon,
  'Bin status': TrashBinIcon,
}

export function Header({ title, action }: HeaderProps) {
  const TitleIcon = TITLE_ICONS[title] ?? Squares2X2Icon

  return (
    <header className="flex h-16 shrink-0 items-center gap-1 border-b border-border bg-bg px-5">
      <div className="flex flex-1 items-center gap-2">
        <div className="flex items-center justify-center rounded-lg border border-border p-1.5">
          <TitleIcon className="size-4 text-text-tertiary" />
        </div>
        <p className="text-xl text-text-secondary">{title}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-2 rounded-lg border border-border bg-[#1c1c1c] px-4 py-2 text-sm font-medium text-[#bfbfbf] transition-colors hover:bg-[#242424]"
        >
          <PlusIcon className="size-4" />
          {action.label}
        </button>
      )}
    </header>
  )
}
