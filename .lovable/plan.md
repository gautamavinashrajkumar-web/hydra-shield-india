# Fix admin access + switch alerts from SMS to Email and In-App Notifications

## 1. Fix admin access
- Your account already has the admin role, but your email was never confirmed, so sign-in is blocked.
- Mark your account (vimalkumawat85435@gmail.com) as confirmed so you can sign in right away.
- Turn on auto-confirm for new sign-ups so the expiring link doesn't block anyone again. Sign-up stays protected: only accounts given the admin role can use the admin panel.

## 2. Subscribe form: email instead of phone
- The form asks for Name, Email and City/Region. The phone field is removed.
- Email format is checked, and people who are already subscribed see a friendly message.

## 3. In-app notifications
- New "Notifications" bell in the site header, with an unread count and a list of alerts.
- Admin broadcasts show up in this list right away for everyone who has the app or website open.
- The browser or phone notification permission is requested, so a system pop-up appears when a new alert arrives while the app is open.
- This works when the website is packaged as an APK (WebView). For notifications when the app is fully closed, you'll need native push (Firebase) later, at the APK packaging stage.

## 4. Admin panel
- The subscribers table shows Name, Email, Region and Joined date, and you can search by name, email or region.
- Broadcast form: Title + Message. You choose where it goes: In-app, Email, or both.
- Shows how many emails were sent and how many failed.

## 5. Email sending
- Email alerts go out from your own sender domain through Lovable Emails. You'll be asked to set up a sender domain (one-time setup in a dialog).
- Until that's done, In-app alerts still work and Email shows "Email not configured yet".

## Technical details
- Data fix: set email_confirmed_at for the admin user; configure_auth auto-confirm on.
- Migration: add nullable `email` column to alert_subscribers with a unique index, and keep phone_number but make it nullable and mark it deprecated. Add a `notifications` table (id, title, body, created_at) with public SELECT, and INSERT only for admins via has_role. Enable realtime on it.
- Front end: a NotificationBell component subscribes to realtime INSERTs and stores read state in localStorage. It uses the Notification API when permission is granted.
- Edge function send-broadcast: inserts a notification row and, when Email is selected, sends to every subscriber email in batches through Lovable's email infrastructure. Twilio code is removed.
