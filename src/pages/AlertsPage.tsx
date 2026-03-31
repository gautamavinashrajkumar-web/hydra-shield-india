import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AlertCard, { type AlertSeverity } from "@/components/AlertCard";
import { SAMPLE_ALERTS } from "@/data/alertsData";
import { Button } from "@/components/ui/button";

const FILTERS: { label: string; value: AlertSeverity | "all" }[] = [
  { label: "All Alerts", value: "all" },
  { label: "🔴 Danger", value: "red" },
  { label: "🟠 Warning", value: "orange" },
  { label: "🟡 Watch", value: "yellow" },
];

export default function AlertsPage() {
  const [filter, setFilter] = useState<AlertSeverity | "all">("all");

  const filtered = filter === "all" ? SAMPLE_ALERTS : SAMPLE_ALERTS.filter((a) => a.severity === filter);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-bold mb-2">Alerts & Warnings</h1>
          <p className="text-muted-foreground">
            Active flood alerts across India. Severity-coded for quick assessment.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No alerts for this severity level.</p>
          ) : (
            filtered.map((alert) => <AlertCard key={alert.id} alert={alert} />)
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
