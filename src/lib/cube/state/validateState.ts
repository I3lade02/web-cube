import type { Color, CubeNet } from "../types";
import { FACE_ORDER } from "../constants";

export type ValidationResult =
  | { ok: true }
  | { ok: false; errors: string[] };

const COLORS: Color[] = ["W", "Y", "R", "O", "B", "G"];

export function validateNetBasic(net: CubeNet): ValidationResult {
  const errors: string[] = [];

  // Centers must be 6 unique colors
  const centers = FACE_ORDER.map((f) => net[f][4]);
  const uniqueCenters = new Set(centers);
  if (uniqueCenters.size !== 6) {
    errors.push("Centers must be 6 different colors (one per face).");
  }

  // Exactly 9 stickers of each color
  const counts = new Map<Color, number>();
  for (const c of COLORS) counts.set(c, 0);

  for (const face of FACE_ORDER) {
    for (const sticker of net[face]) {
      counts.set(sticker, (counts.get(sticker) ?? 0) + 1);
    }
  }

  for (const c of COLORS) {
    const n = counts.get(c) ?? 0;
    if (n !== 9) errors.push(`Color ${c} must appear exactly 9 times (found ${n}).`);
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true };
}
