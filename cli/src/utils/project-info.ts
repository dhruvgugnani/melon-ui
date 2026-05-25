import fs from "fs-extra";
import path from "path";

export interface ProjectInfo {
  isNextJs: boolean;
  isVite: boolean;
  isReact: boolean;
  hasTailwind: boolean;
  isTypeScript: boolean;
  srcDir: boolean;
}

export async function getProjectInfo(cwd: string = process.cwd()): Promise<ProjectInfo> {
  const packageJsonPath = path.resolve(cwd, "package.json");
  const hasPackageJson = await fs.pathExists(packageJsonPath);

  let isNextJs = false;
  let isVite = false;
  let isReact = false;
  let hasTailwind = false;

  if (hasPackageJson) {
    const pkg = await fs.readJson(packageJsonPath);
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    isNextJs = !!deps["next"];
    isVite = !!deps["vite"];
    isReact = !!deps["react"];
    hasTailwind = !!deps["tailwindcss"];
  }

  const isTypeScript = await fs.pathExists(path.resolve(cwd, "tsconfig.json"));
  const srcDir = await fs.pathExists(path.resolve(cwd, "src"));

  return {
    isNextJs,
    isVite,
    isReact,
    hasTailwind,
    isTypeScript,
    srcDir,
  };
}

export async function getComponentsDir(cwd: string = process.cwd(), projectInfo: ProjectInfo) {
  if (projectInfo.srcDir) {
    return path.resolve(cwd, "src/components");
  }
  return path.resolve(cwd, "components");
}

export async function getUtilsDir(cwd: string = process.cwd(), projectInfo: ProjectInfo) {
  if (projectInfo.srcDir) {
    return path.resolve(cwd, "src/lib");
  }
  return path.resolve(cwd, "lib");
}
