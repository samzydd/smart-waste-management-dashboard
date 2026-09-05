import { DashboardLayout } from '../components/layout/DashboardLayout'
import { DateRangeFilter } from '../components/overview/DateRangeFilter'
import { PickupMetricCard } from '../components/overview/PickupMetricCard'
import { ValuableWasteCard } from '../components/overview/ValuableWasteCard'
import { DeliveryMap } from '../components/overview/DeliveryMap'
import { DeliveryTable } from '../components/overview/DeliveryTable'

export function Overview() {
  return (
    <DashboardLayout title="Overview" action={{ label: 'Register device' }}>
      <DateRangeFilter />

      <div className="flex w-full items-center gap-5">
        <PickupMetricCard />
        <ValuableWasteCard />
      </div>

      <div className="flex w-full flex-col">
        <DeliveryMap />
        <DeliveryTable />
      </div>
    </DashboardLayout>
  )
}
