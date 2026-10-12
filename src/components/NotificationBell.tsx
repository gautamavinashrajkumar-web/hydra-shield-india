import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Notif = { id: string; title: string; body: string; created_at: string; region: string | null };
const KEY = "hydrashield_last_read";
const relevant = (n: Notif) => {
  if (!n.region) return true;
  const mine = (localStorage.getItem("hydrashield_region") ?? "").trim().toLowerCase();
  return !!mine && mine === n.region.trim().toLowerCase();
};

export default function NotificationBell() {
  const [items, setItems] = useState<Notif[]>([]);
  const [lastRead, setLastRead] = useState(() => localStorage.getItem(KEY) ?? "1970-01-01");

  useEffect(() => {
    supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => setItems(((data as Notif[]) ?? []).filter(relevant).slice(0, 30)));
    if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
    const ch = supabase.channel("notifications-feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (p) => {
        const n = p.new as Notif;
        if (!relevant(n)) return;
        setItems((prev) => [n, ...prev]);
        if ("Notification" in window && Notification.permission === "granted") {
          try { new Notification(n.title, { body: n.body }); } catch { /* ignore */ }
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const unread = items.filter((i) => i.created_at > lastRead).length;

  return (
    <Popover onOpenChange={(o) => { if (o && items[0]) { localStorage.setItem(KEY, items[0].created_at); setTimeout(() => setLastRead(items[0].created_at), 1500); } }}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative text-primary-foreground hover:bg-primary-foreground/10">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-danger text-danger-foreground text-[10px] font-bold flex items-center justify-center px-1">{unread}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 max-h-96 overflow-y-auto">
        <div className="px-4 py-3 border-b font-semibold text-sm">Notifications</div>
        {items.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">No alerts yet.</p>
        ) : items.map((n) => (
          <div key={n.id} className={`px-4 py-3 border-b last:border-0 ${n.created_at > lastRead ? "bg-muted" : ""}`}>
            <p className="font-medium text-sm">{n.title}</p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{n.body}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString("en-IN")}</p>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
