import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Thermometer, Wind, Eye, Phone, ShieldAlert, MapPin } from "lucide-react";
import { getHelplineForState } from "@/data/helplineData";
import { getWeatherDescription } from "@/hooks/useWeatherData";
import { DischargeChart } from "@/components/DischargeChart";

function getFloodRisk(rainfall: number) {
  if (rainfall >= 50) return { level: "Danger", style: "bg-danger text-danger-foreground" };
  if (rainfall >= 10) return { level: "Warning", style: "bg-[hsl(25,90%,50%)] text-white" };
  if (rainfall > 0) return { level: "Watch", style: "bg-warning text-warning-foreground" };
  return { level: "Safe", style: "bg-success text-success-foreground" };
}

export default function LocationPage() {
  const { lat, lon, name } = useParams();
  const [searchParams] = useSearchParams();
  const state = searchParams.get("state") || undefined;
  const latitude = parseFloat(lat || "0");
  const longitude = parseFloat(lon || "0");
  const locationName = decodeURIComponent(name || "Unknown");
  const helplineInfo = getHelplineForState(state);

  const { data: weather, isLoading: weatherLoading } = useQuery({
    queryKey: ["location-weather", lat, lon],
    queryFn: async () => {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code,is_day&timezone=Asia/Kolkata`
      );
      return res.json();
    },
  });

  const { data: flood } = useQuery({
    queryKey: ["location-flood", lat, lon],
    queryFn: async () => {
      const res = await fetch(
        `https://flood-api.open-meteo.com/v1/flood?latitude=${latitude}&longitude=${longitude}&daily=river_discharge&forecast_days=7`
      );
      return res.json();
    },
  });

  const current = weather?.current;
  const rainfall = current?.precipitation ?? 0;
  const risk = getFloodRisk(rainfall);

  const dischargeData = flood?.daily?.time?.map((date: string, i: number) => ({
    date,
    discharge: flood.daily.river_discharge?.[i] ?? 0,
  })) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 space-y-6">
        {/* Location header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-accent" />
            <h1 className="text-2xl font-bold text-foreground">{locationName}</h1>
            {state && <span className="text-muted-foreground">({state})</span>}
          </div>
          <Badge className={`${risk.style} text-sm px-3 py-1 w-fit`}>
            <ShieldAlert className="h-4 w-4 mr-1" />
            Flood Risk: {risk.level}
          </Badge>
        </div>

        {/* Helpline */}
        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="flex items-center gap-3 py-4">
            <Phone className="h-5 w-5 text-accent" />
            <div>
              <p className="font-semibold text-foreground">Emergency Helpline: <a href={`tel:${helplineInfo.helpline}`} className="text-accent underline">{helplineInfo.helpline}</a></p>
              <p className="text-sm text-muted-foreground">{helplineInfo.label}</p>
            </div>
          </CardContent>
        </Card>

        {/* Weather data */}
        {weatherLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading weather data...</div>
        ) : current ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="flex flex-col items-center py-6">
                <Thermometer className="h-8 w-8 text-destructive mb-2" />
                <p className="text-2xl font-bold text-foreground">{current.temperature_2m}°C</p>
                <p className="text-sm text-muted-foreground">Temperature</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center py-6">
                <Droplets className="h-8 w-8 text-accent mb-2" />
                <p className="text-2xl font-bold text-foreground">{rainfall} mm</p>
                <p className="text-sm text-muted-foreground">Rainfall</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center py-6">
                <Wind className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-2xl font-bold text-foreground">{current.wind_speed_10m} km/h</p>
                <p className="text-sm text-muted-foreground">Wind Speed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center py-6">
                <Eye className="h-8 w-8 text-success mb-2" />
                <p className="text-2xl font-bold text-foreground">{current.relative_humidity_2m}%</p>
                <p className="text-sm text-muted-foreground">Humidity</p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {current && (
          <p className="text-muted-foreground text-sm">
            Current condition: <strong>{getWeatherDescription(current.weather_code)}</strong>
          </p>
        )}

        {/* Discharge chart */}
        {dischargeData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">7-Day River Discharge Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <DischargeChart data={dischargeData} />
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
