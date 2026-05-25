import fs from "fs-extra";
import path from "path";
import ora from "ora";
import axios from "axios";
import { execa } from "execa";
import { getProjectInfo, getComponentsDir } from "../utils/project-info";
import { detectPackageManager, getInstallCommand } from "../utils/package-manager";
import { logger } from "../utils/logger";

const REGISTRY_URL = process.env.REGISTRY_URL || "http://localhost:3000/api/registry";

export async function addCommand(component: string) {
  const spinner = ora(`Fetching ${component} from MelonUI registry...`).start();

  try {
    const response = await axios.get(`${REGISTRY_URL}?component=${component}`).catch(err => {
        throw new Error(err.response?.data?.error || "Failed to fetch component registry.");
    });
    const componentData = response.data;

    const cwd = process.cwd();
    const projectInfo = await getProjectInfo(cwd);
    const componentsDir = await getComponentsDir(cwd, projectInfo);

    spinner.text = `Installing dependencies for ${component}...`;

    if (componentData.dependencies && componentData.dependencies.length > 0) {
        const packageManager = await detectPackageManager(cwd);
        const installCmd = getInstallCommand(packageManager, componentData.dependencies);
        await execa(installCmd.split(" ")[0], installCmd.split(" ").slice(1), { cwd, shell: true });
    }

    spinner.text = `Downloading files for ${component}...`;

    for (const file of componentData.files) {
        const fileRes = await axios.get(`${REGISTRY_URL}/files?path=${file.path}`);
        const fileContent = fileRes.data;

        const targetPath = path.join(componentsDir, file.name);
        await fs.ensureDir(path.dirname(targetPath));
        await fs.writeFile(targetPath, fileContent, "utf-8");
    }

    spinner.succeed(`Successfully added ${component}!`);

    logger.melon(`\\n✨ Component ${componentData.name} installed successfully.`);
    logger.green(`Check ${componentsDir} for the newly added files.`);

  } catch (error: any) {
    spinner.fail(`Failed to add component: ${error.message}`);
  }
}
