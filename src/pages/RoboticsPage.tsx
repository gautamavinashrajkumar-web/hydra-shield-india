import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RobotGrid, { type Cell } from "@/components/robotics/RobotGrid";
import { astar, type Point } from "@/lib/astar";
import { classifyRisk, riskScore, type RiskLevel } from "@/lib/floodRisk";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Bot, Play, Waves, RotateCcw, AlertTriangle } from "lucide-react";

const ROWS = 14, COLS = 20;
const START: Point = { r: 6, c: 1 };
const GOAL: Point = { r: 6, c: 18 };
const WALLS: [number, number][] = [
  ...[2, 3, 4, 5].map((r) => [r, 5] as [number, number]),
  ...[8, 9, 10, 11].map((r) => [r, 5] as [number, number]),
  ...[3, 4, 5, 6, 7].map((r) => [r, 14] as [number, number]),
  [10, 13], [10, 14], [10, 15], [1, 9], [12, 10],
];
// Preset flood zones, applied in rotation. Zone 1 blocks the middle river band,
// zone 2 floods the remaining crossings so that no route is left.
const FLOOD_ZONES: [number, number][][] = [
  Array.from({ length: 10 }, (_, i) => [i + 2, 9] as [number, number]).concat(Array.from({ length: 10 }, (_, i) => [i + 2, 10] as [number, number])),
  [[0, 9], [0, 10], [1, 10], [12, 9], [13, 9], [13, 10]],
];

type Status = "Idle" | "Navigating" | "Rerouting" | "Arrived" | "Blocked";

const initialCells = (): Cell[][] => {
  const g: Cell[][] = Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill("free"));
  WALLS.forEach(([r, c]) => (g[r][c] = "wall"));
  return g;
};
const plan = (cells: Cell[][], from: Point) => astar(ROWS, COLS, (r, c) => cells[r][c] !== "free", from, GOAL);

