const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const [slug, demoFile, registryFile] = process.argv.slice(2);

if (!slug || !demoFile || !registryFile) {
  console.error("Usage: node scripts/sync-component-source.cjs <slug> <demo-file> <registry-file>");
  process.exit(1);
}

const root = path.resolve(__dirname, "..");
const catalogPath = path.join(root, "apps", "web", "src", "data", "components.ts");
const demoPath = path.resolve(root, demoFile);
const registryPath = path.resolve(root, registryFile);
const source = fs.readFileSync(demoPath, "utf8").replace(/\r\n/g, "\n").trimEnd() + "\n";
const catalog = fs.readFileSync(catalogPath, "utf8");
const sourceFile = ts.createSourceFile(catalogPath, catalog, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

const propertyName = (property) => {
  if (!property.name) return undefined;
  if (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) return property.name.text;
  return undefined;
};

let codeProperty;

const visit = (node) => {
  if (codeProperty) return;
  if (ts.isObjectLiteralExpression(node)) {
    const slugProperty = node.properties.find(
      (property) => ts.isPropertyAssignment(property) && propertyName(property) === "slug",
    );
    if (
      slugProperty &&
      ts.isPropertyAssignment(slugProperty) &&
      ts.isStringLiteral(slugProperty.initializer) &&
      slugProperty.initializer.text === slug
    ) {
      codeProperty = node.properties.find(
        (property) => ts.isPropertyAssignment(property) && propertyName(property) === "codeSnippet",
      );
      return;
    }
  }
  ts.forEachChild(node, visit);
};

visit(sourceFile);

if (!codeProperty || !ts.isPropertyAssignment(codeProperty)) {
  console.error(`Could not find codeSnippet for catalog component ${slug}`);
  process.exit(1);
}

const updatedCatalog =
  catalog.slice(0, codeProperty.initializer.getStart(sourceFile)) +
  JSON.stringify(source) +
  catalog.slice(codeProperty.initializer.getEnd());

fs.mkdirSync(path.dirname(registryPath), { recursive: true });
fs.writeFileSync(registryPath, source);
fs.writeFileSync(catalogPath, updatedCatalog);
console.log(`Synced ${slug} from ${demoFile} to the catalog and ${registryFile}`);
