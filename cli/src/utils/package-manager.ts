import fs from "fs-extra";
import path from "path";
import { execa } from "execa";

export interface InstallCommand {
  command: string;
  args: string[];
}

export type PackageCommandRunner = (
  command: string,
  args: string[],
  options: { cwd: string },
) => Promise<unknown>;

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

export function getInstallCommand(packageManager: string, dependencies: string[]): InstallCommand {
  for (const dependency of dependencies) {
    if (
      typeof dependency !== "string" ||
      dependency.length === 0 ||
      /\s|\0/.test(dependency) ||
      dependency.startsWith("-")
    ) {
      throw new Error(`Invalid dependency specifier: ${JSON.stringify(dependency)}`);
    }
  }

  switch (packageManager) {
    case "pnpm":
      return { command: "pnpm", args: ["add", "--", ...dependencies] };
    case "yarn":
      return { command: "yarn", args: ["add", "--", ...dependencies] };
    case "bun":
      return { command: "bun", args: ["add", "--", ...dependencies] };
    default:
      return { command: "npm", args: ["install", "--legacy-peer-deps", "--", ...dependencies] };
  }
}

export async function installDependencies(
  packageManager: string,
  dependencies: string[],
  cwd: string,
  runner: PackageCommandRunner = (command, args, options) => execa(command, args, options),
) {
  const installCommand = getInstallCommand(packageManager, dependencies);
  return runner(installCommand.command, installCommand.args, { cwd });
}
