import type { Face, Move } from "../types";
import type { Facelets } from "../state/facelets";

/**
 * Facelets layout indices (URFDLB), each face is 9 stickers row-major:
 * 0 1 2
 * 3 4 5
 * 6 7 8
 *
 * Full array is:
 * U: 0..8, R: 9..17, F: 18..26, D: 27..35, L: 36..44, B: 45..53
 */
const BASE: Record<Face, number> = { U: 0, R: 9, F: 18, D: 27, L: 36, B: 45 };

function idx(face: Face, pos: number) {
  return BASE[face] + pos;
}

const FACE_CW_MAP = [6, 3, 0, 7, 4, 1, 8, 5, 2]; // new[pos] = old[map[pos]]

function rotateFaceCW(f: Facelets, face: Face) {
  const b = BASE[face];
  const old = f.slice(b, b + 9);
  for (let p = 0; p < 9; p++) {
    f[b + p] = old[FACE_CW_MAP[p]];
  }
}

const RINGS: Record<Face, number[][]> = {
  U: [
    [idx("F", 0), idx("F", 1), idx("F", 2)],
    [idx("R", 0), idx("R", 1), idx("R", 2)],
    [idx("B", 0), idx("B", 1), idx("B", 2)],
    [idx("L", 0), idx("L", 1), idx("L", 2)]
  ],
  D: [
    [idx("F", 6), idx("F", 7), idx("F", 8)],
    [idx("L", 6), idx("L", 7), idx("L", 8)],
    [idx("B", 6), idx("B", 7), idx("B", 8)],
    [idx("R", 6), idx("R", 7), idx("R", 8)]
  ],
  F: [
    [idx("U", 6), idx("U", 7), idx("U", 8)],
    [idx("R", 0), idx("R", 3), idx("R", 6)],
    [idx("D", 2), idx("D", 1), idx("D", 0)],
    [idx("L", 8), idx("L", 5), idx("L", 2)]
  ],
  B: [
    [idx("U", 2), idx("U", 1), idx("U", 0)],
    [idx("L", 0), idx("L", 3), idx("L", 6)],
    [idx("D", 6), idx("D", 7), idx("D", 8)],
    [idx("R", 8), idx("R", 5), idx("R", 2)]
  ],
  R: [
    [idx("U", 2), idx("U", 5), idx("U", 8)],
    [idx("B", 6), idx("B", 3), idx("B", 0)],
    [idx("D", 2), idx("D", 5), idx("D", 8)],
    [idx("F", 2), idx("F", 5), idx("F", 8)]
  ],
  L: [
    [idx("U", 0), idx("U", 3), idx("U", 6)],
    [idx("F", 0), idx("F", 3), idx("F", 6)],
    [idx("D", 0), idx("D", 3), idx("D", 6)],
    [idx("B", 8), idx("B", 5), idx("B", 2)]
  ]
};

function rotateRingCW(f: Facelets, face: Face) {
  const groups = RINGS[face];
  const gvals = groups.map((g) => g.map((i) => f[i]));
  for (let gi = 0; gi < 4; gi++) {
    const src = (gi + 3) % 4;
    for (let k = 0; k < 3; k++) {
      f[groups[gi][k]] = gvals[src][k];
    }
  }
}

function applyQuarterTurnCW(f: Facelets, face: Face) {
  rotateFaceCW(f, face);
  rotateRingCW(f, face);
}

export function applyMove(facelets: Facelets, move: Move): Facelets {
  const times = move.amount; // 1=clockwise, 2=180, 3=counterclockwise as 3 cw turns
  for (let t = 0; t < times; t++) applyQuarterTurnCW(facelets, move.face);
  return facelets;
}
