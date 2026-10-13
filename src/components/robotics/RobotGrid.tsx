import type { Point } from "@/lib/astar";

export type Cell = "free" | "wall" | "flood";

type Props = { cells: Cell[][]; robot: Point; goal: Point; start: Point; path: Point[] };

export default function RobotGrid({ cells, robot, goal, start, path }: Props) {
  const onPath = new Set(path.map((p) => `${p.r},${p.c}`));
  const cols = cells[0].length;
  return (
    <div className="grid gap-px bg-border p-px rounded-md overflow-hidden" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} role="grid" aria-label="Robot environment">
      {cells.flatMap((row, r) =>
        row.map((cell, c) => {
          const isRobot = robot.r === r && robot.c === c;
          const isGoal = goal.r === r && goal.c === c;
          const isStart = start.r === r && start.c === c;
          let cls = "bg-card";
          if (cell === "wall") cls = "bg-foreground/80";
          else if (cell === "flood") cls = "bg-accent/70";
          else if (onPath.has(`${r},${c}`)) cls = "bg-warning/50";
          if (isStart) cls = "bg-muted-foreground/40";
          if (isGoal) cls = "bg-success";
          return (
            <div key={`${r}-${c}`} className={`aspect-square flex items-center justify-center ${cls}`}>
              {isRobot && <div className="w-3/4 h-3/4 rounded-full bg-danger ring-2 ring-danger-foreground" aria-label="Robot" />}
            </div>
          );
        }),
      )}
    </div>
  );
}
