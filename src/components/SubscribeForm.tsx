import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, BellRing } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(255),
  region: z.string().trim().min(1, "City/Region is required").max(100),
});

export default function SubscribeForm() {
  const [form, setForm] = useState({ name: "", email: "", region: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    const { error } = await supabase.from("alert_subscribers").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      region: parsed.data.region,
    });
    setLoading(false);
    if (error) {
      if (error.code === "23505") toast.error("This email is already subscribed.");
      else toast.error("Could not subscribe. Please try again.");
      return;
    }
    if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
    toast.success("You're subscribed! You'll get emergency alerts by email and in the app.");
    setForm({ name: "", email: "", region: "" });
  }

  const field = (key: keyof typeof form, label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="space-y-1.5">
      <Label htmlFor={key}>{label}</Label>
      <Input id={key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="glass-input" {...props} />
      {errors[key] && <p className="text-xs text-danger">{errors[key]}</p>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {field("name", "Full Name", { placeholder: "Your name", maxLength: 100, autoComplete: "name" })}
      {field("email", "Email", { type: "email", placeholder: "you@example.com", maxLength: 255, autoComplete: "email" })}
      {field("region", "City / Region", { placeholder: "e.g. Guwahati, Assam", maxLength: 100 })}
      <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BellRing className="h-4 w-4" />}
        Subscribe to Alerts
      </Button>
    </form>
  );
}
