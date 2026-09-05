import { DashboardLayout } from '../components/layout/DashboardLayout'
import { BinMetricsRow } from '../components/bin-status/BinMetricsRow'
import { BinSearchBar } from '../components/bin-status/BinSearchBar'
import { BinTable } from '../components/bin-status/BinTable'

export function BinStatus() {
  return (
    <DashboardLayout title="Bin status" action={{ label: 'Register device' }} scrollMode="fixed">
      <div className="shrink-0">
        <BinMetricsRow />
      </div>
      <div className="shrink-0">
        <BinSearchBar />
      </div>
      <BinTable />
    </DashboardLayout>
  )
}
