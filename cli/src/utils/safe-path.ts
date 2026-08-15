import fs from "node:fs/promises";
import path from "node:path";

function isContainedPath(basePath: string, candidatePath: string, allowBase = false) {
  const relative = path.relative(basePath, candidatePath);
  if (relative === "") return allowBase;
  return relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

export function resolvePathInsideDirectory(baseDirectory: string, requestedPath: string) {
  if (
    typeof requestedPath !== "string" ||
    requestedPath.length === 0 ||
    requestedPath.includes("\0") ||
    path.isAbsolute(requestedPath)
  ) {
    throw new Error("Invalid file path: expected a relative path");
  }

  const resolvedBase = path.resolve(baseDirectory);
  const targetPath = path.resolve(resolvedBase, requestedPath);
  if (!isContainedPath(resolvedBase, targetPath)) {
    throw new Error("Invalid file path: path traversal detected");
  }

  return targetPath;
}

export async function prepareSafeOutputPath(baseDirectory: string, requestedPath: string) {
  const resolvedBase = path.resolve(baseDirectory);
  const targetPath = resolvePathInsideDirectory(resolvedBase, requestedPath);
  await fs.mkdir(resolvedBase, { recursive: true });
  const realBase = await fs.realpath(resolvedBase);
  const relativeParent = path.relative(resolvedBase, path.dirname(targetPath));
  let currentPath = resolvedBase;

  for (const segment of relativeParent.split(path.sep).filter(Boolean)) {
    currentPath = path.join(currentPath, segment);
    try {
      const stats = await fs.lstat(currentPath);
      if (stats.isSymbolicLink() || !stats.isDirectory()) {
        throw new Error("Invalid file path: unsafe parent segment");
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      await fs.mkdir(currentPath);
    }
  }

  const realParent = await fs.realpath(path.dirname(targetPath));
  if (!isContainedPath(realBase, realParent, true)) {
    throw new Error("Invalid file path: resolved parent escaped target directory");
  }

  try {
    const targetStats = await fs.lstat(targetPath);
    if (targetStats.isSymbolicLink() || targetStats.isDirectory()) {
      throw new Error("Invalid file path: unsafe output target");
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }

  return targetPath;
}
