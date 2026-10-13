/**
 * Simple rule-based flood-risk classifier (SIMULATED inputs).
 * Not a trained AI model and not a validated real-world prediction system.
 *
 * Each input scores 0, 1 or 2:
 *   Rainfall (mm/h):   <20 → 0,  20–49 → 1,  ≥50 → 2
 *   Water level (m):   <1.5 → 0, 1.5–2.9 → 1, ≥3 → 2
 *   Soil moisture (%): <40 → 0,  40–74 → 1,  ≥75 → 2
 * Total 0–1 → LOW, 2–3 → MODERATE, 4–6 → HIGH.
 */
export type RiskLevel = "LOW" | "MODERATE" | "HIGH";
export type Conditions = { rainfall: number; waterLevel: number; soilMoisture: number };

const band = (v: number, mid: number, high: number) => (v >= high ? 2 : v >= mid ? 1 : 0);

export function riskScore({ rainfall, waterLevel, soilMoisture }: Conditions): number {
  return band(rainfall, 20, 50) + band(waterLevel, 1.5, 3) + band(soilMoisture, 40, 75);
}

export function classifyRisk(c: Conditions): RiskLevel {
  const s = riskScore(c);
  return s >= 4 ? "HIGH" : s >= 2 ? "MODERATE" : "LOW";
}
