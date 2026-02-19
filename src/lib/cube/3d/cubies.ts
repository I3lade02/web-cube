import type { Color, Face, Move } from "@/lib/cube/types";
import { DEFAULT_FACE_COLORS } from "@/lib/cube/constants";

/**
 * Coordinate system:
 * x: left(-1) -> right(+1)
 * y: down(-1) -> up(+1)
 * z: back(-1) -> front(+1)
 */
export type Axis = "x" | "y" | "z";
export type Vec3i = { x: -1 | 0 | 1; y: -1 | 0 | 1; z: -1 | 0 | 1 };

export type Cubie = {
  id: string;
  pos: Vec3i;
  stickers: Record<Face, Color | null>;
};

const FACES: Face[] = ["U", "R", "F", "D", "L", "B"];

function key(pos: Vec3i) {
  return `${pos.x},${pos.y},${pos.z}`;
}

function clampPos(n: number): -1 | 0 | 1 {
  if (n > 0.5) return 1;
  if (n < -0.5) return -1;
  return 0;
}

function faceToNormal(face: Face): { x: number; y: number; z: number } {
  switch (face) {
    case "U":
      return { x: 0, y: 1, z: 0 };
    case "D":
      return { x: 0, y: -1, z: 0 };
    case "R":
      return { x: 1, y: 0, z: 0 };
    case "L":
      return { x: -1, y: 0, z: 0 };
    case "F":
      return { x: 0, y: 0, z: 1 };
    case "B":
      return { x: 0, y: 0, z: -1 };
  }
}

function normalToFace(n: { x: number; y: number; z: number }): Face {
  const { x, y, z } = n;
  if (y === 1) return "U";
  if (y === -1) return "D";
  if (x === 1) return "R";
  if (x === -1) return "L";
  if (z === 1) return "F";
  return "B";
}

function rotateVec(v: Vec3i, axis: Axis, q: 1 | -1 | 2 | -2): Vec3i {
  let { x, y, z } = v;
  const times = Math.abs(q) as 1 | 2;
  const dir: 1 | -1 = q > 0 ? 1 : -1;

  for (let t = 0; t < times; t++) {
    if (axis === "x") {
      const ny = (dir === 1 ? -z : z) as -1 | 0 | 1;
      const nz = (dir === 1 ? y : -y) as -1 | 0 | 1;
      y = ny;
      z = nz;
    } else if (axis === "y") {
      const nx = (dir === 1 ? z : -z) as -1 | 0 | 1;
      const nz = (dir === 1 ? -x : x) as -1 | 0 | 1;
      x = nx;
      z = nz;
    } else {
      const nx = (dir === 1 ? -y : y) as -1 | 0 | 1;
      const ny = (dir === 1 ? x : -x) as -1 | 0 | 1;
      x = nx;
      y = ny;
    }
  }

  return { x: clampPos(x), y: clampPos(y), z: clampPos(z) };
}

function rotateNormal(n: { x: number; y: number; z: number }, axis: Axis, q: 1 | -1 | 2 | -2) {
  const v = rotateVec({ x: clampPos(n.x), y: clampPos(n.y), z: clampPos(n.z) }, axis, q);
  return { x: v.x, y: v.y, z: v.z };
}

function faceletsLettersToColors(facelets: string): Color[] {
  if (facelets.length !== 54) throw new Error(`Expected 54 facelets, got ${facelets.length}`);
  return facelets.split("").map((ch) => {
    const f = ch as Face;
    const c = DEFAULT_FACE_COLORS[f];
    if (!c) throw new Error(`Invalid facelet char: ${ch}`);
    return c;
  });
}

/**
 * Map face+pos(0..8) to cubie coordinate (x,y,z).
 * Must align with the same orientation as your facelets/moves.
 */
