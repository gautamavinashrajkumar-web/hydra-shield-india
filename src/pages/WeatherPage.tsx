import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WeatherCard from "@/components/WeatherCard";
import DischargeChart from "@/components/DischargeChart";
import SevereWeatherBanner from "@/components/SevereWeatherBanner";
import { useWeatherData, useFloodData } from "@/hooks/useWeatherData";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

export default function WeatherPage() {
  const { data: weather, isLoading: wLoading, error: wError } = useWeatherData();
  const { data: flood, isLoading: fLoading } = useFloodData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SevereWeatherBanner />
      <main className="flex-1 glass-bg">
        <div className="container py-10">
          <div className="mb-8 text-primary-foreground">
            <h1 className="font-heading text-3xl font-bold mb-2">Weather Dashboard</h1>
            <p className="text-primary-foreground/70">Live conditions across major Indian cities. Refreshes every 5 minutes.</p>
          </div>

          {wError && (
            <div className="flex items-center gap-2 text-danger mb-4">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Failed to load weather data. Retrying...</span>
            </div>
          )}

          <section className="mb-12">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wLoading
                ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-xl bg-primary-foreground/10" />)
                : weather?.map((w) => <WeatherCard key={w.city.name} data={w} />)}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-4 text-primary-foreground">River Discharge Forecasts</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {fLoading
                ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl bg-primary-foreground/10" />)
                : flood?.map((f) => <DischargeChart key={f.city.name} data={f} />)}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
