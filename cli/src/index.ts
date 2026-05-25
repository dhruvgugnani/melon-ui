#!/usr/bin/env node

import { Command } from "commander";
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
  .argument("<component>", "The component to add")
  .action(addCommand);

program.parse(process.argv);