function facePosToCoord(face: Face, pos: number): Vec3i {
  const row = Math.floor(pos / 3);
  const col = pos % 3;
  const x = clampPos(-1 + col);
  const yTopToBottom = clampPos(1 - row);

  switch (face) {
    case "F":
      return { x, y: yTopToBottom, z: 1 };
    case "B": {
      const xb = clampPos(1 - col);
      return { x: xb, y: yTopToBottom, z: -1 };
    }
    case "R": {
      const z = clampPos(1 - col);
      return { x: 1, y: yTopToBottom, z };
    }
    case "L": {
      const z = clampPos(-1 + col);
      return { x: -1, y: yTopToBottom, z };
    }
    case "U": {
      const z = clampPos(-1 + row);
      return { x, y: 1, z };
    }
    case "D": {
      const z = clampPos(1 - row);
      return { x, y: -1, z };
    }
  }
}

export function buildCubiesFromFacelets(faceletsLetters: string): Cubie[] {
  const colors = faceletsLettersToColors(faceletsLetters);

  const map = new Map<string, Cubie>();
  for (const x of [-1, 0, 1] as const) {
    for (const y of [-1, 0, 1] as const) {
      for (const z of [-1, 0, 1] as const) {
        const pos: Vec3i = { x, y, z };
        map.set(key(pos), {
          id: key(pos),
          pos,
          stickers: { U: null, R: null, F: null, D: null, L: null, B: null }
        });
      }
    }
  }

  const faceOffsets: Record<Face, number> = { U: 0, R: 9, F: 18, D: 27, L: 36, B: 45 };

  for (const face of FACES) {
    const off = faceOffsets[face];
    for (let p = 0; p < 9; p++) {
      const color = colors[off + p];
      const pos = facePosToCoord(face, p);
      const c = map.get(key(pos));
      if (!c) continue;
      c.stickers[face] = color;
    }
  }

  return Array.from(map.values());
}

export function moveAxisLayer(face: Face): { axis: Axis; layer: -1 | 1 } {
  switch (face) {
    case "R":
      return { axis: "x", layer: 1 };
    case "L":
      return { axis: "x", layer: -1 };
    case "U":
      return { axis: "y", layer: 1 };
    case "D":
      return { axis: "y", layer: -1 };
    case "F":
      return { axis: "z", layer: 1 };
    case "B":
      return { axis: "z", layer: -1 };
  }
}

/**
 * Clockwise as seen from outside the turned face.
 * Maps to RH rotation direction.
 */
export function moveToQuarter(face: Face, amount: 1 | 2 | 3): 1 | -1 | 2 | -2 {
  const q = amount === 1 ? 1 : amount === 2 ? 2 : -1;
  const sign = face === "F" || face === "R" || face === "U" ? -1 : 1;
  return (sign * q) as 1 | -1 | 2 | -2;
}

export function cubieInLayer(c: Cubie, axis: Axis, layer: -1 | 1): boolean {
  return c.pos[axis] === layer;
}

export function applyMoveToCubies(cubies: Cubie[], move: Move): Cubie[] {
  const { axis, layer } = moveAxisLayer(move.face);
  const q = moveToQuarter(move.face, move.amount);

  return cubies.map((c) => {
    if (!cubieInLayer(c, axis, layer)) return c;

    const newPos = rotateVec(c.pos, axis, q);

    const newStickers: Cubie["stickers"] = { U: null, R: null, F: null, D: null, L: null, B: null };

    for (const sf of FACES) {
      const col = c.stickers[sf];
      if (!col) continue;
      const n = faceToNormal(sf);
      const rn = rotateNormal(n, axis, q);
      const newFace = normalToFace(rn);
      newStickers[newFace] = col;
    }

    return { ...c, pos: newPos, stickers: newStickers };
  });
}

export function applyMovesToCubies(cubies: Cubie[], moves: Move[]): Cubie[] {
  let cur = cubies;
  for (const m of moves) cur = applyMoveToCubies(cur, m);
  return cur;
}
