import fs from "fs-extra";
import path from "path";
import ora from "ora";
import { execa } from "execa";
import { getProjectInfo, getUtilsDir } from "../utils/project-info";
import { detectPackageManager, getInstallCommand } from "../utils/package-manager";
import { logger } from "../utils/logger";

const UTILS_TEMPLATE = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

export async function initCommand() {
  const spinner = ora("Initializing MelonUI ecosystem...").start();

  try {
    const cwd = process.cwd();
    const projectInfo = await getProjectInfo(cwd);

    if (!projectInfo.isReact) {
      spinner.fail("MelonUI requires a React project.");
      return;
    }

    spinner.text = "Checking dependencies...";
    const packageManager = await detectPackageManager(cwd);

    // Ensure core dependencies are installed
    const depsToInstall = ["clsx", "tailwind-merge"];

    spinner.text = `Installing core utilities using ${packageManager}...`;
    const installCmd = getInstallCommand(packageManager, depsToInstall);

    // We run this in the actual project cwd
    await execa(installCmd.command, installCmd.args, { cwd });

    // Setup utils file
    const utilsDir = await getUtilsDir(cwd, projectInfo);
    await fs.ensureDir(utilsDir);

    const utilsExt = projectInfo.isTypeScript ? "ts" : "js";
    const utilsPath = path.join(utilsDir, `utils.${utilsExt}`);

    if (!(await fs.pathExists(utilsPath))) {
      await fs.writeFile(utilsPath, UTILS_TEMPLATE, "utf-8");
    }

    spinner.succeed("MelonUI initialized successfully!");
    logger.melon("\\n✨ Ready to add premium components! Run:");
    logger.green("npx @melonui-dev/cli add <component>");

  } catch (error: any) {
    spinner.fail(`Initialization failed: ${error.message}`);
  }
}
