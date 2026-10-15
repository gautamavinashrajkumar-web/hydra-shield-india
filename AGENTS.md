# Architecture rules
- Keep Firebase delivery in shared server-only functions through the connector gateway; browser code only registers and receives pushes, keeping credentials private.
- Store public subscriber device registrations behind hashed installation capabilities and service-only access; do not require new user accounts or expose token lists.
- Reuse the existing forecast thresholds and cron authentication for automatic alerts; record delivery outcomes separately from in-app alert creation.