export default function RoboticsPage() {
  const [cells, setCells] = useState<Cell[][]>(initialCells);
  const [robot, setRobot] = useState<Point>(START);
  const [path, setPath] = useState<Point[]>(() => plan(initialCells(), START) ?? []);
  const [status, setStatus] = useState<Status>("Idle");
  const [reroutes, setReroutes] = useState(0);
  const [zoneIdx, setZoneIdx] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [cond, setCond] = useState({ rainfall: 10, waterLevel: 0.8, soilMoisture: 30 });
  const risk: RiskLevel = useMemo(() => classifyRisk(cond), [cond]);
  const prevRisk = useRef<RiskLevel>(risk);
  const state = useRef({ cells, robot, path, status });
  state.current = { cells, robot, path, status };

  const addLog = (m: string) => setLog((l) => [`${new Date().toLocaleTimeString()} — ${m}`, ...l].slice(0, 8));

  // Robot moves one cell every 300 ms along the remaining path
  useEffect(() => {
    if (status !== "Navigating" && status !== "Rerouting") return;
    const t = setInterval(() => {
      const { path: p, cells: g } = state.current;
      if (p.length <= 1) { setStatus("Arrived"); addLog("Destination reached."); return; }
      const next = p[1];
      if (g[next.r][next.c] !== "free") return; // safety: never step into a hazard
      setRobot(next);
      setPath(p.slice(1));
      setStatus("Navigating");
    }, 300);
    return () => clearInterval(t);
  }, [status]);

  const applyFlood = useCallback((reason: string) => {
    const zone = FLOOD_ZONES[zoneIdx % FLOOD_ZONES.length];
    setZoneIdx((i) => i + 1);
    const { cells: old, robot: pos, path: p, status: st } = state.current;
    const g = old.map((row) => [...row]);
    zone.forEach(([r, c]) => { if (g[r][c] === "free" && !(r === pos.r && c === pos.c)) g[r][c] = "flood"; });
    setCells(g);
    addLog(`${reason}: flood zone ${(zoneIdx % FLOOD_ZONES.length) + 1} marked hazardous.`);
    if (st === "Arrived" || st === "Blocked") return;
    const blocked = p.some((q) => g[q.r][q.c] !== "free");
    if (!blocked) { addLog("Current route still safe — no reroute needed."); return; }
    const np = plan(g, pos);
    if (np) {
      setPath(np);
      setReroutes((n) => n + 1);
      if (st !== "Idle") setStatus("Rerouting");
      addLog(`Route blocked — A* found an alternative (${np.length - 1} steps).`);
    } else {
      setPath([]);
      setStatus("Blocked");
      addLog("Route blocked — no safe route exists. Robot stopped.");
    }
  }, [zoneIdx]);

  // HIGH risk from the simulated sensor panel triggers a flood
  useEffect(() => {
    if (risk === "HIGH" && prevRisk.current !== "HIGH") applyFlood("Risk became HIGH");
    prevRisk.current = risk;
  }, [risk, applyFlood]);

  const start = () => {
    if (status === "Blocked" || status === "Arrived" || path.length === 0) return;
    setStatus("Navigating");
    addLog("Navigation started.");
  };
  const reset = () => {
    const g = initialCells();
    setCells(g); setRobot(START); setPath(plan(g, START) ?? []); setStatus("Idle");
    setReroutes(0); setZoneIdx(0); setLog([]);
    setCond({ rainfall: 10, waterLevel: 0.8, soilMoisture: 30 });
    prevRisk.current = "LOW";
  };

  const riskCls = risk === "HIGH" ? "bg-danger text-danger-foreground" : risk === "MODERATE" ? "bg-warning text-warning-foreground" : "bg-success text-success-foreground";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container py-8">
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2"><Bot className="h-8 w-8 text-accent" /> Robotics Simulation</h1>
          <p className="text-muted-foreground mt-1 mb-6">Flood-aware autonomous robot navigation using A* path planning. Fully simulated — no hardware required.</p>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap gap-2">
                  <Button onClick={start} disabled={status === "Navigating" || status === "Rerouting" || status === "Blocked" || status === "Arrived"}><Play className="h-4 w-4" /> Start Navigation</Button>
                  <Button variant="secondary" onClick={() => applyFlood("Simulate Flood")}><Waves className="h-4 w-4" /> Simulate Flood</Button>
                  <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset Simulation</Button>
                </div>
              </CardHeader>
              <CardContent>
                {status === "Blocked" && (
                  <div className="mb-3 flex items-center gap-2 rounded-md bg-danger p-3 text-sm text-danger-foreground" role="alert">
                    <AlertTriangle className="h-4 w-4" /> No safe route to the destination. The robot has stopped.
                  </div>
                )}
                <RobotGrid cells={cells} robot={robot} goal={GOAL} start={START} path={path} />
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                  {[["bg-card border", "Safe"], ["bg-foreground/80", "Obstacle"], ["bg-accent/70", "Flooded / hazard"], ["bg-warning/50", "Planned route"], ["bg-danger rounded-full", "Robot"], ["bg-muted-foreground/40", "Start"], ["bg-success", "Destination"]].map(([c, l]) => (
                    <span key={l} className="flex items-center gap-1.5"><span className={`inline-block h-3 w-3 ${c}`} />{l}</span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-lg">Navigation status</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-1">
                  <div>Status: <strong data-testid="nav-status">{status}</strong></div>
                  <div>Position: <strong data-testid="robot-pos">({robot.r}, {robot.c})</strong></div>
                  <div>Destination: ({GOAL.r}, {GOAL.c})</div>
                  <div>Remaining steps: <strong>{Math.max(0, path.length - 1)}</strong></div>
                  <div>Reroutes: <strong>{reroutes}</strong></div>
                  {log.length > 0 && <ul className="mt-2 border-t pt-2 text-xs text-muted-foreground space-y-0.5">{log.map((l, i) => <li key={i}>{l}</li>)}</ul>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Environmental conditions</CardTitle>
                  <CardDescription>SIMULATED sensor values</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  {([
                    ["rainfall", "Rainfall intensity (simulated)", 0, 100, 1, "mm/h"],
                    ["waterLevel", "Water level (simulated)", 0, 5, 0.1, "m"],
                    ["soilMoisture", "Soil moisture (simulated)", 0, 100, 1, "%"],
                  ] as const).map(([k, label, min, max, step, unit]) => (
                    <div key={k} className="space-y-2">
                      <div className="flex justify-between"><span>{label}</span><strong>{cond[k]} {unit}</strong></div>
                      <Slider aria-label={label} min={min} max={max} step={step} value={[cond[k]]} onValueChange={([v]) => setCond((c) => ({ ...c, [k]: v }))} />
                    </div>
                  ))}
                  <div className={`rounded-md p-3 text-center font-bold ${riskCls}`} data-testid="risk-level">{risk} RISK (score {riskScore(cond)}/6)</div>
                  <details className="text-xs text-muted-foreground">
                    <summary className="cursor-pointer">Classification rules</summary>
                    <ul className="mt-1 list-disc pl-4 space-y-0.5">
                      <li>Rainfall: &lt;20 → 0, 20–49 → 1, ≥50 → 2</li>
                      <li>Water level: &lt;1.5 → 0, 1.5–2.9 → 1, ≥3 → 2</li>
                      <li>Soil moisture: &lt;40 → 0, 40–74 → 1, ≥75 → 2</li>
                      <li>Total 0–1 LOW · 2–3 MODERATE · 4–6 HIGH</li>
                      <li>HIGH risk floods a zone and triggers rerouting.</li>
                    </ul>
                  </details>
                  <p className="text-xs text-muted-foreground">This is a simple rule-based system for demonstration. It is not a trained AI model or a validated real-world flood prediction system.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
