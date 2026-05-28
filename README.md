# 🍉 MelonUI

> Premium, chaotic, and highly-animated components for the modern web. Built with production taste.

MelonUI is an open-source, hand-crafted collection of premium interactive components and layouts. Designed for developers who value visual excellence, MelonUI drops custom WebGL, Three.js, GSAP, and Framer Motion code straight into your React & Tailwind CSS v4 codebase.

[Explore Components Storefront](https://melonui.dev) | [Become a Sponsor](https://github.com/sponsors/dhruvgugnani)

---

## ✨ Features

- **Copy. Paste. Ship.** – Copy components directly from the web or pull them straight into your local workspace.
- **Dynamic Local CLI** – Add components to your directories with a single command.
- **Advanced Animations** – High-performance timelines with GSAP, interactive 3D physics with Three.js (React Three Fiber), and smooth spring physics with Framer Motion.
- **Resource Optimized** – WebGL canvases and heavy renders unmount and pause automatically when not in view to preserve system resources.
- **Tailwind CSS v4** – Built on clean configurations utilizing CSS-first design tokens.

---

## 🚀 Getting Started

### 1. Initialize the CLI
Run the initialization command at the root of your project:
```bash
npx @melonui-dev/cli init
```
This command queries your directory preferences (e.g., components folders, global CSS filepaths) and generates a local configuration file `melonui.json`.

### 2. Add Components
Pull any component from our registry directly into your codebase:
```bash
npx @melonui-dev/cli add burst-button
```
The CLI automatically reads the component's registry record, installs missing npm packages, handles local imports, and drops the raw TSX component file straight into your workspace.

---

## 🛠️ Repository Architecture

This codebase is a monorepo managed via npm workspaces:
- `apps/web`: The Next.js 16 storefront, containing all documentation guides, component pages, spotlight search palettes, and interactive timelines.
- `cli`: The TypeScript CLI package (`@melonui-dev/cli`) distributed on npm to pull registry assets.
- `registry`: Stores the raw component definitions, metadata, and files distributed to clients.

---

## 💻 Development

To run the codebase locally:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Local Development**:
   ```bash
   npm run dev
   ```
   Runs the Next.js dev server for the web app storefront (on `http://localhost:3000`).

3. **Check Code Quality**:
   - Run typecheckers: `npm run lint`
   - Test TypeScript compile safety: `npx tsc --noEmit`

4. **Production Build**:
   ```bash
   npm run build
   ```
   Builds the workspaces for the Next.js production build and bundles the CLI package via `tsup`.

---

## 📄 License

This repository is open-sourced under the terms of the **MIT License**. Check out [LICENSE](./LICENSE) for details.
