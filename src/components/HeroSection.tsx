import { Link } from "react-router-dom";
import { MapPin, CloudRain, AlertTriangle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
  { label: "States Monitored", value: "28+", icon: MapPin },
  { label: "Active Rivers Tracked", value: "150+", icon: CloudRain },
  { label: "Alert Zones", value: "10", icon: AlertTriangle },
  { label: "Helplines Active", value: "24/7", icon: Phone },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 25% 50%, hsl(205 70% 45%) 0%, transparent 50%), radial-gradient(circle at 75% 50%, hsl(205 70% 45%) 0%, transparent 50%)",
        }} />
      </div>

      <div className="container relative py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 text-sm font-medium mb-6">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse-slow" />
            Live Monitoring Active
          </div>

          <h1 className="font-heading text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Real-Time Flood Intelligence for India
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Monitor flood-prone regions, track weather patterns, and receive early warnings.
            HydraShield helps protect communities with data-driven insights from across India.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              <Link to="/map">View Live Map</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/alerts">Check Alerts</Link>
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10">
              <stat.icon className="h-5 w-5 mx-auto mb-2 text-accent" />
              <div className="text-2xl md:text-3xl font-bold font-heading">{stat.value}</div>
              <div className="text-xs text-primary-foreground/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
