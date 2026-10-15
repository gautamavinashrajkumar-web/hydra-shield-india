import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { regionKey } from "../_shared/fcm.ts";
const schema = z.object({ installationId: z.string().uuid(), secret: z.string().regex(/^[a-f0-9]{64}$/), action: z.enum(["register", "disable"]), token: z.string().min(20).max(4096).optional(), region: z.string().trim().min(1).max(100).optional() });
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Invalid device registration" }, 400);
    const { installationId, secret, action, token, region } = parsed.data;
    const url = Deno.env.get("SUPABASE_URL"), key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) throw new Error("Device registration unavailable");
    const db = createClient(url, key);
    const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
    const hash = Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, "0")).join("");
    const { data: existing, error } = await db.from("push_devices").select("ownership_hash").eq("installation_id", installationId).maybeSingle();
    if (error) throw error;
    if (existing && existing.ownership_hash !== hash) return json({ error: "Device ownership could not be verified" }, 403);
    if (action === "disable") {
      if (existing) { const { error } = await db.from("push_devices").delete().eq("installation_id", installationId).eq("ownership_hash", hash); if (error) throw error; }
      return json({ enabled: false });
    }
    if (!token || !region || !regionKey(region)) return json({ error: "Device token and city are required" }, 400);
    const record = { token, region, region_key: regionKey(region), last_seen: new Date().toISOString() };
    const { error: saveError } = existing
      ? await db.from("push_devices").update(record).eq("installation_id", installationId).eq("ownership_hash", hash)
      : await db.from("push_devices").insert({ ...record, installation_id: installationId, ownership_hash: hash });
    if (saveError?.code === "23505") return json({ error: "Device already registered; disable its previous registration first" }, 409);
    if (saveError) throw saveError;
    return json({ enabled: true });
  } catch (e) { return json({ error: e instanceof Error ? e.message : "Registration failed" }, 500); }
});
