"use client";

import type { Face } from "@/lib/cube/types";

const FACE_COLOR_CLASS: Record<Face, string> = {
  U: "bg-white",
  D: "bg-yellow-300",
  F: "bg-green-500",
  B: "bg-blue-600",
  R: "bg-red-500",
  L: "bg-orange-500",
};

const FACE_LABEL: Record<Face, string> = {
  U: "U",
  R: "R",
  F: "F",
  D: "D",
  L: "L",
  B: "B",
};

function FaceBlock({ face, cells }: { face: Face; cells: Face[] }) {
  return (
    <div className="rounded-2xl border border-black/10 p-3 shadow-sm">
      <div className="mb-2 text-sm font-medium">Face {FACE_LABEL[face]}</div>
      <div className="grid grid-cols-3 gap-1">
        {cells.map((v, i) => (
          <div
            key={i}
            className={[
              "h-10 w-10 rounded-md border border-black/20",
              FACE_COLOR_CLASS[v],
            ].join(" ")}
            title={`${face}:${i}=${v}`}
          />
        ))}
      </div>
    </div>
  );
}

export function CubePreview2D({ faceletsString }: { faceletsString: string }) {
  if (faceletsString.length !== 54) {
    return <div className="text-sm text-red-700">Invalid facelets length</div>;
  }

  const f = faceletsString.split("") as Face[];

  const U = f.slice(0, 9) as Face[];
  const R = f.slice(9, 18) as Face[];
  const F = f.slice(18, 27) as Face[];
  const D = f.slice(27, 36) as Face[];
  const L = f.slice(36, 45) as Face[];
  const B = f.slice(45, 54) as Face[];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FaceBlock face="U" cells={U} />
      <FaceBlock face="R" cells={R} />
      <FaceBlock face="F" cells={F} />
      <FaceBlock face="D" cells={D} />
      <FaceBlock face="L" cells={L} />
      <FaceBlock face="B" cells={B} />
    </div>
  );
}
