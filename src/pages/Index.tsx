import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import { Link } from "react-router-dom";
import { MapPin, CloudRain, AlertTriangle, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: MapPin,
    title: "Live Flood Map",
    description: "Interactive map showing real-time flood zones, water levels, and risk areas across India.",
    link: "/map",
  },
  {
    icon: CloudRain,
    title: "Weather Dashboard",
    description: "Real-time weather data for major Indian cities including rainfall, temperature, and river discharge.",
    link: "/weather",
  },
  {
    icon: AlertTriangle,
    title: "Alerts & Warnings",
    description: "Color-coded flood alerts and warnings with severity levels. Stay informed, stay safe.",
    link: "/alerts",
  },
  {
    icon: BookOpen,
    title: "Resources & Helplines",
    description: "Emergency contacts, safety guidelines, and links to official disaster management agencies.",
    link: "/resources",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSection />

      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold mb-3">Platform Features</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Comprehensive tools for monitoring, alerting, and managing flood risks across the nation.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Link key={f.link} to={f.link}>
              <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center">
                    <f.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Data sources badge */}
      <section className="bg-muted py-10">
        <div className="container text-center">
          <h3 className="font-heading font-semibold text-lg mb-4">Powered By</h3>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border">Open-Meteo API</span>
            <span className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border">OpenStreetMap</span>
            <span className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border">Leaflet.js</span>
            <span className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border">India CWC Data</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
