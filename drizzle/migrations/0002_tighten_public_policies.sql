DROP POLICY IF EXISTS "Anyone can read notifications" ON public.notifications;
CREATE POLICY "Anyone can read recent notifications" ON public.notifications FOR SELECT TO anon, authenticated
  USING (created_at > now() - interval '30 days');

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.alert_subscribers;
CREATE POLICY "Anyone can subscribe with valid details" ON public.alert_subscribers FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(btrim(name)) BETWEEN 1 AND 100
    AND char_length(btrim(region)) BETWEEN 1 AND 100
    AND email IS NOT NULL
    AND char_length(email) <= 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND phone_number IS NULL
  );