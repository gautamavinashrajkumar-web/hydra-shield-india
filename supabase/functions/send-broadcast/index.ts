import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

const Body = z.object({ message: z.string().trim().min(1).max(1600) });

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const url = Deno.env.get("SUPABASE_URL")!;
    const userClient = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) return json({ error: "Forbidden" }, 403);

    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);

    const sid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const token = Deno.env.get("TWILIO_AUTH_TOKEN");
    const from = Deno.env.get("TWILIO_FROM_NUMBER");
    if (!sid || !token || !from) {
      return json({ error: "SMS not configured yet. Add Twilio secrets in project settings." }, 503);
    }

    const { data: subs, error: subErr } = await admin.from("alert_subscribers").select("phone_number");
    if (subErr) return json({ error: subErr.message }, 500);

    const auth = "Basic " + btoa(`${sid}:${token}`);
    const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
    let success = 0;
    let failed = 0;
    const errors: string[] = [];
    const phones = (subs ?? []).map((s) => s.phone_number);

    for (let i = 0; i < phones.length; i += 10) {
      const batch = phones.slice(i, i + 10);
      const results = await Promise.all(
        batch.map(async (to) => {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { Authorization: auth, "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ To: to, From: from, Body: parsed.data.message }),
          });
          if (!res.ok) {
            const t = await res.text();
            console.error(`Twilio failed [${res.status}] for ${to}: ${t}`);
            if (errors.length < 3) errors.push(t.slice(0, 200));
          }
          return res.ok;
        }),
      );
      results.forEach((ok) => (ok ? success++ : failed++));
    }

    return json({ success, failed, total: phones.length, errors });
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
