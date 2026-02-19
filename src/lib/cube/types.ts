export type Face = "U" | "R" | "F" | "D" | "L" | "B";
export type Color = "W" | "Y" | "R" | "O" | "B" | "G";

export type FaceGrid = Color[]; // length 9
export type CubeNet = Record<Face, FaceGrid>;

export type MoveFace = Face;
export type MoveAmount = 1 | 2 | 3; // 3 == prime (e.g., R')
export type Move = { face: MoveFace; amount: MoveAmount };
