import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-heading text-lg font-bold mb-3">
              <Shield className="h-5 w-5" />
              HydraShield
            </div>
            <p className="text-sm text-primary-foreground/70">
              India's real-time flood monitoring and early warning platform. Protecting lives through data-driven intelligence.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/map" className="hover:text-primary-foreground transition-colors">Live Flood Map</Link></li>
              <li><Link to="/weather" className="hover:text-primary-foreground transition-colors">Weather Dashboard</Link></li>
              <li><Link to="/alerts" className="hover:text-primary-foreground transition-colors">Alerts & Warnings</Link></li>
              <li><Link to="/resources" className="hover:text-primary-foreground transition-colors">Resources</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">Official Sources</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="https://ndma.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">NDMA</a></li>
              <li><a href="https://mausam.imd.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">IMD</a></li>
              <li><a href="https://cwc.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">CWC</a></li>
              <li><a href="https://ndrf.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">NDRF</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">Emergency</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>National Disaster Helpline: <strong className="text-primary-foreground">1078</strong></li>
              <li>NDRF: <strong className="text-primary-foreground">011-24363260</strong></li>
              <li>Emergency: <strong className="text-primary-foreground">112</strong></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-primary-foreground/20 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} HydraShield. Data sourced from Open-Meteo & OpenStreetMap. For informational purposes only.
        </div>
      </div>
    </footer>
  );
}
