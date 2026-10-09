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
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, "").replace(/^(\+91|91|0)/, ""))
    .refine((v) => /^[6-9]\d{9}$/.test(v), "Enter a valid 10-digit Indian mobile number"),
  region: z.string().trim().min(1, "City/Region is required").max(100),
});

export default function SubscribeForm() {
  const [form, setForm] = useState({ name: "", phone: "", region: "" });
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
      phone_number: `+91${parsed.data.phone}`,
      region: parsed.data.region,
    });
    setLoading(false);
    if (error) {
      if (error.code === "23505") toast.error("This phone number is already subscribed.");
      else toast.error("Could not subscribe. Please try again.");
      return;
    }
    toast.success("You're subscribed! You'll receive SMS alerts for emergencies.");
    setForm({ name: "", phone: "", region: "" });
  }

  const field = (key: keyof typeof form, label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="space-y-1.5">
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="glass-input"
        {...props}
      />
      {errors[key] && <p className="text-xs text-danger">{errors[key]}</p>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {field("name", "Full Name", { placeholder: "Your name", maxLength: 100, autoComplete: "name" })}
      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">+91</span>
          <Input
            id="phone"
            type="tel"
            inputMode="numeric"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="98765 43210"
            maxLength={15}
            className="rounded-l-none glass-input"
            autoComplete="tel-national"
          />
        </div>
        {errors.phone && <p className="text-xs text-danger">{errors.phone}</p>}
      </div>
      {field("region", "City / Region", { placeholder: "e.g. Guwahati, Assam", maxLength: 100 })}
      <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BellRing className="h-4 w-4" />}
        Subscribe to Alerts
      </Button>
    </form>
  );
}
