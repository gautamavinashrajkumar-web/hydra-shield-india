import { createClient } from "npm:@supabase/supabase-js@2";
import { authenticateCronRequest } from "../_shared/cron-auth.ts";

const COOLDOWN_HOURS = 12;

Deno.serve(async (req) => {
  const denied = authenticateCronRequest(req);
  if (denied) return denied;
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: subs, error } = await db.from("alert_subscribers").select("region");
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  const regions = new Map<string, string>();
  for (const s of subs ?? []) {
    const key = s.region.trim().toLowerCase();
    if (key && !regions.has(key)) regions.set(key, s.region.trim());
  }

  const since = new Date(Date.now() - COOLDOWN_HOURS * 3600_000).toISOString();
  const results: unknown[] = [];

  for (const [, region] of [...regions].slice(0, 200)) {
    try {
      const city = region.split(",")[0].trim();
      const g = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&country_code=IN`).then((r) => r.json());
      const loc = g.results?.[0];
      if (!loc) continue;
      const w = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&daily=precipitation_sum&forecast_days=1&timezone=Asia%2FKolkata`).then((r) => r.json());
      const mm = Number(w.daily?.precipitation_sum?.[0] ?? 0);
      const level = mm >= 50 ? "Danger" : mm >= 20 ? "Warning" : null;
      if (!level) continue;

      const { data: recent } = await db.from("auto_alerts_log").select("id")
        .ilike("region", region).eq("level", level).gte("created_at", since).limit(1);
      if (recent?.length) continue;

      const title = `Flood ${level}: ${city}`;
      const body = level === "Danger"
        ? `${mm.toFixed(0)} mm of rain expected today in ${city}. Move to higher ground and keep emergency supplies ready. Helpline 1078.`
        : `${mm.toFixed(0)} mm of rain expected today in ${city}. Avoid low-lying areas and stay alert. Helpline 1078.`;
      await db.from("notifications").insert({ title, body, region });
      await db.from("auto_alerts_log").insert({ region, level, rainfall_mm: mm });
      results.push({ region, level, mm });
    } catch (e) {
      console.error("region failed", region, e);
    }
  }

  return new Response(JSON.stringify({ checked: regions.size, alerts: results }), { headers: { "Content-Type": "application/json" } });
});
