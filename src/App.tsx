import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Overview } from './pages/Overview'
import { BinStatus } from './pages/BinStatus'
import { Trucks } from './pages/Trucks'
import { PlaceholderPage } from './pages/PlaceholderPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/bin-status" element={<BinStatus />} />
        <Route path="/trucks" element={<Trucks />} />
        <Route
          path="/recycle-house"
          element={
            <PlaceholderPage
              title="Recycle house"
              description="Track valuable, recyclable waste processed at each recycle house."
            />
          }
        />
        <Route
          path="/iot-devices"
          element={
            <PlaceholderPage
              title="IoT device manager"
              description="Register, monitor, and manage the sensors deployed across the bin network."
            />
          }
        />
        <Route
          path="/report"
          element={
            <PlaceholderPage
              title="Report"
              description="Export operational and sustainability reports across custom date ranges."
            />
          }
        />
        <Route
          path="/messages"
          element={<PlaceholderPage title="Messages" description="Team and dispatch messages." />}
        />
        <Route
          path="/notifications"
          element={
            <PlaceholderPage title="Notifications" description="Alerts for full, overdue, or offline bins." />
          }
        />
        <Route
          path="/settings"
          element={<PlaceholderPage title="Settings" description="Account and workspace settings." />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
