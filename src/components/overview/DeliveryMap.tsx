import { Fragment, useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import { MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon, TruckIcon } from '@heroicons/react/24/solid'
import { bins, trucks, mapCenter } from '../../data/mock'
import 'leaflet/dist/leaflet.css'

type LatLng = [number, number]

// Rough waypoint pairs near the map center — OSRM snaps these to the real
// street network and returns a road-following path between them.
const TRUCK_WAYPOINTS: [LatLng, LatLng][] = [
  [
    [mapCenter[0] + 0.05, mapCenter[1] - 0.06],
    [mapCenter[0] - 0.015, mapCenter[1] + 0.02],
  ],
  [
    [mapCenter[0] - 0.045, mapCenter[1] - 0.03],
    [mapCenter[0] + 0.02, mapCenter[1] + 0.045],
  ],
  [
    [mapCenter[0] + 0.055, mapCenter[1] + 0.03],
    [mapCenter[0] - 0.02, mapCenter[1] - 0.045],
  ],
  [
    [mapCenter[0] - 0.055, mapCenter[1] + 0.05],
    [mapCenter[0] + 0.03, mapCenter[1] - 0.02],
  ],
  [
    [mapCenter[0] + 0.01, mapCenter[1] - 0.07],
    [mapCenter[0] - 0.03, mapCenter[1] + 0.04],
  ],
]

// City-driving pace: slowed 60% from the original ~6.2 m/s pass, then
// sped back up 20%, then another 30% from there.
const TRUCK_SPEED_MPS = 2.5 * 1.2 * 1.3

async function fetchRoadRoute([a, b]: [LatLng, LatLng]): Promise<LatLng[] | null> {
  const coords = `${a[1]},${a[0]};${b[1]},${b[0]}`
  try {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`,
    )
    if (!res.ok) return null
    const data = await res.json()
    const geo = data?.routes?.[0]?.geometry?.coordinates as [number, number][] | undefined
    if (!geo || geo.length < 2) return null
    return geo.map(([lng, lat]) => [lat, lng] as LatLng)
  } catch {
    return null
  }
}

function segmentMeters(a: LatLng, b: LatLng) {
  return L.latLng(a).distanceTo(L.latLng(b))
}

function routeMeters(route: LatLng[]) {
  let total = 0
  for (let i = 0; i < route.length - 1; i++) total += segmentMeters(route[i], route[i + 1])
  return total
}

function bearing(a: LatLng, b: LatLng) {
  const lat1 = (a[0] * Math.PI) / 180
  const lat2 = (b[0] * Math.PI) / 180
  const dLng = ((b[1] - a[1]) * Math.PI) / 180
  const y = Math.sin(dLng) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}

function pointAtFraction(route: LatLng[], totalMeters: number, frac: number) {
  let target = Math.max(0, Math.min(1, frac)) * totalMeters
  for (let i = 0; i < route.length - 1; i++) {
    const a = route[i]
    const b = route[i + 1]
    const segLen = segmentMeters(a, b)
    if (target <= segLen || i === route.length - 2) {
      const t = segLen === 0 ? 0 : target / segLen
      const position: LatLng = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      return { position, heading: bearing(a, b) }
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

// truck.svg already bundles both the vehicle glyph and a soft radial glow
// behind it, so it serves as the truck's icon and its "radial" in one asset.
const TRUCK_ICON_SIZE = 128

function truckDivIcon(heading: number, status: string) {
  const badgeColor = status === 'collecting' ? '#02e6ff' : status === 'en-route' ? '#ffc710' : '#c9c9c9'
  return L.divIcon({
    className: '',
    html: `
      <div class="truck-pulse-icon" style="position:relative; width:${TRUCK_ICON_SIZE}px; height:${TRUCK_ICON_SIZE}px;">
        <div style="width:100%; height:100%; transform: rotate(${heading}deg); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
          <img src="/truck.svg" width="${TRUCK_ICON_SIZE}" height="${TRUCK_ICON_SIZE}" style="display:block; width:100%; height:100%;" />
        </div>
        <span style="position:absolute; right:6px; bottom:6px; width:10px; height:10px; border-radius:9999px; background:${badgeColor}; border:2px solid #0b0b0b;"></span>
      </div>`,
    iconSize: [TRUCK_ICON_SIZE, TRUCK_ICON_SIZE],
    iconAnchor: [TRUCK_ICON_SIZE / 2, TRUCK_ICON_SIZE / 2],
  })
}

// Trackpad pinch shows up differently per browser engine: Chrome/Firefox
// emulate it as `wheel` events with `ctrlKey: true`, while Safari fires the
// non-standard `gesturestart`/`gesturechange`/`gestureend` events instead.
// We handle both so pinch-to-zoom works everywhere, while a plain two-finger
// scroll (no ctrlKey) is left alone and never zooms the map.
function PinchOnlyZoom() {
  const map = useMap()
  useEffect(() => {
    const container = map.getContainer()
    let gestureStartZoom = map.getZoom()

    function onWheel(e: WheelEvent) {
      if (!e.ctrlKey) return
      e.preventDefault()
      const nextZoom = map.getZoom() - e.deltaY * 0.03
      map.setZoom(nextZoom, { animate: false })
    }

    function onGestureStart(e: Event) {
      e.preventDefault()
      gestureStartZoom = map.getZoom()
    }

    function onGestureChange(e: Event) {
      e.preventDefault()
      const scale = (e as unknown as { scale: number }).scale
      map.setZoom(gestureStartZoom + Math.log2(scale), { animate: false })
    }

    function onGestureEnd(e: Event) {
      e.preventDefault()
    }

    container.addEventListener('wheel', onWheel, { passive: false })
    container.addEventListener('gesturestart', onGestureStart as EventListener)
    container.addEventListener('gesturechange', onGestureChange as EventListener)
    container.addEventListener('gestureend', onGestureEnd as EventListener)

    return () => {
      container.removeEventListener('wheel', onWheel)
      container.removeEventListener('gesturestart', onGestureStart as EventListener)
      container.removeEventListener('gesturechange', onGestureChange as EventListener)
      container.removeEventListener('gestureend', onGestureEnd as EventListener)
    }
  }, [map])
  return null
}

function ZoomControls() {
  const map = useMap()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    L.DomEvent.disableClickPropagation(ref.current)
    L.DomEvent.disableScrollPropagation(ref.current)
  }, [])

  return (
    <div ref={ref} className="absolute right-4 top-4 z-[500] flex gap-2 rounded-xl bg-black/40 p-1 backdrop-blur-sm">
      <button
        onClick={() => map.zoomIn()}
        className="flex size-7 items-center justify-center rounded-lg text-white/80 hover:bg-white/10"
      >
        <MagnifyingGlassPlusIcon className="size-4" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="flex size-7 items-center justify-center rounded-lg text-white/80 hover:bg-white/10"
      >
        <MagnifyingGlassMinusIcon className="size-4" />
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

interface TruckRoute {
  path: LatLng[]
  totalMeters: number
}

export function DeliveryMap() {
  const elapsed = useElapsedSeconds(120)
  const [routes, setRoutes] = useState<(TruckRoute | null)[]>(() => TRUCK_WAYPOINTS.map(() => null))

  useEffect(() => {
    let cancelled = false
    Promise.all(TRUCK_WAYPOINTS.map(fetchRoadRoute)).then((results) => {
      if (cancelled) return
      setRoutes(
        results.map((path) => (path ? { path, totalMeters: routeMeters(path) } : null)),
      )
    })
    return () => {
      cancelled = true
    }
  }, [])

  const animatedTrucks = trucks
    .map((truck, i) => {
      const route = routes[i % routes.length]
      if (!route) return null

      const oneWaySeconds = route.totalMeters / TRUCK_SPEED_MPS
      const cycle = elapsed % (oneWaySeconds * 2)
      const forward = cycle <= oneWaySeconds
      const frac = forward ? cycle / oneWaySeconds : 1 - (cycle - oneWaySeconds) / oneWaySeconds
      const { position, heading } = pointAtFraction(route.path, route.totalMeters, frac)
      const finalHeading = forward ? heading : (heading + 180) % 360
      const beamColor = truck.status === 'collecting' ? '#02e6ff' : truck.status === 'en-route' ? '#ffc710' : '#8e8e8e'

      return { truck, position, heading: finalHeading, beamColor, phase: (i * 0.45) % TRUCK_BEAM_PERIOD }
    })
    .filter((t): t is NonNullable<typeof t> => t !== null)

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

      <MapContainer
        center={mapCenter}
        zoom={12}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        boxZoom={false}
        touchZoom
        className="h-full w-full dark-map"
        style={{ background: '#151515' }}
      >
        <PinchOnlyZoom />
        <ZoomControls />

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
                    <TruckIcon className="size-3" /> {truck.label}
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
