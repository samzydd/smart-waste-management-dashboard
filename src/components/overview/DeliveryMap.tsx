import { Fragment, useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Circle } from 'react-leaflet'
import L from 'leaflet'
import { ZoomIn, ZoomOut, Truck as TruckIcon } from 'lucide-react'
import { bins, trucks, mapCenter } from '../../data/mock'
import 'leaflet/dist/leaflet.css'

type LatLng = [number, number]

function loop(center: LatLng, dx: number, dy: number, offset: number): LatLng[] {
  const [lat, lng] = center
  const corners: LatLng[] = [
    [lat + dy, lng - dx],
    [lat + dy, lng + dx],
    [lat - dy, lng + dx],
    [lat - dy, lng - dx],
  ]
  const start = offset % corners.length
  const ordered = [...corners.slice(start), ...corners.slice(0, start)]
  return [...ordered, ordered[0]]
}

const TRUCK_ROUTES: LatLng[][] = [
  loop([mapCenter[0] + 0.022, mapCenter[1] - 0.018], 0.038, 0.026, 0),
  loop([mapCenter[0] - 0.014, mapCenter[1] + 0.03], 0.03, 0.02, 1),
  loop([mapCenter[0] + 0.036, mapCenter[1] + 0.04], 0.026, 0.032, 2),
  loop([mapCenter[0] - 0.03, mapCenter[1] - 0.03], 0.028, 0.022, 3),
  loop([mapCenter[0] + 0.006, mapCenter[1] + 0.06], 0.02, 0.018, 1),
]

const TRUCK_LOOP_SECONDS = [42, 34, 50, 30, 38]

function segmentDistance(a: LatLng, b: LatLng) {
  const dLat = b[0] - a[0]
  const dLng = b[1] - a[1]
  return Math.sqrt(dLat * dLat + dLng * dLng)
}

function routeLength(route: LatLng[]) {
  let total = 0
  for (let i = 0; i < route.length - 1; i++) total += segmentDistance(route[i], route[i + 1])
  return total
}

const ROUTE_LENGTHS = TRUCK_ROUTES.map(routeLength)

function pointOnRoute(route: LatLng[], totalLength: number, frac: number) {
  let target = (((frac % 1) + 1) % 1) * totalLength
  for (let i = 0; i < route.length - 1; i++) {
    const a = route[i]
    const b = route[i + 1]
    const segLen = segmentDistance(a, b)
    if (target <= segLen || i === route.length - 2) {
      const t = segLen === 0 ? 0 : target / segLen
      const position: LatLng = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      const heading = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI
      return { position, heading }
    }
    target -= segLen
  }
  return { position: route[route.length - 1], heading: 0 }
}

function useElapsedSeconds(intervalMs: number) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const id = setInterval(() => setElapsed((performance.now() - start) / 1000), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return elapsed
}

