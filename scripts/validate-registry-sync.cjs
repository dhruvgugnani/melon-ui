const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const catalogPath = path.join(root, "apps", "web", "src", "data", "components.ts");
const registryPath = path.join(root, "registry", "registry.json");
const registryRoot = path.join(root, "registry");

function normalizeSource(source) {
  return source.replace(/\r\n/g, "\n").trimEnd();
}

function getPropertyText(object, name, sourceFile) {
  const property = object.properties.find(
    (candidate) =>
      ts.isPropertyAssignment(candidate) &&
      candidate.name.getText(sourceFile) === name,
  );

  if (!property || !ts.isStringLiteralLike(property.initializer)) {
    return undefined;
  }

  return property.initializer.text;
}

function readCatalog() {
  const source = fs.readFileSync(catalogPath, "utf8");
  const sourceFile = ts.createSourceFile(
    catalogPath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const components = new Map();

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const slug = getPropertyText(node, "slug", sourceFile);
      const codeSnippet = getPropertyText(node, "codeSnippet", sourceFile);

      if (slug && codeSnippet) {
        if (components.has(slug)) {
          throw new Error(`Duplicate catalog slug: ${slug}`);
        }
        components.set(slug, codeSnippet);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return components;
}

function validate() {
  const catalog = readCatalog();
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  const requestedSlugs = process.argv.slice(2);
  const selectedSlugs =
    requestedSlugs.length > 0 ? requestedSlugs : Array.from(catalog.keys());
  const errors = [];

  for (const slug of selectedSlugs) {
    const snippet = catalog.get(slug);
    if (!snippet) {
      errors.push(`${slug}: missing from the web catalog`);
      continue;
    }

    const entry = registry[slug];
    if (!entry) {
      errors.push(`${slug}: missing from registry.json`);
      continue;
    }

    if (!Array.isArray(entry.files) || entry.files.length === 0) {
      errors.push(`${slug}: registry entry has no files`);
      continue;
    }

    for (const file of entry.files) {
      const sourcePath = path.join(registryRoot, file.path);
      if (!fs.existsSync(sourcePath)) {
        errors.push(`${slug}: missing registry file ${file.path}`);
      }
    }

    const primaryFile = entry.files[0];
    const primaryPath = path.join(registryRoot, primaryFile.path);
    if (
      fs.existsSync(primaryPath) &&
      normalizeSource(snippet) !== normalizeSource(fs.readFileSync(primaryPath, "utf8"))
    ) {
      errors.push(`${slug}: catalog code snippet differs from ${primaryFile.path}`);
    }
  }

  if (requestedSlugs.length === 0) {
    for (const slug of Object.keys(registry)) {
      if (!catalog.has(slug)) {
        errors.push(`${slug}: registry entry is missing from the web catalog`);
      }
    }
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`[registry] ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `[registry] ${selectedSlugs.length} catalog components match registry metadata and source files`,
  );
}

validate();
