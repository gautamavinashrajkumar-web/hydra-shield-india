ALTER TABLE public.alert_subscribers ADD COLUMN IF NOT EXISTS email text;
CREATE UNIQUE INDEX IF NOT EXISTS alert_subscribers_email_key ON public.alert_subscribers (lower(email));
ALTER TABLE public.alert_subscribers ALTER COLUMN phone_number DROP NOT NULL;
COMMENT ON COLUMN public.alert_subscribers.phone_number IS 'DEPRECATED: replaced by email';

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.notifications TO anon, authenticated;
GRANT INSERT ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read notifications" ON public.notifications FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can create notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;