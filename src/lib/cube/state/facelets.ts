import type { Face } from "../types";
import { FACE_ORDER } from "../constants";

export type Facelets = Face[]; // length 54

export function faceletsFromString(s: string): Facelets {
  if (s.length !== 54) throw new Error(`Expected 54 chars, got ${s.length}`);
  return s.split("") as Face[];
}

export function faceletsToString(f: Facelets): string {
  if (f.length !== 54) throw new Error(`Expected 54 entries, got ${f.length}`);
  return f.join("");
}

export function solvedFacelets(): Facelets {
  const out: Face[] = [];
  for (const face of FACE_ORDER) {
    for (let i = 0; i < 9; i++) out.push(face);
  }
  return out;
}

export function cloneFacelets(f: Facelets): Facelets {
  return f.slice() as Facelets;
}
