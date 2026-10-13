# HydraShield Robotics Simulation (A* + flood rerouting)

This adds a new "Robotics" page. Nothing that already exists on the site changes, apart from one new link in the menu. Everything runs in the browser and needs no hardware.

## 1. 2D robot simulation (`/robotics`)
- A 20x14 grid. Each type of square has its own colour: safe cells, obstacles (walls or buildings), flooded or hazardous squares, the planned route, the start, the destination and the robot.
- Buttons: **Start Navigation**, **Simulate Flood**, **Reset Simulation**.
- The robot moves one square every 300 ms along its calculated route.
- A status panel shows the robot's position (row, col), its status (Idle / Navigating / Rerouting / Arrived / Blocked, no safe route), the route length, and how many times it has rerouted.

## 2. A* path planning + rerouting
- A real A* search: 4-direction moves, Manhattan heuristic, and an open set with g/f scores. Obstacle and flooded squares cannot be crossed.
- **Simulate Flood** floods a preset river band of squares, picked from a few preset zones in rotation. If any flooded square lies on the rest of the route, A* runs again from the robot's current square.
- If a new route exists, the robot follows it. If not, the robot stops and a red warning appears.

## 3. Rule-based flood-risk classifier (simulated)
- Three sliders, all labelled "Simulated": Rainfall (0–100 mm/h), Water level (0–5 m) and Soil moisture (0–100 %).
- Documented rules give a score from 0 to 6:
  - Rainfall scores 0 below 20, 1 from 20 to 50, and 2 at 50 or more.
  - Water level scores 0 below 1.5 m, 1 from 1.5 to 3 m, and 2 at 3 m or more.
  - Soil moisture scores 0 below 40 %, 1 from 40 to 75 %, and 2 at 75 % or more.
  - A total of 0–1 is LOW, 2–3 is MODERATE, and 4 or more is HIGH. The rules are shown on the page.
- When the risk turns HIGH, the flood is applied automatically, which reroutes the robot or stops it.
- A note on the page says this is a simple rule system, not a trained AI model or a validated real-world flood prediction system.

## 4. Testing
- Unit tests (vitest) for A*: it finds a path, avoids obstacles, returns null when the destination is walled off, and finds a route around a flood. Separate tests cover the classifier thresholds.
- A browser check that runs Start, then Flood, then Reset, and confirms the home, map and weather pages still load.

## Technical details
- New `src/lib/astar.ts` (pure A*), `src/lib/floodRisk.ts` (classifier, kept separate from A*), `src/components/robotics/RobotGrid.tsx`, `src/pages/RoboticsPage.tsx`, and tests in `src/test/`.
- Edited: `src/App.tsx` (route) and `src/components/Header.tsx` (nav link "Robotics").
- No new dependencies and no backend changes.
