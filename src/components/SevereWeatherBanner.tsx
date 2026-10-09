import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useWeatherData } from "@/hooks/useWeatherData";

export default function SevereWeatherBanner() {
  const { data } = useWeatherData();
  const [dismissed, setDismissed] = useState(false);
  const severe = (data ?? []).filter((w) => w.rainfall >= 20 || w.weatherCode >= 95);
  if (dismissed || severe.length === 0) return null;
  const storm = severe.some((w) => w.weatherCode >= 95);

  return (
    <div className={`${storm ? "bg-danger text-danger-foreground" : "bg-warning text-warning-foreground"}`} role="alert">
      <div className="container flex items-center gap-3 py-3">
        <AlertTriangle className="h-5 w-5 shrink-0 animate-pulse-slow" />
        <p className="flex-1 text-sm font-medium">
          <strong>Severe weather warning:</strong>{" "}
          {storm ? "Thunderstorms / heavy rain" : "Heavy rainfall"} in {severe.map((w) => w.city.name).join(", ")}. Stay alert and avoid low-lying areas.
        </p>
        <button onClick={() => setDismissed(true)} aria-label="Dismiss warning"><X className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
