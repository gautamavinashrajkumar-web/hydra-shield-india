
# HydraShield — Flood Management Platform for India

## Design
- **Style**: Clean, official government look — blues, whites, subtle grays
- **Typography**: Professional, high-readability fonts
- **Color palette**: Deep navy primary, ocean blue accents, red/orange for alerts, green for safe zones

## Pages & Features

### 1. Landing Page / Hero
- Bold tagline: "Real-Time Flood Intelligence for India"
- Key stats (active alerts, monitored rivers, states covered)
- Quick navigation to all sections
- Professional header with HydraShield logo/branding and nav

### 2. Live Flood Map (Interactive)
- Embedded interactive map of India (using Leaflet.js — free, no API key needed)
- Color-coded markers for flood-prone zones across major Indian states
- Clickable regions showing current water levels and risk status
- Legend for risk levels (Safe / Watch / Warning / Danger)

### 3. Weather Dashboard
- Real-time weather data from **Open-Meteo API** (free, no key required)
- City-wise weather cards for major Indian cities (Delhi, Mumbai, Chennai, Kolkata, etc.)
- Rainfall charts, temperature, humidity, and wind data
- River discharge data from Open-Meteo's flood API
- Auto-refreshing data every few minutes

### 4. Alerts & Warnings
- Active flood alerts displayed as cards with severity levels
- Filter by state/region
- Color-coded severity (Yellow Watch, Orange Warning, Red Danger)
- Timeline of recent alerts

### 5. Resources & Helplines
- Emergency contacts: NDRF, SDRF, state disaster helplines
- Nearby relief centers (static curated data for major flood-prone areas)
- Safety guidelines / do's and don'ts during floods
- Links to official resources (NDMA, IMD, CWC)

### 6. Footer
- About HydraShield, quick links, social media, disclaimer

## Data Integration
- **Open-Meteo Weather API**: Current weather, forecasts, rainfall for Indian cities
- **Open-Meteo Flood API**: River discharge forecasts for flood monitoring
- **Leaflet + OpenStreetMap**: Free interactive map with flood zone overlays
- Data auto-refreshes using React Query with polling intervals

## Technical Approach
- Leaflet.js for maps (free, no API key)
- Open-Meteo APIs for weather + river data (free, no key)
- React Query for data fetching with auto-refresh
- Recharts for rainfall/discharge visualizations
- Fully responsive design
