"use client";

import type { Color, CubeNet, Face } from "@/lib/cube/types";
import { FACE_ORDER } from "@/lib/cube/constants";

const FACE_LABEL: Record<Face, string> = {
  U: "Up",
  R: "Right",
  F: "Front",
  D: "Down",
  L: "Left",
  B: "Back"
};

const COLOR_CLASS: Record<Color, string> = {
  W: "bg-white",
  Y: "bg-yellow-300",
  R: "bg-red-500",
  O: "bg-orange-500",
  B: "bg-blue-600",
  G: "bg-green-500"
};

function FaceGrid({
  face,
  grid,
  selectedColor,
  onPaint
}: {
  face: Face;
  grid: Color[];
  selectedColor: Color;
  onPaint: (face: Face, idx: number, color: Color) => void;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-medium">
          {FACE_LABEL[face]} ({face})
        </div>
        <div className="text-xs text-black/50">center drives mapping</div>
      </div>

      <div className="grid grid-cols-3 gap-1">
        {grid.map((c, idx) => {
          const isCenter = idx === 4;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onPaint(face, idx, selectedColor)}
              className={[
                "h-10 w-10 rounded-md border border-black/20",
                COLOR_CLASS[c],
                isCenter ? "outline-2 outline-black/30" : "",
                "hover:opacity-90"
              ].join(" ")}
              title={`${face}[${idx}]`}
            />
          );
        })}
      </div>

      <div className="mt-2 text-xs text-black/50">Tip: set centers first (index 4).</div>
    </div>
  );
}

export function CubeNetInput({
  net,
  selectedColor,
  onChange
}: {
  net: CubeNet;
  selectedColor: Color;
  onChange: (next: CubeNet) => void;
}) {
  const onPaint = (face: Face, idx: number, color: Color) => {
    const next: CubeNet = {
      ...net,
      [face]: net[face].map((v, i) => (i === idx ? color : v))
    };
    onChange(next);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {FACE_ORDER.map((face) => (
        <FaceGrid
          key={face}
          face={face}
          grid={net[face]}
          selectedColor={selectedColor}
          onPaint={onPaint}
        />
      ))}
    </div>
  );
}
