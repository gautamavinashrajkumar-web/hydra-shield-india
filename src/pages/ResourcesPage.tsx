import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Shield, ExternalLink, CheckCircle, XCircle } from "lucide-react";

const HELPLINES = [
  { name: "National Disaster Helpline", number: "1078", org: "NDMA" },
  { name: "NDRF Control Room", number: "011-24363260", org: "NDRF" },
  { name: "National Emergency Number", number: "112", org: "Govt. of India" },
  { name: "Flood Control Room — Delhi", number: "011-22652536", org: "Delhi Govt." },
  { name: "Assam SDMA", number: "1079", org: "Assam Govt." },
  { name: "Bihar Disaster Helpline", number: "0612-2294204", org: "Bihar SDMA" },
  { name: "Maharashtra SDMA", number: "022-22027990", org: "Maharashtra Govt." },
  { name: "Kerala SDMA", number: "0471-2364424", org: "Kerala Govt." },
];

const OFFICIAL_LINKS = [
  { name: "National Disaster Management Authority", url: "https://ndma.gov.in", abbr: "NDMA" },
  { name: "India Meteorological Department", url: "https://mausam.imd.gov.in", abbr: "IMD" },
  { name: "Central Water Commission", url: "https://cwc.gov.in", abbr: "CWC" },
  { name: "National Disaster Response Force", url: "https://ndrf.gov.in", abbr: "NDRF" },
  { name: "Indian Space Research Organisation", url: "https://www.isro.gov.in", abbr: "ISRO" },
];

const DOS = [
  "Move to higher ground immediately if flooding begins",
  "Keep emergency kit ready with essentials",
  "Listen to official warnings on radio/TV",
  "Disconnect electrical appliances before evacuating",
  "Avoid walking/driving through floodwater",
  "Keep important documents in waterproof bags",
];

const DONTS = [
  "Don't ignore flood warnings or advisories",
  "Don't attempt to cross flooded bridges or roads",
  "Don't touch electrical equipment in wet areas",
  "Don't drink floodwater — it may be contaminated",
  "Don't return home until authorities declare it safe",
  "Don't spread unverified information on social media",
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold mb-2">Resources & Helplines</h1>
          <p className="text-muted-foreground">
            Emergency contacts, safety guidelines, and official resources for flood disaster management.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Helplines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-accent" />
                Emergency Helplines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {HELPLINES.map((h) => (
                  <div key={h.number} className="flex items-center justify-between p-3 rounded-md bg-muted">
                    <div>
                      <div className="font-medium text-sm">{h.name}</div>
                      <div className="text-xs text-muted-foreground">{h.org}</div>
                    </div>
                    <a href={`tel:${h.number}`} className="font-heading font-bold text-accent hover:underline">
                      {h.number}
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Official links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                Official Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {OFFICIAL_LINKS.map((link) => (
                  <a
                    key={link.abbr}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-sm">{link.name}</div>
                      <div className="text-xs text-muted-foreground">{link.abbr}</div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Do's */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <CheckCircle className="h-5 w-5" />
                Do's During Floods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {DOS.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Don'ts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" />
                Don'ts During Floods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {DONTS.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
