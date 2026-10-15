# HydraShield push alerts, automatic alert history, and robot appearance

## 1. Finish Firebase setup
- Link the accessible Firebase Cloud Messaging workspace connection to this project. It is available but not currently linked.
- Check that **Include web push** is configured. If browser settings are missing, use the connection setup form to collect them—not chat.

## 2. Enable push alerts
- Add an **Enable push alerts** control beside the notification bell and on the subscription page, with a city/region selection.
- Request permission only after the user clicks. Show clear states for enabled, denied, unsupported, setup incomplete, and opening the preview in its own tab.
- Register the device and city securely, support updating its city and disabling push, and keep device tokens private.
- Add background notification reception and alert-click navigation. Avoid duplicate foreground popups from the existing bell.
- Browser push supports compatible browsers and TWA/PWA-style packaging. A native WebView or Capacitor APK needs its own device-registration integration once the packaging method is known; this work does not produce an APK.

## 3. Manual and automatic push delivery
- Add **Push** beside In-app and Email in the admin broadcast form. Show accepted and failed device counts; acceptance by Firebase is not proof of delivery.
- Send manual push broadcasts to registered devices, preserving the existing admin-only access check.
- Extend the verified active hourly flood check to include cities with push registrations and send push alerts only to devices in the affected city.
- Preserve the current forecast-based thresholds: Warning at 20 mm and Danger at 50 mm, with one alert per city and level every 12 hours. These are rainfall-based risk alerts, not confirmed flood reports.
- Remove stale device tokens, handle provider errors, and record partial delivery failures rather than treating every send as successful.
- Email sending remains unchanged and still requires separate sender-domain setup.

## 4. Recent automatic alerts
- Add an admin-only recent alerts list showing city, Warning/Danger, expected rainfall, time, and push delivery results for new alerts.
- Include pagination, refresh, loading, empty, and error states. Older records without push results show an unavailable marker rather than invented counts.

## 5. Robot appearance
- Replace the red circle with a recognizable red robot icon, sized within the existing grid square.
- Update the robot legend to match; preserve all navigation, flood simulation, and risk rules.

## Technical details
- Add the Firebase client SDK, a push registration helper/control, and `public/firebase-messaging-sw.js` using the connector-provided public configuration.
- Add a private device-registration table with explicit grants and RLS. Use validated server-side registration with a per-installation ownership secret, stored hashed, so public subscribers need no new account and cannot read or modify other devices. Never expose token lists to public clients.
- Add a shared server-only Firebase sender through the Lovable connector gateway; use it in `send-broadcast` and `auto-flood-check`.
- Add nullable delivery-result fields to the existing automatic alert log without changing historical records.
- Check database and notification insert errors before recording successful alerts; keep existing cron authentication and admin permissions.
- Record the implementation architecture in project guidance during implementation.

## Verification
- Test registration validation, device ownership, city targeting, stale-token cleanup, failure handling, and cooldown behavior.
- Verify the enabled/denied/preview states and admin history with an authenticated admin session.
- Use a consenting test device to verify a manual push and a controlled automatic-alert test, including background receipt and alert-click navigation. If no receiving device is available, report delivery as unverified.
- Verify the robot remains visible while moving, rerouting, blocked, and reset, including a small-screen layout.