import { describe, it, expect } from "vitest";
import { astar } from "@/lib/astar";
import { classifyRisk } from "@/lib/floodRisk";

const grid = (walls: string[]) => (r: number, c: number) => walls.includes(`${r},${c}`);

describe("A*", () => {
  it("finds the shortest path on an empty grid", () => {
    const p = astar(5, 5, () => false, { r: 0, c: 0 }, { r: 4, c: 4 });
    expect(p).not.toBeNull();
    expect(p!.length).toBe(9);
  });
  it("avoids obstacles", () => {
    const walls = ["0,2", "1,2", "2,2", "3,2"];
    const p = astar(5, 5, grid(walls), { r: 0, c: 0 }, { r: 0, c: 4 })!;
    expect(p.some((q) => walls.includes(`${q.r},${q.c}`))).toBe(false);
    expect(p.some((q) => q.r === 4)).toBe(true);
  });
  it("returns null when the goal is walled off", () => {
    const walls = ["0,2", "1,2", "2,2", "3,2", "4,2"];
    expect(astar(5, 5, grid(walls), { r: 0, c: 0 }, { r: 0, c: 4 })).toBeNull();
  });
  it("finds an alternative route around a flood", () => {
    const before = astar(5, 5, () => false, { r: 2, c: 0 }, { r: 2, c: 4 })!;
    expect(before.length).toBe(5);
    const flood = ["1,2", "2,2", "3,2"];
    const after = astar(5, 5, grid(flood), { r: 2, c: 0 }, { r: 2, c: 4 })!;
    expect(after.length).toBeGreaterThan(5);
  });
});

describe("flood risk classifier", () => {
  it("classifies thresholds", () => {
    expect(classifyRisk({ rainfall: 5, waterLevel: 0.5, soilMoisture: 20 })).toBe("LOW");
    expect(classifyRisk({ rainfall: 25, waterLevel: 1.6, soilMoisture: 20 })).toBe("MODERATE");
    expect(classifyRisk({ rainfall: 60, waterLevel: 3.2, soilMoisture: 20 })).toBe("HIGH");
  });
});
