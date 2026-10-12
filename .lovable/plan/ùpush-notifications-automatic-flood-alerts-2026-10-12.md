# ÙPush notifications + automatic flood alerts

## 1. Connect Firebase (one-time)

- A Firebase connect card appears. You create a free Firebase project, pick "Include web push", and paste the web app keys there. No keys go in chat.

## 2. Phone and browser registration

- A new "Enable push alerts" button sits next to the bell and on the Subscribe page. The user picks their city, allows notifications, and the device is saved with that city.
- Inside the Lovable preview it says "open in a new tab", because browsers block the permission prompt there.
- This works in the browser and in a TWA/PWA-style APK. A custom WebView APK will need a small Android bridge later.

## 3. Admin broadcasts

- The admin page gets a third channel, "Push", next to In-app and Email.
- The result box shows how many devices got the alert and how many failed. Dead devices are removed automatically.

## 4. Automatic flood alerts

- Every hour, the system checks the rainfall forecast for every city where people have subscribed or registered a device.
- It uses the same rule as the site: 50 mm or more is Danger, 20 mm or more is Warning.
- When a city hits Warning or Danger, people in that city get a push alert and an in-app alert, for example "Flood Warning: Guwahati - 62 mm rain expected".
- To avoid spam, a city gets at most one alert per level every 12 hours.
- The admin page shows a list of recent automatic alerts.

## Technical details

- Migration: `push_tokens` (token unique, region, created_at, last_seen). Anonymous users can only upsert their own token, admins can read it, service_role has full access. `auto_alerts_log` (region, level, rainfall_mm, sent_count, created_at) is readable by admins. Add a `region` column to `notifications`, nullable; null means everyone. The bell shows global alerts and alerts for the user's saved city.
- Client: `src/lib/push.ts` uses the connector's enablePush pattern, plus `public/firebase-messaging-sw.js`. The token is saved through an `register-push` edge function, which validates the input with zod.
- `_shared/fcm.ts` sends through the gateway with v1 messages:send, concurrency 10, and deletes tokens that return UNREGISTERED. Both `send-broadcast` and `auto-flood-check` use it.
- `auto-flood-check` edge function: geocode the distinct regions (Open-Meteo), get the daily precipitation sum, check the cooldown in auto_alerts_log, then insert the notification and send the push. It is protected by the existing cron secret and scheduled hourly with pg_cron.