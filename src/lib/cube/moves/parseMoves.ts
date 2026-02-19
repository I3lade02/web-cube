import type { Move, Face } from "../types";

const FACES = new Set<Face>(["U", "R", "F", "D", "L", "B"]);

export function parseMoves(alg: string): Move[] {
  const tokens = alg.trim().split(/\s+/).filter(Boolean);

  const moves: Move[] = [];
  for (const t of tokens) {
    const face = t[0] as Face;
    if (!FACES.has(face)) continue;

    const suffix = t.slice(1); // "", "2", "'"
    let amount: 1 | 2 | 3 = 1;
    if (suffix === "2") amount = 2;
    else if (suffix === "'") amount = 3;

    moves.push({ face, amount });
  }
  return moves;
}
