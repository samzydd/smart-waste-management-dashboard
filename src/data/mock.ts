import type { Bin, BinFillReport, BinRecord, Delivery, Truck } from '../types'

const CENTER: [number, number] = [38.8339, -104.8214]

function jitter(base: number, spread: number) {
  return base + (Math.random() - 0.5) * spread
}

export const bins: Bin[] = Array.from({ length: 48 }, (_, i) => {
  const status = Math.random() > 0.75 ? 'filled' : Math.random() > 0.5 ? 'partial' : 'empty'
  return {
    id: `bin-${i + 1}`,
    label: `Bin ${String(i + 1).padStart(3, '0')}`,
    lat: jitter(CENTER[0], 0.16),
    lng: jitter(CENTER[1], 0.2),
    fillLevel: status === 'filled' ? 80 + Math.round(Math.random() * 20) : status === 'partial' ? 30 + Math.round(Math.random() * 40) : Math.round(Math.random() * 20),
    wasteType: (['recyclable', 'organic', 'landfill'] as const)[i % 3],
    status,
    lastPickup: '12 Oct, 12:14PM',
  }
})

export const trucks: Truck[] = Array.from({ length: 10 }, (_, i) => ({
  id: `truck-${i + 1}`,
  label: `Truck ${String(i + 1).padStart(2, '0')}`,
  lat: jitter(CENTER[0], 0.16),
  lng: jitter(CENTER[1], 0.2),
  heading: Math.round(Math.random() * 360),
  status: (['idle', 'en-route', 'collecting'] as const)[i % 3],
  routeId: `route-${i + 1}`,
}))

export const deliveries: Delivery[] = [
  {
    orderNo: '112403/ADS-ORD-12',
    site: '2464 Royal Ln. Mesa, New Jersey 45463',
    status: 'picked',
    estWeight: '12 ton',
    grade: 'A',
    departure: '12 Oct, 12:14PM',
    eta: '12 Oct, 16:14PM',
  },
  {
    orderNo: '112404/ADS-ORD-13',
    site: '3891 Ranchview Dr. Richardson, California 62639',
    status: 'en-route',
    estWeight: '12 ton',
    grade: 'B',
    departure: '12 Oct, 12:14PM',
    eta: '12 Oct, 16:14PM',
  },
  {
    orderNo: '112405/ADS-ORD-14',
    site: '2464 Royal Ln. Mesa, New Jersey 45463',
    status: 'in-progress',
    estWeight: '12 ton',
    grade: 'A',
    departure: '12 Oct, 12:14PM',
    eta: '12 Oct, 16:14PM',
  },
  {
    orderNo: '112406/ADS-ORD-15',
    site: '4517 Washington Ave. Manchester, Kentucky 39495',
    status: 'picked',
    estWeight: '9 ton',
    grade: 'A',
    departure: '12 Oct, 09:40AM',
    eta: '12 Oct, 13:10PM',
  },
  {
    orderNo: '112407/ADS-ORD-16',
    site: '3517 W. Gray St. Utica, Pennsylvania 57867',
    status: 'en-route',
    estWeight: '15 ton',
    grade: 'C',
    departure: '12 Oct, 10:05AM',
    eta: '12 Oct, 14:35PM',
  },
]

const AREAS = [
  '2464 Royal Ln. Mesa, New Jersey 45463',
  '3891 Ranchview Dr. Richardson, California 62639',
  '2972 Westheimer Rd. Santa Ana, Illinois 85486',
  '1901 Thornridge Cir. Shiloh, Hawaii 81063',
  '3517 W. Gray St. Utica, Pennsylvania 57867',
  '2715 Ash Dr. San Jose, South Dakota 83475',
  '6391 Elgin St. Celina, Delaware 10299',
  '4140 Parker Rd. Allentown, New Mexico 31134',
  '2118 Thornridge Cir. Syracuse, Connecticut 35624',
  '4517 Washington Ave. Manchester, Kentucky 39495',
  '8502 Preston Rd. Inglewood, Maine 98380',
  '3605 Parker Rd. Fresno, Ohio 20194',
]

const REPORTS: BinFillReport[] = ['filled', 'filled', 'almost-filled', 'almost-filled', 'emptied', 'emptied', 'in-progress']

export const binRecords: BinRecord[] = AREAS.map((area, i) => {
  const report = REPORTS[i % REPORTS.length]
  const truckTag = `RES-${(i * 7 + 12) % 99} • TAX-${1000 + i * 111}`
  return {
    id: `bin-record-${i + 1}`,
    area,
    report,
    estWeight: i === 1 ? 'TBD' : '12 ton',
    truckAssigned: truckTag,
    departure: `12 Oct, ${(8 + i) % 12 || 12}:${(i * 7) % 60 < 10 ? '0' : ''}${(i * 7) % 60} ${8 + i < 12 ? 'AM' : 'PM'}`,
    eta: `12 Oct, ${(13 + i) % 12 || 12}:${(i * 11) % 60 < 10 ? '0' : ''}${(i * 11) % 60} PM`,
  }
})

export const wasteBreakdown = [
  { label: 'Metal', pct: 40, color: 'var(--color-waste-metal)' },
  { label: 'Plastic', pct: 28, color: 'var(--color-waste-plastic)' },
  { label: 'Electronic', pct: 12, color: 'var(--color-waste-electronic)' },
  { label: 'Paper', pct: 10, color: 'var(--color-waste-paper)' },
  { label: 'Others', pct: 10, color: 'var(--color-waste-other)' },
]

export const mapCenter = CENTER
