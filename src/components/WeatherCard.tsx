import { Cloud, Droplets, Wind, Thermometer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type WeatherData, getWeatherDescription } from "@/hooks/useWeatherData";

export default function WeatherCard({ data }: { data: WeatherData }) {
  const isRainy = data.rainfall > 0;

  return (
    <Card className={`transition-shadow hover:shadow-md ${isRainy ? "border-accent" : ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span>{data.city.name}</span>
          <span className="text-xs font-normal text-muted-foreground">{data.city.state}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-destructive" />
            <span className="text-2xl font-bold font-heading">{data.temperature}°C</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Cloud className="h-3.5 w-3.5" />
            {getWeatherDescription(data.weatherCode)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-md bg-muted p-2">
            <Droplets className="h-3.5 w-3.5 mx-auto mb-1 text-accent" />
            <div className="font-semibold">{data.humidity}%</div>
            <div className="text-muted-foreground">Humidity</div>
          </div>
          <div className="rounded-md bg-muted p-2">
            <Wind className="h-3.5 w-3.5 mx-auto mb-1 text-accent" />
            <div className="font-semibold">{data.windSpeed}</div>
            <div className="text-muted-foreground">km/h</div>
          </div>
          <div className={`rounded-md p-2 ${isRainy ? "bg-accent/10" : "bg-muted"}`}>
            <Droplets className={`h-3.5 w-3.5 mx-auto mb-1 ${isRainy ? "text-accent" : "text-muted-foreground"}`} />
            <div className="font-semibold">{data.rainfall}mm</div>
            <div className="text-muted-foreground">Rain</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
