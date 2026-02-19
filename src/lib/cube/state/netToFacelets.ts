import type { CubeNet } from "../types";
import { FACE_ORDER } from "../constants";

/**
 * Returns a 54-character facelets string in URFDLB order.
 * Each character is a face letter (U/R/F/D/L/B), not a color.
 *
 * Solvers typically expect face letters, where colors are mapped by centers.
 */
export function netToFacelets(net: CubeNet): string {
  // Map color -> face letter using centers
  const colorToFace = new Map<string, string>();
  for (const face of FACE_ORDER) {
    const centerColor = net[face][4];
    colorToFace.set(centerColor, face);
  }

  const out: string[] = [];
  for (const face of FACE_ORDER) {
    const grid = net[face];
    for (let i = 0; i < 9; i++) {
      const c = grid[i];
      const mapped = colorToFace.get(c);
      out.push(mapped ?? "?");
    }
  }
  return out.join("");
}
