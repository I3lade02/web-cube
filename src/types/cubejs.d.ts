declare module "cubejs" {
  class Cube {
    constructor(state?: any);
    static fromString(facelets: string): Cube;
    static initSolver(): void;
    solve(maxDepth?: number): string;
  }
  export = Cube;
}
