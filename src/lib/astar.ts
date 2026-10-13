/**
 * A* path planning on a 4-connected grid.
 * - g(n): cost from start to n (each move costs 1)
 * - h(n): Manhattan distance from n to goal (admissible for 4-dir moves)
 * - f(n) = g(n) + h(n); the open-set node with the lowest f is expanded first.
 * Returns the path from start to goal (inclusive), or null when no route exists.
 */
export type Point = { r: number; c: number };

export function astar(
  rows: number,
  cols: number,
  isBlocked: (r: number, c: number) => boolean,
  start: Point,
  goal: Point,
): Point[] | null {
  const key = (r: number, c: number) => r * cols + c;
  const h = (r: number, c: number) => Math.abs(r - goal.r) + Math.abs(c - goal.c);
  if (isBlocked(start.r, start.c) || isBlocked(goal.r, goal.c)) return null;

  const g = new Map<number, number>([[key(start.r, start.c), 0]]);
  const f = new Map<number, number>([[key(start.r, start.c), h(start.r, start.c)]]);
  const cameFrom = new Map<number, number>();
  const open = new Set<number>([key(start.r, start.c)]);
  const closed = new Set<number>();

  while (open.size) {
    // pick open node with lowest f (ties broken by lower h)
    let cur = -1;
    for (const k of open) {
      if (cur === -1) { cur = k; continue; }
      const fk = f.get(k)!, fc = f.get(cur)!;
      if (fk < fc || (fk === fc && h(Math.floor(k / cols), k % cols) < h(Math.floor(cur / cols), cur % cols))) cur = k;
    }
    const cr = Math.floor(cur / cols), cc = cur % cols;
    if (cr === goal.r && cc === goal.c) {
      const path: Point[] = [{ r: cr, c: cc }];
      let k = cur;
      while (cameFrom.has(k)) { k = cameFrom.get(k)!; path.unshift({ r: Math.floor(k / cols), c: k % cols }); }
      return path;
    }
    open.delete(cur);
    closed.add(cur);

    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = cr + dr, nc = cc + dc;
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || isBlocked(nr, nc)) continue;
      const nk = key(nr, nc);
      if (closed.has(nk)) continue;
      const tentative = g.get(cur)! + 1;
      if (tentative < (g.get(nk) ?? Infinity)) {
        cameFrom.set(nk, cur);
        g.set(nk, tentative);
        f.set(nk, tentative + h(nr, nc));
        open.add(nk);
      }
    }
  }
  return null;
}
