CREATE TABLE public.push_devices (
 installation_id uuid PRIMARY KEY,
 ownership_hash text NOT NULL,
 token text NOT NULL UNIQUE,
 region text NOT NULL,
 region_key text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 last_seen timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.push_devices TO service_role;
ALTER TABLE public.push_devices ENABLE ROW LEVEL SECURITY;
CREATE INDEX push_devices_region_key_idx ON public.push_devices(region_key);
ALTER TABLE public.auto_alerts_log ADD COLUMN push_accepted integer, ADD COLUMN push_failed integer, ADD COLUMN push_total integer, ADD COLUMN push_error text;
