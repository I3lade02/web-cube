"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import type { Move, Face, Color } from "@/lib/cube/types";
import type { Cubie } from "@/lib/cube/3d/cubies";
import {
  applyMoveToCubies,
  applyMovesToCubies,
  buildCubiesFromFacelets,
  cubieInLayer,
  moveAxisLayer,
  moveToQuarter
} from "@/lib/cube/3d/cubies";

const COLOR_TO_HEX: Record<Color, number> = {
  W: 0xffffff,
  Y: 0xffeb3b,
  R: 0xf44336,
  O: 0xff9800,
  B: 0x1e40af,
  G: 0x22c55e
};

// BoxGeometry material order: +x, -x, +y, -y, +z, -z => R, L, U, D, F, B
const BOX_FACE_TO_STICKER_FACE: Record<number, Face> = {
  0: "R",
  1: "L",
  2: "U",
  3: "D",
  4: "F",
  5: "B"
};

function CubieMesh({ cubie, spacing = 1.06 }: { cubie: Cubie; spacing?: number }) {
  const mats = useMemo(() => {
    const materials: THREE.MeshStandardMaterial[] = [];
    for (let i = 0; i < 6; i++) {
      const f = BOX_FACE_TO_STICKER_FACE[i];
      const c = cubie.stickers[f];
      const hex = c ? COLOR_TO_HEX[c] : 0x111111; // internal face
      materials.push(new THREE.MeshStandardMaterial({ color: hex }));
    }
    return materials;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cubie.stickers.U,
    cubie.stickers.D,
    cubie.stickers.L,
    cubie.stickers.R,
    cubie.stickers.F,
    cubie.stickers.B
  ]);

  return (
    <mesh
      position={[cubie.pos.x * spacing, cubie.pos.y * spacing, cubie.pos.z * spacing]}
      material={mats}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
}

function Scene({
  initialFacelets,
  moves,
  step,
  msPerMove = 450
}: {
  initialFacelets: string;
  moves: Move[];
  step: number;
  msPerMove?: number;
}) {
  const [cubies, setCubies] = useState<Cubie[]>(() => buildCubiesFromFacelets(initialFacelets));

  const [activeMove, setActiveMove] = useState<{ move: Move; fromStep: number } | null>(null);
  const [progress, setProgress] = useState(0); // 0..1
  const pivotRef = useRef<THREE.Group>(null);

  const currentStepRef = useRef(0);

  // Rebuild if user repaints
  useEffect(() => {
    setCubies(buildCubiesFromFacelets(initialFacelets));
    currentStepRef.current = 0;
    setActiveMove(null);
    setProgress(0);
    pivotRef.current?.rotation.set(0, 0, 0);
  }, [initialFacelets]);

  // Step changes drive animation or snapping
  useEffect(() => {
    const desired = step;
    const current = currentStepRef.current;

    if (activeMove) return;
    if (desired === current) return;

    // snap if jumping far or backwards
    if (desired < current || desired > current + 1) {
      const base = buildCubiesFromFacelets(initialFacelets);
      const next = applyMovesToCubies(base, moves.slice(0, desired));
      setCubies(next);
      currentStepRef.current = desired;
      return;
    }

    // animate next move
    const move = moves[current];
    if (move) {
      setActiveMove({ move, fromStep: current });
      setProgress(0);
      pivotRef.current?.rotation.set(0, 0, 0);
    }
  }, [step, moves, initialFacelets, activeMove]);

  useFrame((_, delta) => {
    if (!activeMove) return;

    const pNext = Math.min(1, progress + (delta * 1000) / msPerMove);
    setProgress(pNext);

    const { axis } = moveAxisLayer(activeMove.move.face);
    const q = moveToQuarter(activeMove.move.face, activeMove.move.amount);
    const angle = (q * Math.PI) / 2;
    const currentAngle = angle * pNext;

    if (pivotRef.current) {
      if (axis === "x") pivotRef.current.rotation.x = currentAngle;
      if (axis === "y") pivotRef.current.rotation.y = currentAngle;
      if (axis === "z") pivotRef.current.rotation.z = currentAngle;
    }

    if (pNext >= 1) {
      setCubies((prev) => applyMoveToCubies(prev, activeMove.move));
      currentStepRef.current = activeMove.fromStep + 1;

      setActiveMove(null);
      setProgress(0);
      pivotRef.current?.rotation.set(0, 0, 0);
    }
  });

  const { axis, layer } = activeMove ? moveAxisLayer(activeMove.move.face) : ({ axis: "x" as const, layer: 0 } as any);

  const layerCubies = activeMove ? cubies.filter((c) => cubieInLayer(c, axis, layer)) : [];
  const restCubies = activeMove ? cubies.filter((c) => !cubieInLayer(c, axis, layer)) : cubies;

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 6]} intensity={1.2} castShadow />
      <pointLight position={[-6, -4, -6]} intensity={0.35} />

      <group>
        {restCubies.map((c) => (
          <CubieMesh key={c.id} cubie={c} />
        ))}
      </group>

      <group ref={pivotRef}>
        {layerCubies.map((c) => (
          <CubieMesh key={c.id} cubie={c} />
        ))}
      </group>

      <OrbitControls enablePan={false} />
    </>
  );
}

export function CubeViewer3D({
  initialFacelets,
  moves,
  step,
  msPerMove
}: {
  initialFacelets: string;
  moves: Move[];
  step: number;
  msPerMove?: number;
}) {
  return (
    <div className="rounded-2xl border border-black/10 shadow-sm overflow-hidden">
      <div className="h-105 w-full">
        <Canvas camera={{ position: [4, 4, 6], fov: 45 }} shadows>
          <Scene initialFacelets={initialFacelets} moves={moves} step={step} msPerMove={msPerMove ?? 450} />
        </Canvas>
      </div>
      <div className="px-4 py-2 text-xs text-black/50">Drag to rotate • Scroll to zoom</div>
    </div>
  );
}
