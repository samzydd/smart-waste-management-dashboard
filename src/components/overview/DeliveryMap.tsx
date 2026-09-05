import { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import { ZoomIn, ZoomOut, Truck as TruckIcon } from 'lucide-react'
import { bins, trucks, mapCenter } from '../../data/mock'
import 'leaflet/dist/leaflet.css'

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

export function DeliveryMap() {
  const truckIcons = useMemo(
    () => trucks.map((t) => ({ truck: t, icon: truckDivIcon(t.heading, t.status) })),
    [],
  )

  return (
    <div className="relative h-[652px] w-full overflow-hidden rounded-t-lg border border-border">
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

        {bins.map((bin) => (
          <CircleMarker
            key={bin.id}
            center={[bin.lat, bin.lng]}
            radius={6}
            pathOptions={{
              color: '#00000066',
              weight: 1,
              fillColor: bin.status === 'empty' ? '#00a733' : '#ffc710',
              fillOpacity: 1,
            }}
          >
            <Popup>
              <strong>{bin.label}</strong>
              <br />
              {bin.wasteType} · {bin.fillLevel}% full
              <br />
              Last pickup: {bin.lastPickup}
            </Popup>
          </CircleMarker>
        ))}

        {truckIcons.map(({ truck, icon }) => (
          <Marker key={truck.id} position={[truck.lat, truck.lng]} icon={icon}>
            <Popup>
              <strong className="flex items-center gap-1">
                <TruckIcon size={12} /> {truck.label}
              </strong>
              <br />
              Status: {truck.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
