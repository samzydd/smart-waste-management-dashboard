import type { Bin, BinFillReport, BinRecord, Delivery, Truck, TruckCard, TruckCardStatus } from '../types'

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

const STREETS = [
  'Royal Ln.',
  'Ranchview Dr.',
  'Westheimer Rd.',
  'Thornridge Cir.',
  'W. Gray St.',
  'Ash Dr.',
  'Elgin St.',
  'Parker Rd.',
  'Washington Ave.',
  'Preston Rd.',
  'Cedar Grove Ln.',
  'Maple Leaf Ct.',
  'Sunset Blvd.',
  'Lakeview Dr.',
  'Birchwood Ave.',
  'Harborview St.',
  'Meadowbrook Ln.',
  'Fairview Rd.',
  'Hillcrest Ave.',
  'Riverside Dr.',
]

const CITIES = [
  'Mesa, New Jersey',
  'Richardson, California',
  'Santa Ana, Illinois',
  'Shiloh, Hawaii',
  'Utica, Pennsylvania',
  'San Jose, South Dakota',
  'Celina, Delaware',
  'Allentown, New Mexico',
  'Syracuse, Connecticut',
  'Manchester, Kentucky',
  'Inglewood, Maine',
  'Fresno, Ohio',
  'Bristol, Vermont',
  'Salem, Oregon',
  'Dover, Georgia',
  'Franklin, Texas',
]

const REPORTS: BinFillReport[] = ['filled', 'filled', 'almost-filled', 'almost-filled', 'emptied', 'emptied', 'in-progress']

export const binRecords: BinRecord[] = Array.from({ length: 40 }, (_, i) => {
  const streetNo = 1000 + ((i * 733) % 8000)
  const street = STREETS[i % STREETS.length]
  const city = CITIES[i % CITIES.length]
  const zip = 10000 + ((i * 4211) % 89999)
  const area = `${streetNo} ${street} ${city} ${zip}`
  const report = REPORTS[i % REPORTS.length]
  const truckTag = `RES-${(i * 7 + 12) % 99} • TAX-${1000 + i * 111}`
  return {
    id: `bin-record-${i + 1}`,
    area,
    report,
    estWeight: i % 9 === 1 ? 'TBD' : '12 ton',
    truckAssigned: truckTag,
    departure: `12 Oct, ${(8 + i) % 12 || 12}:${(i * 7) % 60 < 10 ? '0' : ''}${(i * 7) % 60} ${8 + i < 12 ? 'AM' : 'PM'}`,
    eta: `12 Oct, ${(13 + i) % 12 || 12}:${(i * 11) % 60 < 10 ? '0' : ''}${(i * 11) % 60} PM`,
  }
})

const TRUCK_STATUSES: TruckCardStatus[] = ['in-field', 'idle', 'maintenance', 'offline', 'in-field', 'in-field']

const DRIVER_NAMES = [
  'Floyd Miles',
  'Ralph Edwards',
  'Kaka Howard',
  'Devon Lane',
  'Theresa Webb',
  'Jenny Wilson',
  'Cody Fisher',
  'Esther Howard',
  'Wade Warren',
  'Leslie Alexander',
]

const CAPACITIES = ['12 yd³', '14 yd³', '16 yd³', '17 yd³']

export const drivers = DRIVER_NAMES.map((name, i) => ({
  name,
  avatar: `https://i.pravatar.cc/64?img=${(i % 70) + 1}`,
}))

// Real garbage/waste-collection truck photos (Wikimedia Commons, served via
// the stable Special:FilePath redirect so no upload-URL churn).
const TRUCK_PHOTOS = [
  'US_Garbage_Truck.jpg',
  'NYC_Sanitation_Garbage_Truck_(46018980825).jpg',
  'Garbage_truck.png',
  'Abandoned_KMC_garbage_truck.jpg',
  'ACT_ASL_garbage_truck.jpg',
  'Recology_Lodal_Garbage_Truck_14425_in_San_Francisco.jpg',
  'Naha_Okinawa_Japan_Garbage-truck-01.jpg',
  'Mack_MR_Leach_2rII_Garbage_Truck_(15808528062).jpg',
  'Nissan_UD90_garbage_truck_(16194191110).jpg',
  'Republic_Services_waste_collection_truck.jpg',
  'Bunbury_waste_disposal_truck.jpg',
].map((name) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}?width=300`)

export const truckCards: TruckCard[] = Array.from({ length: 16 }, (_, i) => {
  const tagPrefix = ['RES-12 • TAX-1234', 'RES-Ab • OMO-2234', 'RES-32 • TAX-3455', 'RES-62 • VDS-1345', 'RES-91 • KKQ-5432'][
    i % 5
  ]
  return {
    id: `truck-card-${i + 1}`,
    tag: tagPrefix,
    status: TRUCK_STATUSES[i % TRUCK_STATUSES.length],
    capacityVol: CAPACITIES[i % CAPACITIES.length],
    lastKnownLocation: `${1000 + ((i * 733) % 8000)} ${STREETS[(i + 3) % STREETS.length]} ${CITIES[(i + 2) % CITIES.length]} ${10000 + ((i * 4211) % 89999)}`,
    odometer: `${(123 + i * 3).toLocaleString()},458 km`,
    driverName: DRIVER_NAMES[i % DRIVER_NAMES.length],
    driverAvatar: `https://i.pravatar.cc/64?img=${(i % 70) + 1}`,
    photo: TRUCK_PHOTOS[i % TRUCK_PHOTOS.length],
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
