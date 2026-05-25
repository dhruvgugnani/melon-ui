import fs from "fs-extra";
import path from "path";

export async function detectPackageManager(cwd: string = process.cwd()) {
  const pnpmLock = path.resolve(cwd, "pnpm-lock.yaml");
  const yarnLock = path.resolve(cwd, "yarn.lock");
  const bunLock = path.resolve(cwd, "bun.lockb");
  const npmLock = path.resolve(cwd, "package-lock.json");

  if (await fs.pathExists(pnpmLock)) return "pnpm";
  if (await fs.pathExists(yarnLock)) return "yarn";
  if (await fs.pathExists(bunLock)) return "bun";
  if (await fs.pathExists(npmLock)) return "npm";

  return "npm"; // fallback
}

export function getInstallCommand(packageManager: string, dependencies: string[]) {
  const deps = dependencies.join(" ");
  switch (packageManager) {
    case "pnpm":
      return `pnpm add ${deps}`;
    case "yarn":
      return `yarn add ${deps}`;
    case "bun":
      return `bun add ${deps}`;
    default:
      return `npm install ${deps}`;
  }
}
