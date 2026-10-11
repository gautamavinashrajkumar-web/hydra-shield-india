import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

const Body = z.object({
  title: z.string().trim().min(1).max(120),
  message: z.string().trim().min(1).max(1600),
  inApp: z.boolean().default(true),
  email: z.boolean().default(false),
});

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);
    const url = Deno.env.get("SUPABASE_URL")!;
    const userClient = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: userData.user.id, _role: "admin" });
    if (!isAdmin) return json({ error: "Forbidden" }, 403);

    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
    const { title, message, inApp, email } = parsed.data;
    if (!inApp && !email) return json({ error: "Choose at least one channel" }, 400);

    let inAppSent = false;
    if (inApp) {
      const { error } = await admin.from("notifications").insert({ title, body: message });
      if (error) return json({ error: error.message }, 500);
      inAppSent = true;
    }

    let emailResult: { success: number; failed: number; total: number; note?: string } | null = null;
    if (email) {
      const { count } = await admin.from("alert_subscribers").select("id", { count: "exact", head: true }).not("email", "is", null);
      emailResult = { success: 0, failed: 0, total: count ?? 0, note: "Email not configured yet. Set up a sender domain to enable email alerts." };
    }

    return json({ inAppSent, email: emailResult });
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
