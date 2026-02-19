"use client";

import { useMemo, useState } from "react";

import type { Color, Move } from "@/lib/cube/types";
import { createSolvedNet } from "@/lib/cube/constants";

import { netToFacelets } from "@/lib/cube/state/netToFacelets";
import { validateNetBasic } from "@/lib/cube/state/validateState";
import { parseMoves } from "@/lib/cube/moves/parseMoves";
import { solveFacelets } from "@/lib/solver/solve";

import { ColorPicker } from "@/components/input/ColorPicker";
import { CubeNetInput } from "@/components/input/CubeNetInput";
import { MoveList } from "@/components/cube/MoveList";
import { CubeViewer3D } from "@/components/cube/CubeViewer3D";
import { usePlayback } from "@/hooks/usePlayback";

export default function Page() {
  const [net, setNet] = useState(() => createSolvedNet());
  const [selectedColor, setSelectedColor] = useState<Color>("W");

  const validation = useMemo(() => validateNetBasic(net), [net]);
  const facelets = useMemo(() => netToFacelets(net), [net]);

  const [solving, setSolving] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  const [solutionMoves, setSolutionMoves] = useState<Move[]>([]);
  const [solveError, setSolveError] = useState<string | null>(null);

  const [step, setStep] = useState(0);

  const { playing, setPlaying, msPerMove, setMsPerMove } = usePlayback({
    maxStep: solutionMoves.length,
    step,
    setStep
  });

  const currentMoveLabel = useMemo(() => {
    if (!solutionMoves.length) return "(no moves)";
    if (step === 0) return "(start)";
    if (step > solutionMoves.length) return "(end)";
    const m = solutionMoves[step - 1];
    const suffix = m.amount === 1 ? "" : m.amount === 2 ? "2" : "'";
    return `${m.face}${suffix}`;
  }, [solutionMoves, step]);

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-semibold">Rubik’s Cube Solver (Offline, 3D)</h1>
      <p className="mt-1 text-sm text-black/60">
        Paint the cube, solve offline, then animate the solution in 3D.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_460px]">
        <section className="space-y-4">
          <div className="rounded-2xl border border-black/10 p-4">
            <div className="mb-3 text-sm font-medium">Pick a color</div>
            <ColorPicker value={selectedColor} onChange={setSelectedColor} />
          </div>

          <CubeNetInput net={net} selectedColor={selectedColor} onChange={(n) => {
            setNet(n);
            // repainting invalidates current solution playback expectations
            setPlaying(false);
            setSolution(null);
            setSolutionMoves([]);
            setStep(0);
            setSolveError(null);
          }} />
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-black/10 p-4 shadow-sm">
            <div className="text-sm font-medium">Validation</div>
            {validation.ok ? (
              <div className="mt-2 rounded-xl bg-green-50 p-3 text-sm text-green-800">
                Looks OK (basic checks).
              </div>
            ) : (
              <div className="mt-2 rounded-xl bg-red-50 p-3 text-sm text-red-800">
                <ul className="list-disc pl-5">
                  {validation.errors.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-black/10 p-4 shadow-sm">
            <div className="text-sm font-medium">Facelets (URFDLB)</div>
            <div className="mt-2 break-all rounded-xl bg-black/5 p-3 font-mono text-xs">{facelets}</div>
            <div className="mt-2 text-xs text-black/50">
              This string is fed into the offline solver (cubejs).
            </div>
          </div>

          <button
            type="button"
            className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white disabled:opacity-40"
            disabled={!validation.ok || facelets.includes("?") || solving}
            onClick={async () => {
              setSolving(true);
              setSolveError(null);
              setSolution(null);
              setSolutionMoves([]);
              setPlaying(false);
              setStep(0);

              try {
                const alg = await solveFacelets(facelets, 22);
                setSolution(alg);
                const moves = parseMoves(alg);
                setSolutionMoves(moves);
              } catch (e: any) {
                setSolveError(e?.message ?? "Failed to solve.");
              } finally {
                setSolving(false);
              }
            }}
          >
            {solving ? "Solving (first run slower)..." : "Solve (offline)"}
          </button>

          {solveError && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{solveError}</div>}

          {solution !== null && (
            <div className="rounded-2xl border border-black/10 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Solution</div>
                <div className="text-xs text-black/50">Moves: {solutionMoves.length}</div>
              </div>
              <div className="mt-2 wrap-break-word rounded-xl bg-black/5 p-3 font-mono text-xs">
                {solution.trim() ? solution : "(already solved)"}
              </div>
            </div>
          )}

          {solutionMoves.length > 0 && (
            <div className="rounded-2xl border border-black/10 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Playback</div>
                <div className="text-xs text-black/50">{playing ? "Playing" : "Paused"}</div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-xl bg-black px-3 py-2 text-sm text-white disabled:opacity-40"
                  disabled={step >= solutionMoves.length}
                  onClick={() => setPlaying((p) => !p)}
                >
                  {playing ? "Pause" : "Play"}
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-black/15 px-3 py-2 text-sm"
                  onClick={() => {
                    setPlaying(false);
                    setStep(0);
                  }}
                >
                  Reset
                </button>

                <button
                  type="button"
                  className="ml-auto rounded-xl border border-black/15 px-3 py-2 text-sm disabled:opacity-40"
                  disabled={step >= solutionMoves.length}
                  onClick={() => setStep((s) => Math.min(solutionMoves.length, s + 1))}
                >
                  Next
                </button>
              </div>

              <label className="block text-xs text-black/60">
                Speed: {msPerMove} ms / move
                <input
                  type="range"
                  min={120}
                  max={1200}
                  step={10}
                  value={msPerMove}
                  onChange={(e) => setMsPerMove(Number(e.target.value))}
                  className="mt-2 w-full"
                />
              </label>

              <div className="text-xs text-black/60">
                Current move: <span className="font-mono">{currentMoveLabel}</span>
              </div>
            </div>
          )}

          <MoveList
            moves={solutionMoves}
            step={step}
            onStepChange={(n) => {
              setPlaying(false);
              setStep(n);
            }}
          />

          <div className="rounded-2xl border border-black/10 p-4 shadow-sm">
            <div className="text-sm font-medium">3D Cube (animated)</div>
            <div className="mt-3">
              <CubeViewer3D initialFacelets={facelets} moves={solutionMoves} step={step} msPerMove={msPerMove} />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
