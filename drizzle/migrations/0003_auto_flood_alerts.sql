ALTER TABLE public.notifications ADD COLUMN region text;
CREATE TABLE public.auto_alerts_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region text NOT NULL,
  level text NOT NULL,
  rainfall_mm numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.auto_alerts_log TO authenticated;
GRANT ALL ON public.auto_alerts_log TO service_role;
ALTER TABLE public.auto_alerts_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view auto alerts" ON public.auto_alerts_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX auto_alerts_log_region_idx ON public.auto_alerts_log (lower(region), created_at DESC);