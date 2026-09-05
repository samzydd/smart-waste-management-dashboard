import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface DashboardLayoutProps {
  title: string
  action?: { label: string; onClick?: () => void }
  children: ReactNode
}

export function DashboardLayout({ title, action, children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-full items-start justify-between bg-bg">
      <Sidebar />
      <div className="flex h-full flex-1 flex-col overflow-y-auto">
        <Header title={title} action={action} />
        <main className="flex flex-1 flex-col gap-5 p-5">{children}</main>
      </div>
    </div>
  )
}
