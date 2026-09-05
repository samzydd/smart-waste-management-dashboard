import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface DashboardLayoutProps {
  title: string
  action?: { label: string; onClick?: () => void }
  children: ReactNode
  /**
   * "page" (default): the whole content area scrolls together, and every
   * direct child is kept at its natural size.
   * "fixed": the content area itself never scrolls — pages using this mode
   * are expected to manage their own internal scroll region (e.g. a table
   * body) so only that region scrolls while the rest of the page stays put.
   */
  scrollMode?: 'page' | 'fixed'
}

export function DashboardLayout({ title, action, children, scrollMode = 'page' }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-full items-start justify-between bg-bg">
      <Sidebar />
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <Header title={title} action={action} />
        <main
          className={
            scrollMode === 'page'
              ? 'flex flex-1 flex-col gap-5 overflow-y-auto p-5 [&>*]:shrink-0'
              : 'flex min-h-0 flex-1 flex-col gap-5 overflow-hidden p-5'
          }
        >
          {children}
        </main>
      </div>
    </div>
  )
}
