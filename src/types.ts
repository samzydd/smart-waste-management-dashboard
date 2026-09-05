export type WasteType = 'recyclable' | 'organic' | 'landfill'

export type BinStatus = 'empty' | 'partial' | 'filled' | 'overdue'

export interface Bin {
  id: string
  label: string
  lat: number
  lng: number
  fillLevel: number
  wasteType: WasteType
  status: BinStatus
  lastPickup: string
}

export type TruckStatus = 'idle' | 'en-route' | 'collecting'

export interface Truck {
  id: string
  label: string
  lat: number
  lng: number
  heading: number
  status: TruckStatus
  routeId: string
}

export type DeliveryStatus = 'picked' | 'en-route' | 'in-progress'

export interface Delivery {
  orderNo: string
  site: string
  status: DeliveryStatus
  estWeight: string
  grade: 'A' | 'B' | 'C'
  departure: string
  eta: string
}

export type BinFillReport = 'filled' | 'almost-filled' | 'emptied' | 'in-progress'

export interface BinRecord {
  id: string
  area: string
  report: BinFillReport
  estWeight: string
  truckAssigned: string
  departure: string
  eta: string
}

export type TruckCardStatus = 'in-field' | 'idle' | 'maintenance' | 'offline'

export interface TruckCard {
  id: string
  tag: string
  status: TruckCardStatus
  capacityVol: string
  lastKnownLocation: string
  odometer: string
  driverName: string
  driverAvatar: string
  photo: string
}
