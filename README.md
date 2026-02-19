# Rubik's Cube Solver (Offline, 3D)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## What’s included
- Color-net cube input
- Basic validation (color counts + unique centers)
- Offline solver using `cubejs` (Kociemba two-phase)
- Move list + step controls + playback (speed slider)
- 3D animated cube playback (React Three Fiber / Three.js)

## Notes
- The first solve is slower because `cubejs` precomputes its solver tables in-browser.
- The 3D viewer animates normal step-by-step and snaps if you jump far or go backwards.
