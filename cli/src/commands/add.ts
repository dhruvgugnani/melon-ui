import fs from "fs-extra";
import path from "path";
import ora from "ora";
import axios from "axios";
import { execa } from "execa";
import prompts from "prompts";
import { getProjectInfo, getComponentsDir } from "../utils/project-info";
import { detectPackageManager, getInstallCommand } from "../utils/package-manager";
import { logger } from "../utils/logger";

const REGISTRY_URL = process.env.REGISTRY_URL || "https://melonui.dev/api/registry";

export async function addCommand(component?: string) {
  const cwd = process.cwd();
  const projectInfo = await getProjectInfo(cwd);

  if (!projectInfo.isReact) {
    logger.error("MelonUI requires a React project. Run init first.");
    return;
  }

  const componentsDir = await getComponentsDir(cwd, projectInfo);
  let selectedComponents: string[] = [];

  if (component) {
    selectedComponents = [component];
  } else {
    const spinner = ora("Fetching components from MelonUI registry...").start();
    try {
      const response = await axios.get(REGISTRY_URL).catch(err => {
        throw new Error(err.response?.data?.error || "Failed to fetch component list.");
      });
      spinner.stop();

      const registry = response.data;
      const choices = Object.entries(registry).map(([slug, data]: [string, any]) => ({
        title: `${data.name} [${data.category}]`,
        value: slug,
        description: data.description,
      }));

      const promptRes = await prompts({
        type: "autocompleteMultiselect",
        name: "components",
        message: "Select components to install (Space to select, Enter to confirm, type to search)",
        choices,
        min: 1,
      });

      if (!promptRes.components || promptRes.components.length === 0) {
        logger.warn("No components selected. Exiting.");
        return;
      }

      selectedComponents = promptRes.components;
    } catch (error: any) {
      spinner.fail(`Failed to fetch component list: ${error.message}`);
      return;
    }
  }

  // Install all selected components sequentially
  let hasError = false;
  for (const comp of selectedComponents) {
    const spinner = ora(`Installing ${comp}...`).start();
    try {
      spinner.text = `Fetching metadata for ${comp}...`;
      const response = await axios.get(`${REGISTRY_URL}?component=${comp}`).catch(err => {
        throw new Error(err.response?.data?.error || `Failed to fetch registry data for ${comp}.`);
      });
      const componentData = response.data;

      // Install dependencies
      if (componentData.dependencies && componentData.dependencies.length > 0) {
        spinner.text = `Installing dependencies for ${comp} (${componentData.dependencies.join(", ")})...`;
        const packageManager = await detectPackageManager(cwd);
        const installCmd = getInstallCommand(packageManager, componentData.dependencies);
        await execa(installCmd.cmd, installCmd.args, { cwd });
      }

      // Download files
      spinner.text = `Downloading files for ${comp}...`;
      for (const file of componentData.files) {
        const fileRes = await axios.get(`${REGISTRY_URL}/files?path=${file.path}`);
        const fileContent = fileRes.data;

        const targetPath = path.join(componentsDir, file.name);
        await fs.ensureDir(path.dirname(targetPath));
        await fs.writeFile(targetPath, fileContent, "utf-8");
      }

      spinner.succeed(`Successfully added ${comp}!`);
      logger.green(`Added ${componentData.name} files to ${componentsDir}`);
    } catch (error: any) {
      spinner.fail(`Failed to add component ${comp}: ${error.message}`);
      hasError = true;
    }
  }

  if (hasError) {
    logger.error("\n❌ Component installation failed with errors.");
    process.exit(1);
  } else {
    logger.melon("\n✨ Component installation complete!");
  }
}

