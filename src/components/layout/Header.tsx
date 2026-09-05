import { LayoutDashboard, Plus } from 'lucide-react'

interface HeaderProps {
  title: string
  action?: { label: string; onClick?: () => void }
}

export function Header({ title, action }: HeaderProps) {
  return (
    <header className="flex items-center gap-1 border-b border-border bg-bg px-5 py-3.5">
      <div className="flex flex-1 items-center gap-2">
        <div className="flex items-center justify-center rounded-lg border border-border p-1.5">
          <LayoutDashboard size={16} className="text-text-tertiary" />
        </div>
        <p className="text-xl text-text-secondary">{title}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-2 rounded-lg border border-border bg-[#1c1c1c] px-4 py-2 text-sm font-medium text-[#bfbfbf] transition-colors hover:bg-[#242424]"
        >
          <Plus size={16} />
          {action.label}
        </button>
      )}
    </header>
  )
}
