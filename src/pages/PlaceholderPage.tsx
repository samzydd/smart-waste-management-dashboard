import { DashboardLayout } from '../components/layout/DashboardLayout'

interface PlaceholderPageProps {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <DashboardLayout title={title}>
      <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-center">
        <p className="text-lg font-medium text-text-primary">{title}</p>
        <p className="max-w-md text-sm text-text-tertiary">{description}</p>
      </div>
    </DashboardLayout>
  )
}
