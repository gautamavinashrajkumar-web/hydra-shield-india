import { AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type AlertSeverity = "yellow" | "orange" | "red";

export interface FloodAlert {
  id: string;
  title: string;
  region: string;
  state: string;
  severity: AlertSeverity;
  description: string;
  timestamp: string;
}

const SEVERITY_CONFIG: Record<AlertSeverity, { label: string; className: string; Icon: typeof AlertTriangle }> = {
  yellow: { label: "Watch", className: "bg-warning text-warning-foreground", Icon: Info },
  orange: { label: "Warning", className: "bg-[hsl(25,95%,53%)] text-white", Icon: AlertTriangle },
  red: { label: "Danger", className: "bg-danger text-danger-foreground", Icon: ShieldAlert },
};

export default function AlertCard({ alert }: { alert: FloodAlert }) {
  const config = SEVERITY_CONFIG[alert.severity];
  const IconComp = config.Icon;

  return (
    <Card className={`border-l-4 ${
      alert.severity === "red" ? "border-l-danger" :
      alert.severity === "orange" ? "border-l-warning" :
      "border-l-warning"
    }`}>
      <CardContent className="flex gap-4 p-4">
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${config.className}`}>
          <IconComp className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-heading font-semibold text-sm">{alert.title}</h3>
            <Badge className={config.className}>{config.label}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{alert.region}, {alert.state}</p>
          <p className="text-sm text-card-foreground/80">{alert.description}</p>
          <p className="text-xs text-muted-foreground mt-2">{alert.timestamp}</p>
        </div>
      </CardContent>
    </Card>
  );
}
