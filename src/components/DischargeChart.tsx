import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type FloodApiData } from "@/hooks/useWeatherData";

export default function DischargeChart({ data }: { data: FloodApiData }) {
  const chartData = data.dates.map((date, i) => ({
    date: new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    discharge: data.dailyDischarge[i] ?? 0,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {data.city.name} — {data.city.riverName}
        </CardTitle>
        <CardDescription className="text-xs">7-day river discharge forecast (m³/s)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="discharge"
                stroke="hsl(205, 70%, 45%)"
                fill="hsl(205, 70%, 45%)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
