import { Droplets, Wind } from "lucide-react";
import { type WeatherData, getWeatherDescription } from "@/hooks/useWeatherData";
import WeatherIcon from "./WeatherIcon";

export default function WeatherCard({ data }: { data: WeatherData }) {
  const isRainy = data.rainfall > 0;
  const severe = data.rainfall >= 20 || data.weatherCode >= 95;

  return (
    <div className={`glass-card p-5 transition-transform hover:-translate-y-1 ${severe ? "ring-2 ring-danger" : ""}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-heading font-semibold text-primary-foreground">{data.city.name}</h3>
          <p className="text-xs text-primary-foreground/60">{data.city.state}</p>
        </div>
        <WeatherIcon code={data.weatherCode} isDay={data.isDay} className="h-10 w-10" />
      </div>
      <div className="flex items-end justify-between mb-4">
        <span className="text-4xl font-bold font-heading text-primary-foreground">{Math.round(data.temperature)}°</span>
        <span className="text-xs text-primary-foreground/70">{getWeatherDescription(data.weatherCode)}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs text-primary-foreground">
        <div className="rounded-md bg-primary-foreground/10 p-2">
          <div className="font-semibold">{data.humidity}%</div>
          <div className="text-primary-foreground/60">Humidity</div>
        </div>
        <div className="rounded-md bg-primary-foreground/10 p-2">
          <Wind className="h-3 w-3 mx-auto mb-0.5" />
          <div className="font-semibold">{data.windSpeed} km/h</div>
        </div>
        <div className={`rounded-md p-2 ${isRainy ? "bg-accent/30" : "bg-primary-foreground/10"}`}>
          <Droplets className="h-3 w-3 mx-auto mb-0.5" />
          <div className="font-semibold">{data.rainfall} mm</div>
        </div>
      </div>
    </div>
  );
}