function truckDivIcon(heading: number, status: string) {
  const color = status === 'collecting' ? '#02e6ff' : status === 'en-route' ? '#ffc710' : '#8e8e8e'
  return L.divIcon({
    className: '',
    html: `<div style="transform: rotate(${heading}deg); width:22px; height:22px; display:flex; align-items:center; justify-content:center; background:${color}; border-radius:6px; box-shadow:0 0 0 3px rgba(0,0,0,0.35);">
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2.5"><path d="M12 2 L19 20 L12 16 L5 20 Z"/></svg>
    </div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

function ZoomControls() {
  return (
    <div className="absolute right-4 top-4 z-[500] flex gap-2 rounded-xl bg-black/40 p-1 backdrop-blur-sm">
      <button className="flex size-7 items-center justify-center rounded-lg text-white/80 hover:bg-white/10">
        <ZoomIn size={16} />
      </button>
      <button className="flex size-7 items-center justify-center rounded-lg text-white/80 hover:bg-white/10">
        <ZoomOut size={16} />
      </button>
    </div>
  )
}

const TRUCK_BEAM_PERIOD = 2.4
const TRUCK_BEAM_BASE = 70
const TRUCK_BEAM_MAX = 620

const SITE_PULSE_PERIOD = 3.2
const SITE_PULSE_BASE = 35
const SITE_PULSE_MAX = 230

export function DeliveryMap() {
  const elapsed = useElapsedSeconds(120)

  const animatedTrucks = trucks.map((truck, i) => {
    const route = TRUCK_ROUTES[i % TRUCK_ROUTES.length]
    const total = ROUTE_LENGTHS[i % TRUCK_ROUTES.length]
    const duration = TRUCK_LOOP_SECONDS[i % TRUCK_LOOP_SECONDS.length]
    const { position, heading } = pointOnRoute(route, total, elapsed / duration)
    const beamColor = truck.status === 'collecting' ? '#02e6ff' : truck.status === 'en-route' ? '#ffc710' : '#8e8e8e'

    return { truck, position, heading, beamColor, phase: (i * 0.45) % TRUCK_BEAM_PERIOD }
  })

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-t-lg border border-border">
      <div className="absolute left-4 top-4 z-[500] flex items-center gap-4 rounded-xl bg-black/50 px-3 py-1.5 backdrop-blur-sm">
        <p className="text-base font-medium text-white">Delivery Activities</p>
        <div className="flex items-center gap-4 text-xs font-medium text-white">
          <span className="flex items-center gap-1">
            <span className="size-3 rounded-sm bg-status-empty" /> Empty
          </span>
          <span className="flex items-center gap-1">
            <span className="size-3 rounded-sm bg-status-filled" /> Filled
          </span>
        </div>
      </div>

      <ZoomControls />

      <MapContainer
        center={mapCenter}
        zoom={12}
        zoomControl={false}
        scrollWheelZoom
        className="h-full w-full dark-map"
        style={{ background: '#151515' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {bins.map((bin, i) => {
          const phase = (((elapsed + i * (SITE_PULSE_PERIOD / bins.length)) % SITE_PULSE_PERIOD) / SITE_PULSE_PERIOD)
          const color = bin.status === 'empty' ? '#00a733' : '#ffc710'
          return (
            <Fragment key={bin.id}>
              <Circle
                center={[bin.lat, bin.lng]}
                radius={SITE_PULSE_BASE + phase * SITE_PULSE_MAX}
                pathOptions={{
                  color,
                  weight: 1,
                  fillColor: color,
                  fillOpacity: (1 - phase) * 0.35,
                  opacity: (1 - phase) * 0.5,
                }}
              />
              <CircleMarker
                center={[bin.lat, bin.lng]}
                radius={6}
                pathOptions={{ color: '#00000066', weight: 1, fillColor: color, fillOpacity: 1 }}
              >
                <Popup>
                  <strong>{bin.label}</strong>
                  <br />
                  IoT sensor · {bin.wasteType} · {bin.fillLevel}% full
                  <br />
                  Last pickup: {bin.lastPickup}
                </Popup>
              </CircleMarker>
            </Fragment>
          )
        })}

        {animatedTrucks.map(({ truck, position, heading, beamColor, phase }) => {
          const beamPhase = (((elapsed + phase) % TRUCK_BEAM_PERIOD) / TRUCK_BEAM_PERIOD)
          const beamPhase2 = (((elapsed + phase + TRUCK_BEAM_PERIOD / 2) % TRUCK_BEAM_PERIOD) / TRUCK_BEAM_PERIOD)

          return (
            <Fragment key={truck.id}>
              {[beamPhase, beamPhase2].map((p, ringIdx) => (
                <Circle
                  key={ringIdx}
                  center={position}
                  radius={TRUCK_BEAM_BASE + p * TRUCK_BEAM_MAX}
                  pathOptions={{
                    color: beamColor,
                    weight: 1.5,
                    fillColor: beamColor,
                    fillOpacity: (1 - p) * 0.18,
                    opacity: (1 - p) * 0.55,
                  }}
                />
              ))}
              <Marker position={position} icon={truckDivIcon(heading, truck.status)}>
                <Popup>
                  <strong className="flex items-center gap-1">
                    <TruckIcon size={12} /> {truck.label}
                  </strong>
                  <br />
                  Status: {truck.status}
                </Popup>
              </Marker>
            </Fragment>
          )
        })}
      </MapContainer>
    </div>
  )
}
