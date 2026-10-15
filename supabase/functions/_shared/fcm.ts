import { createClient } from "npm:@supabase/supabase-js@2";
export const regionKey = (value: string) => value.split(",")[0].trim().toLowerCase().replace(/\s+/g, " ");
export async function sendPush(db: ReturnType<typeof createClient>, title: string, body: string, region?: string) {
  let query = db.from("push_devices").select("installation_id,token");
  if (region) query = query.eq("region_key", regionKey(region));
  const { data, error } = await query;
  if (error) throw error;
  const devices = data ?? [];
  const result = { accepted: 0, failed: 0, total: devices.length, errors: [] as string[] };
  if (!devices.length) return result;
  const apiKey = Deno.env.get("LOVABLE_API_KEY"), connection = Deno.env.get("FIREBASE_MESSAGING_API_KEY");
  if (!apiKey || !connection) throw new Error("Firebase push sending is not configured");
  for (let i = 0; i < devices.length; i += 10) {
    await Promise.all(devices.slice(i, i + 10).map(async (device) => {
      try {
        let response: Response | undefined;
        for (let attempt = 0; attempt < 3; attempt++) {
          response = await fetch("https://connector-gateway.lovable.dev/firebase_messaging/v1/projects/_/messages:send", {
            method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "X-Connection-Api-Key": connection, "Content-Type": "application/json" },
            body: JSON.stringify({ message: { token: device.token, notification: { title, body }, data: { path: "/alerts" }, webpush: { notification: { icon: "/favicon.ico" } } } }),
            signal: AbortSignal.timeout(15000),
          });
          if (response.status !== 429 && response.status < 500) break;
          if (attempt < 2) { await response.body?.cancel(); await new Promise(r => setTimeout(r, 500 * 2 ** attempt)); }
        }
        if (!response) throw new Error("No Firebase response");
        if (response.ok) { result.accepted++; return; }
        const details = await response.text();
        // Only explicitly unregistered tokens are safe to delete; INVALID_ARGUMENT may describe the payload.
        if (details.includes("UNREGISTERED")) {
          const { error: removeError } = await db.from("push_devices").delete().eq("installation_id", device.installation_id);
          if (removeError) console.error("Stale push cleanup failed", removeError.message);
        }
        let providerMessage = "Firebase rejected the notification";
        try { providerMessage = JSON.parse(details).error?.message ?? providerMessage; } catch { /* avoid exposing token-bearing raw responses */ }
        throw new Error(`Firebase [${response.status}]: ${providerMessage.replaceAll(device.token, "[device]")}`);
      } catch (e) {
        result.failed++;
        const message = e instanceof Error ? e.message : "Push delivery failed";
        if (!result.errors.includes(message)) result.errors.push(message);
      }
    }));
  }
  return result;
}
