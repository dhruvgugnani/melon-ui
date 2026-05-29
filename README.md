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

### Option A: Global CLI (Recommended)

1. **Install CLI globally**:
   ```bash
   npm install -g @melonui-dev/cli
   ```
2. **Initialize project**:
   ```bash
   melonui init
   ```
3. **Open searchable components checklist**:
   ```bash
   melonui add
   ```
   *(Use the arrow keys to browse, `Space` to select/deselect, start typing to filter, and press `Enter` to confirm).*
4. **(Alternative) Add a component directly**:
   ```bash
   melonui add burst-button
   ```

---

### Option B: Dynamic Execution (No Global Installation)

1. **Initialize project**:
   ```bash
   npx @melonui-dev/cli init
   ```
2. **Open searchable components checklist**:
   ```bash
   npx @melonui-dev/cli add
   ```
   *(Use the arrow keys to browse, `Space` to select/deselect, start typing to filter, and press `Enter` to confirm).*
3. **(Alternative) Add a component directly**:
   ```bash
   npx @melonui-dev/cli add burst-button
   ```

---

### 🛠️ Interactive Dashboard Mode
If you execute the binary with **zero arguments**, it opens an interactive command dashboard to select actions:
```bash
melonui
# OR: npx @melonui-dev/cli
```

---

### 📋 Command Reference

| Command | Usage | Description |
|---|---|---|
| **`init`** | `melonui init` | Sets up project configurations, installs helper utilities (`clsx`, `tailwind-merge`), and creates `utils.ts`. |
| **`add`** | `melonui add [component]` | Installs the specified component. If no component is passed, opens the interactive multiselect list. Resolves and installs dependencies automatically. |
| **`--help`** | `melonui --help` | Lists CLI version, command descriptions, and available option flags. |

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
