let initPromise: Promise<void> | null = null;

async function getCubeModule() {
  if (typeof window === "undefined") {
    throw new Error("Solver can only run in the browser (client-side).");
  }
  const mod = await import("cubejs");
  return (mod as any).default ?? (mod as any);
}

async function ensureInit(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      const Cube = await getCubeModule();
      Cube.initSolver();
    })();
  }
  return initPromise;
}

export async function solveFacelets(facelets: string, maxDepth = 22): Promise<string> {
  await ensureInit();
  const Cube = await getCubeModule();
  const cube = Cube.fromString(facelets);
  return cube.solve(maxDepth);
}
