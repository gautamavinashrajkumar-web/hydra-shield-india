import { Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudRainWind, CloudLightning, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WeatherIcon({ code, isDay = true, className }: { code: number; isDay?: boolean; className?: string }) {
  let Icon = Cloud;
  let color = "text-muted-foreground";
  if (code === 0) { Icon = isDay ? Sun : Moon; color = isDay ? "text-warning" : "text-accent"; }
  else if (code <= 2) { Icon = isDay ? CloudSun : CloudMoon; color = "text-warning"; }
  else if (code === 3) Icon = Cloud;
  else if (code <= 48) Icon = CloudFog;
  else if (code <= 57) { Icon = CloudDrizzle; color = "text-accent"; }
  else if (code <= 67) { Icon = code >= 65 ? CloudRainWind : CloudRain; color = "text-accent"; }
  else if (code <= 77) Icon = Snowflake;
  else if (code <= 82) { Icon = code >= 81 ? CloudRainWind : CloudRain; color = "text-accent"; }
  else if (code <= 86) Icon = Snowflake;
  else if (code >= 95) { Icon = CloudLightning; color = "text-danger"; }
  return <Icon className={cn(color, className)} />;
}
