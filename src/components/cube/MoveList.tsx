"use client";

import type { Move } from "@/lib/cube/types";

function moveToString(m: Move): string {
  const suffix = m.amount === 1 ? "" : m.amount === 2 ? "2" : "'";
  return `${m.face}${suffix}`;
}

export function MoveList({
  moves,
  step,
  onStepChange
}: {
  moves: Move[];
  step: number; // 0..moves.length
  onStepChange: (nextStep: number) => void;
}) {
  if (!moves.length) return null;

  return (
    <div className="rounded-2xl border border-black/10 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium">Moves</div>
        <div className="text-xs text-black/50">{moves.length} total</div>
      </div>

      <div className="flex flex-wrap gap-2">
        {moves.map((m, i) => {
          const label = moveToString(m);
          const isActive = step === i + 1;

          return (
            <button
              key={i}
              type="button"
              onClick={() => onStepChange(i + 1)}
              className={[
                "rounded-xl border px-2 py-1 font-mono text-xs",
                isActive
                  ? "border-black/50 bg-black text-white"
                  : "border-black/15 bg-white hover:bg-black/5"
              ].join(" ")}
              title={`Jump to step ${i + 1}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="rounded-xl border border-black/15 px-3 py-2 text-sm disabled:opacity-40"
          disabled={step === 0}
          onClick={() => onStepChange(0)}
        >
          Start
        </button>
        <button
          type="button"
          className="rounded-xl border border-black/15 px-3 py-2 text-sm disabled:opacity-40"
          disabled={step === moves.length}
          onClick={() => onStepChange(moves.length)}
        >
          End
        </button>
      </div>
    </div>
  );
}
