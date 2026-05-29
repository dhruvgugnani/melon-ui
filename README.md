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

### 1. Installation & Execution

You can run the MelonUI CLI tool globally on your system, or execute it dynamically on-demand using `npx`.

#### Option A: Global Installation (Recommended)
Install the package globally to access the `melonui` binary directly:
```bash
npm install -g @melonui-dev/cli
```
Once installed, run any command prefixing with `melonui` (e.g. `melonui init`).

#### Option B: Dynamic Execution via npx
Alternatively, run commands directly on-the-fly without global installation:
```bash
npx @melonui-dev/cli [command]
```

---

### 2. Interactive Modes

MelonUI CLI supports intuitive interactive prompts.

#### Navigation Dashboard
If you execute the binary with **zero arguments**, it opens an interactive dashboard menu to select commands:
```bash
melonui
# OR: npx @melonui-dev/cli
```
```text
What would you like to do?
> Initialize MelonUI Project   (Set up utils, paths, and core dependencies)
  Add/Install Components       (Search, select, and install components dynamically)
  Exit
```

#### Searchable Component Selector
To view all available components in the CLI, run the `add` command **without a component parameter**:
```bash
melonui add
# OR: npx @melonui-dev/cli add
```
This fetches the remote registry list and displays a searchable multiselect prompt:
```text
Fetching components from MelonUI registry...

Select components to install (Space to select, Enter to confirm, type to search)
> [ ] Burst Button [Buttons] - Seeds physically burst from click point
  [ ] Ripple Button [Buttons] - Radial click ripple effect
  [ ] Luminous Waves [Backgrounds] - Hardware accelerated WebGL wave field
  [ ] Retro Grid [Backgrounds] - Nostalgic neon perspective grid
```
- **Navigation**: Arrow keys (Up/Down) to browse.
- **Selection**: `Spacebar` to check/uncheck components.
- **Search**: Start typing to filter components dynamically by name or details.
- **Execution**: Press `Enter` to install all selected components.

---

### 3. Command Reference

| Command | Usage | Description |
|---|---|---|
| **`init`** | `melonui init` | Sets up project preferences, installs core requirements (`clsx`, `tailwind-merge`), and creates a local utility file `utils.ts`. |
| **`add`** | `melonui add [component]` | Installs the specified component. If no component is passed, opens the interactive multiselect selector. Resolves and installs dependencies automatically. |
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
