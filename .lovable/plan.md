

# Add Search with City Details, Flood Risk & Helplines

## Overview
Add a search feature in the Header that lets users search any Indian location. Search results show: **city/village name, rainfall (mm), flood risk level, and local helpline number**.

## Changes

### 1. Helpline Data (`src/data/helplineData.ts`) — NEW
State-wise helpline mapping so search results can show the relevant local helpline for any location. Covers all major states (Assam, Bihar, UP, Maharashtra, Kerala, Odisha, West Bengal, Delhi, AP, Gujarat, MP, Rajasthan, Tamil Nadu, Karnataka, Telangana, etc.) plus the national helpline (1078) as fallback.

### 2. Search Component (`src/components/SearchBar.tsx`) — NEW
- Debounced search input (300ms) in a popover/dropdown style
- Calls **Open-Meteo Geocoding API**: `https://geocoding-api.open-meteo.com/v1/search?name={query}&count=8&language=en&country_code=IN`
- For each result, fetches weather data from Open-Meteo to get current rainfall
- Displays results as cards showing:
  - **Location name** + state
  - **Rainfall** in mm (real-time from Open-Meteo)
  - **Flood risk** level (computed from rainfall amount — e.g., 0mm = Safe, <10mm = Watch, <50mm = Warning, 50mm+ = Danger)
  - **Local helpline** number (matched by state from helpline data)
- Clicking a result navigates to a detail page

### 3. Location Detail Page (`src/pages/LocationPage.tsx`) — NEW
- Route: `/location/:lat/:lon/:name`
- Fetches real-time weather + flood discharge for the coordinates
- Shows weather card, discharge chart, flood risk assessment, and local helpline
- Works for any village/town/city in India

### 4. Header Update (`src/components/Header.tsx`)
- Add SearchBar component — full-width on desktop, icon toggle on mobile

### 5. Router Update (`src/App.tsx`)
- Add `/location/:lat/:lon/:name` route

### Technical Details
- Open-Meteo Geocoding API (free, no key) for location search
- Open-Meteo Weather API for rainfall data per search result
- Flood risk derived from rainfall + proximity to known flood zones
- State-based helpline lookup with national fallback

