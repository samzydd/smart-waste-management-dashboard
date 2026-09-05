import { DashboardLayout } from '../components/layout/DashboardLayout'
import { TruckSearchBar } from '../components/trucks/TruckSearchBar'
import { TruckList } from '../components/trucks/TruckList'

export function Trucks() {
  return (
    <DashboardLayout title="Trucks" action={{ label: 'Register device' }} scrollMode="fixed">
      <div className="shrink-0">
        <TruckSearchBar />
      </div>
      <TruckList />
    </DashboardLayout>
  )
}
