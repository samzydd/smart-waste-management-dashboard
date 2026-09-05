# Smart Waste Management Dashboard

A dashboard for a network of IoT-equipped waste bins. It tracks fill levels in
real time, identifies waste types (recyclable, organic, landfill), flags full
or overdue bins, and visualizes pickup/delivery activity on an interactive
map — with the goal of optimizing collection routes, cutting unnecessary
trips, and reducing operational cost.

Built from a Figma design ([source](https://www.figma.com/design/X9LUdS80FLvIbF89I0n7N5/WasteDelivery)).

## Stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4** for styling, with design tokens matching the Figma file
- **React Router** for page navigation
- **Leaflet / React-Leaflet** for the interactive bin/truck map
- **Lucide** for icons

## Features

- **Overview** — pickup totals, valuable vs. ordinary waste split, a
  recyclable-waste material breakdown, a live map of bins and trucks, and a
  delivery activity table.
- **Bin status, Trucks, Recycle house, IoT device manager, Report** —
  scaffolded routes ready to be built out with real data.

The map currently renders mock bin and truck data positioned around a sample
city center (`src/data/mock.ts`). Swap that module for a real API/WebSocket
feed to go live with actual sensor data.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. Production build:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/
    layout/      Sidebar, header, page shell
    overview/     Overview-page widgets (metric cards, map, table)
  data/           Mock data for bins, trucks, deliveries
  pages/          Route-level pages
  types.ts        Shared domain types (Bin, Truck, Delivery)
```
