# Flood Alerts: Flask Analysis + Cloud Subscribers + SMS Broadcast

Keeps the current navy/official look. Flask powers flood analysis; Lovable Cloud stores subscribers and handles admin login; Twilio sends the SMS.

## What users will see
- **Search & location pages** show flood risk from your Flask `/analyse?city=` endpoint (risk level, total score, rainfall, elevation, flood fraction). Falls back to the current rainfall-based estimate if Flask is offline.
- **"Subscribe to Emergency Alerts"** section on the home page, plus a `/register` page: Name, Phone (Indian format, +91 10 digits), City/Region. Success toast on submit.
- **Severe warning banner** at the top of the home page when any monitored city is HIGH risk from Flask.
- **Register** link in the main menu. No admin link anywhere public.

## Admin panel (`/admin`)
- Secure email/password login (Lovable Cloud). Only accounts with the admin role can get in. Normal visitors see "Access denied".
- **Subscribers table**: search by name/phone/city, paginated (20 per page).
- **City Alert**: pick a city, send an SMS to subscribers in that city.
- **Broadcast**: textarea + "Send to All" button, shows sent/failed counts.

## Automatic alerts
- A scheduled job runs every 30 minutes: calls Flask `/analyse` for every city that has subscribers. If risk is HIGH, it sends an automatic SMS warning to that city's subscribers (at most once every 6 hours per city to avoid spam).

## Technical details
- Cloud table `alert_subscribers` (id, name, phone_number, region, created_at). Public can insert only; only admins can read. Validated with zod on both sides; unique phone number.
- `user_roles` table + `has_role()` function for the admin check. First admin is created by you signing up at `/admin`, then I grant the role.
- Edge functions:
  - `send-sms-broadcast` — admin-only; sends to all or one region via Twilio.
  - `auto-flood-alerts` — scheduled; calls Flask, sends SMS for HIGH risk; logs sends in `alert_log` table for the 6-hour cooldown.
- Twilio connected through the Lovable connector (no keys pasted into code). Needs a Twilio phone number stored as `TWILIO_FROM_NUMBER`.
- Flask calls go through `src/services/flaskApi.ts` with the `ngrok-skip-browser-warning` header. Base URL stored as a config constant (ngrok URLs change on restart — you will need to tell me when it changes, or use a permanent host).
- Flask `/register`, `/alert`, `/broadcast` (FCM push) are not used; Cloud + SMS replaces them.

## What you need to provide
1. Twilio account (connect when prompted) and your Twilio phone number.
2. Your admin email to grant the admin role.
