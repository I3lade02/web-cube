import type { Color, CubeNet, Face } from "./types";

export const FACES: Face[] = ["U", "R", "F", "D", "L", "B"];

// Standard face order most solvers use: URFDLB
export const FACE_ORDER: Face[] = ["U", "R", "F", "D", "L", "B"];

// Default scheme:
// U=White, D=Yellow, F=Green, B=Blue, R=Red, L=Orange
export const DEFAULT_FACE_COLORS: Record<Face, Color> = {
  U: "W",
  D: "Y",
  F: "G",
  B: "B",
  R: "R",
  L: "O"
};

export function createSolvedNet(): CubeNet {
  return {
    U: Array(9).fill(DEFAULT_FACE_COLORS.U),
    R: Array(9).fill(DEFAULT_FACE_COLORS.R),
    F: Array(9).fill(DEFAULT_FACE_COLORS.F),
    D: Array(9).fill(DEFAULT_FACE_COLORS.D),
    L: Array(9).fill(DEFAULT_FACE_COLORS.L),
    B: Array(9).fill(DEFAULT_FACE_COLORS.B)
  };
}
