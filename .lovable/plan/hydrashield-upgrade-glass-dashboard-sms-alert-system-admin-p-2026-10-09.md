# HydraShield Upgrade: Glass Dashboard + SMS Alert System + Admin Panel

## 1. Public site upgrades
- **Glassmorphism weather dashboard**: frosted-glass cards over a deep navy-to-ocean gradient, keeping the HydraShield blue palette. Applies to the Weather page, weather cards and home page sections.
- **Dynamic weather icons**: icon changes with conditions (sun, clouds, rain, heavy rain, thunderstorm, fog) and day/night.
- **Severe weather warning banner**: shown at the top of the home and Weather pages when any monitored city has heavy rain (20mm+) or a thunderstorm. Red/orange, lists affected cities, dismissible.
- **"Subscribe to Emergency Alerts" section** on the home page with the registration form.
- **Registration form** (also at `/register`, linked in the menu): Name, Phone Number, City/Region.
  - Phone validation: Indian mobile format (+91 followed by 10 digits starting 6-9); stored as +91XXXXXXXXXX.
  - Success toast on submit; friendly error if the number is already subscribed.

## 2. Database (Lovable Cloud)
- Table `alert_subscribers`: id, name, phone_number (unique), region, created_at.
- Visitors can only add themselves; they cannot read the list. Only admins can view subscribers.
- Table `user_roles` with an `admin` role for the admin panel check.

## 3. Admin panel (`/admin`)
- Secure email/password login. Only accounts with the admin role get in; others see "Access denied".
- **Subscribers table**: search by name, phone or region; 20 per page with page controls; total count.
- **Broadcast Alert**: message textarea (max 1600 characters, live count) + "Send to All" button with a confirmation step. Shows how many messages were sent and how many failed.
- Not linked anywhere in the public menu.

## 4. SMS sending
- Backend function `send-broadcast`: verifies the caller is an admin, loads all phone numbers from `alert_subscribers`, sends the message to each via Twilio, returns sent/failed counts.
- Twilio credentials are stored as secure project secrets (placeholders you fill in later): `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`. Until they are added, "Send to All" shows a clear "SMS not configured yet" message.

## Technical details
- Enable Lovable Cloud; turn on email/password auth.
- RLS: `alert_subscribers` INSERT for anon/authenticated with validation; SELECT only via `has_role(auth.uid(), 'admin')`. Roles in separate `user_roles` table with security-definer `has_role()`.
- Zod validation on the form and in the edge function.
- Edge function calls Twilio REST API directly (`/2010-04-01/Accounts/{SID}/Messages.json`, form-encoded, Basic auth), sending in small parallel batches.
- First admin: you sign up at `/admin`, then I grant your account the admin role.
- Remove the unused Flask service plans; existing Open-Meteo data stays.

## What you need to do later
1. Create a Twilio account and add the three secrets in project settings.
2. Tell me your admin email after signing up so I can grant admin access.
3. Recommended: enable SMS Pumping Protection and limit SMS Geo Permissions to India in Twilio.
