import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  getInstallCommand,
  installDependencies,
} from "../dist/testing/package-manager.js";
import {
  prepareSafeOutputPath,
  resolvePathInsideDirectory,
} from "../dist/testing/safe-path.js";

test("package installs keep dependency specs out of the shell", async () => {
  const calls = [];
  await installDependencies(
    "npm",
    ["react", "package-name;whoami"],
    "C:\\fixture",
    async (command, args, options) => {
      calls.push({ command, args, options });
    },
  );

  assert.deepEqual(calls, [{
    command: "npm",
    args: ["install", "--legacy-peer-deps", "--", "react", "package-name;whoami"],
    options: { cwd: "C:\\fixture" },
  }]);
});

test("package manager option injection is rejected", () => {
  assert.throws(
    () => getInstallCommand("pnpm", ["--config", "package-name"]),
    /Invalid dependency specifier/,
  );
  assert.throws(
    () => getInstallCommand("yarn", ["package-name\n--cwd=/tmp"]),
    /Invalid dependency specifier/,
  );
});

test("registry output paths remain inside the component directory", async () => {
  const fixture = await fs.mkdtemp(path.join(os.tmpdir(), "melonui-cli-security-"));
  try {
    const base = path.join(fixture, "components");
    const nested = await prepareSafeOutputPath(base, "nested/card.tsx");
    assert.equal(nested, path.join(base, "nested", "card.tsx"));
    assert.throws(
      () => resolvePathInsideDirectory(base, "../package.json"),
      /path traversal detected/,
    );
    assert.throws(
      () => resolvePathInsideDirectory(base, path.resolve(fixture, "outside.tsx")),
      /expected a relative path/,
    );
  } finally {
    await fs.rm(fixture, { recursive: true, force: true });
  }
});

test("existing symlink output targets are rejected", async (context) => {
  const fixture = await fs.mkdtemp(path.join(os.tmpdir(), "melonui-cli-symlink-"));
  try {
    const base = path.join(fixture, "components");
    const outside = path.join(fixture, "outside.tsx");
    const target = path.join(base, "linked.tsx");
    await fs.mkdir(base);
    await fs.writeFile(outside, "outside");
    try {
      await fs.symlink(outside, target, "file");
    } catch (error) {
      if (error.code === "EPERM") {
        context.skip("Creating symlinks requires additional Windows privileges");
        return;
      }
      throw error;
    }
    await assert.rejects(
      prepareSafeOutputPath(base, "linked.tsx"),
      /unsafe output target/,
    );
  } finally {
    await fs.rm(fixture, { recursive: true, force: true });
  }
});

test("symlinked parent directories cannot escape the component directory", async (context) => {
  const fixture = await fs.mkdtemp(path.join(os.tmpdir(), "melonui-cli-junction-"));
  try {
    const base = path.join(fixture, "components");
    const outside = path.join(fixture, "outside");
    const linkedDirectory = path.join(base, "linked");
    await fs.mkdir(base);
    await fs.mkdir(outside);
    try {
      await fs.symlink(outside, linkedDirectory, "junction");
    } catch (error) {
      if (error.code === "EPERM") {
        context.skip("Creating junctions requires additional Windows privileges");
        return;
      }
      throw error;
    }
    await assert.rejects(
      prepareSafeOutputPath(base, "linked/card.tsx"),
      /unsafe parent segment/,
    );
  } finally {
    await fs.rm(fixture, { recursive: true, force: true });
  }
});
