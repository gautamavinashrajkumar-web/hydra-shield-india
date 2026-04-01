

# Integrate Flask Backend + Registration & Admin Panel

## Overview
Connect HydraShield to your Flask backend (`https://unpredicatively-stalactiform-melina.ngrok-free.dev`), add user registration with FCM token capture, and create a hidden admin panel for sending custom notifications.

## Architecture

```text
Frontend (React)
  ├── /register       → Public registration page
  ├── /admin-panel    → Hidden admin page (password-protected)
  ├── SearchBar       → Uses /analyse endpoint for flood risk
  └── LocationPage    → Uses /analyse endpoint for flood data

Flask Backend (ngrok)
  ├── GET  /analyse?city=    → Flood risk data
  ├── POST /register         → Register user (name, phone, city, FCM token)
  ├── POST /alert            → Auto-send alerts to city users
  ├── POST /broadcast        → Admin sends custom message to all
  └── GET  /users            → List registered users
```

## Changes

### 1. Flask API Service (`src/services/flaskApi.ts`) — NEW
Centralized API layer with functions:
- `analyseCity(city)` → GET `/analyse?city=...`
- `registerUser(name, phone, city, token)` → POST `/register`
- `sendAlert(city)` → POST `/alert`
- `broadcastMessage(title, body)` → POST `/broadcast`
- `getUsers()` → GET `/users`

All requests include `ngrok-skip-browser-warning` header (required for ngrok).

### 2. Update SearchBar (`src/components/SearchBar.tsx`)
After geocoding results come back, call `/analyse?city=name` for each result to get the Flask backend's flood risk score instead of computing it from Open-Meteo rainfall alone. Show `total_score`, `flood_risk` (from backend), and `rainfall_mm` from the `/analyse` response.

### 3. Update LocationPage (`src/pages/LocationPage.tsx`)
Call `/analyse?city=name` to show the backend's flood risk assessment (elevation score, flood fraction, total score) alongside the existing weather data.

### 4. Registration Page (`src/pages/RegisterPage.tsx`) — NEW
- Public page accessible from nav
- Form fields: Name, Phone Number, City
- On submit: requests browser notification permission, obtains FCM token using Firebase SDK, then calls POST `/register`
- Success/error toast feedback

### 5. Firebase Config (`src/lib/firebase.ts`) — NEW
Initialize Firebase app + messaging for FCM token generation. Uses the project's Firebase config (public keys, safe to store in code).

### 6. Admin Panel (`src/pages/AdminPage.tsx`) — NEW
- Route: `/admin` — NOT shown in public navigation
- Protected by a simple password prompt (hardcoded admin password check on page load)
- Three sections:
  1. **Registered Users** — fetches GET `/users`, displays in a table
  2. **Send City Alert** — input city name, calls POST `/alert`, shows success/failed count
  3. **Broadcast Message** — input title + body, calls POST `/broadcast`, shows success/failed count

### 7. Router Update (`src/App.tsx`)
- Add `/register` route → RegisterPage
- Add `/admin` route → AdminPage

### 8. Header Update (`src/components/Header.tsx`)
- Add "Register" link to public nav
- Do NOT add admin link (admin accesses via direct URL `/admin`)

## Technical Details
- **ngrok headers**: All fetch calls to the Flask backend include `{ "ngrok-skip-browser-warning": "true" }` to bypass the ngrok interstitial page
- **FCM**: Firebase Cloud Messaging web SDK (`firebase/messaging`) for push notification tokens. Need Firebase project config — will ask you for it or use a placeholder
- **Admin security**: Simple client-side password gate (not production-grade, but keeps casual users out). For real security, would need server-side auth
- **No backend changes needed** — all endpoints already exist in your Flask app

## Questions Before Implementation
I'll need your **Firebase project config** (apiKey, authDomain, projectId, messagingSenderId, appId) to set up FCM token generation. Do you have these ready, or should I add a placeholder you can fill in later?

