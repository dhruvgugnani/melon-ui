#!/usr/bin/env node

import { Command } from "commander";
import prompts from "prompts";
import { initCommand } from "./commands/init";
import { addCommand } from "./commands/add";
import { MELON_BANNER } from "./utils/logger";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

// Read package.json version
const packageJsonPath = join(__dirname, "../../package.json");
let version = "0.1.0";
try {
  const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  version = pkg.version;
} catch (e) {}

console.log(MELON_BANNER);

const program = new Command();

program
  .name("@melonui-dev/cli")
  .description("Premium UI distribution ecosystem for modern frontend developers")
  .version(version);

program
  .command("init")
  .description("Initialize your project and install required dependencies")
  .action(initCommand);

program
  .command("add")
  .description("Add a component from the remote registry")
  .argument("[component]", "The component to add")
  .action(addCommand);

async function runMainMenu() {
  const choices = [
    { title: "Initialize MelonUI Project", value: "init", description: "Set up utils, paths, and core dependencies" },
    { title: "Add/Install Components", value: "add", description: "Search, select, and install components dynamically" },
    { title: "Exit", value: "exit", description: "Close the interactive CLI" }
  ];

  const response = await prompts({
    type: "select",
    name: "action",
    message: "What would you like to do?",
    choices
  });

  if (response.action === "init") {
    await initCommand();
  } else if (response.action === "add") {
    await addCommand();
  } else {
    console.log("Goodbye!");
  }
}

if (process.argv.length <= 2) {
  runMainMenu();
} else {
  program.parse(process.argv);
}
