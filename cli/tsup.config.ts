import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "testing/package-manager": "src/utils/package-manager.ts",
    "testing/safe-path": "src/utils/safe-path.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  minify: true,
  splitting: false,
});
