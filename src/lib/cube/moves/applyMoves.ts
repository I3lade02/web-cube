import type { Move } from "../types";
import type { Facelets } from "../state/facelets";
import { applyMove } from "./applyMove";

export function applyMoves(facelets: Facelets, moves: Move[]): Facelets {
  for (const m of moves) applyMove(facelets, m);
  return facelets;
}
