# MelonUI Component Development Guidelines

This document defines the core standards and architectural rules for building, modifying, and refactoring MelonUI components. AI models and developers MUST adhere strictly to these guidelines to ensure the repository remains fully reusable, type-safe, and visually premium.

---

## 🚀 1. Universal Component Rules

### 1.1 Props Inheritance & Ref Forwarding
All components must extend their native HTML counterpart props to allow downstream developers full flexibility with className merges, custom styles, and standard event handlers.
- **Rule**: Use `React.ComponentPropsWithoutRef<"tagName">` (e.g., `"div"`, `"button"`, `"input"`) and forward remaining properties (`...props`) to the root element.
- **Example**:
  ```tsx
  export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
    accentColor?: string;
  }
  
  export function CustomButton({ accentColor = "#7fff5e", className = "", ...props }: ButtonProps) {
    return (
      <button className={`premium-btn ${className}`} {...props}>
        ...
      </button>
    );
  }
  ```

### 1.2 No Hardcoded Wrapper Backgrounds
Except for dedicated full-page background animations, components should NEVER force their own solid background wrapper.
- **Rule**: A component must only render its own boundaries. Avoid surrounding a button, nav, input, or cursor with a hardcoded, styled parent `div` that acts as a mockup background (e.g., `bg-[#060606] h-[300px] w-full`). Let the consuming application define the context container.
- **Exception**: "3D Backgrounds" or full canvas scenes (e.g., `ParticleBackground`, `RetroGrid`, `FloatingOrbs`, `LuminousWaves`, `MatrixRain`, `StickerWall`) are allowed to define container dimensions and background options, but they must expose the background color as a customizable prop (e.g., `bg?: string`) defaulting to the theme colors.

---

## 🎨 2. Design & Aesthetics Rules

### 2.1 The Purple Ban
MelonUI branding is distinct and original. To maintain a unified aesthetic and avoid generic AI design patterns:
- **Rule**: **NEVER** use purple, violet, indigo, or magenta color tokens as defaults.
- **Defaults**: Standardize on the MelonUI premium palette:
  - Neon Coral: `#ff5c71`
  - Neon Green / Acid Green: `#7fff5e`
  - Warm Cream: `#e8d5b7`
  - Deep Obsidian / Charcoal: `#050505` / `#0d0d10`

### 2.2 Reusability & Zero Hardcoded Content
Never ship components with hardcoded UI labels, descriptions, or mock data that cannot be changed by the consumer.
- **Rule**: Always expose text labels, values, titles, and item arrays as customizable props with reasonable defaults.
- **StickerWall Example**: Avoid hardcoding "Your Hero Title Goes Here" without a prop. Make `titleText` default to `""` so the background is completely clean unless text is explicitly requested, and support forwarding custom `children` inside.

---

## ⚙️ 3. Performance & Animation Standards

### 3.1 GSAP & Motion Lifecycle Control
To prevent memory leaks and ensure clean state transitions:
- **Rule**: Always clean up GSAP timelines, window resize listeners, and custom mouse move listeners during component unmounting.



---

## 🩺 4. Type Safety & Validation Rules
- **Rule**: Prevent type overlap conflicts. Framer Motion `motion.div` or `motion.section` can clash with normal React types on properties like `onDrag`, `onAnimationStart`, or `title`. Use `Omit` to resolve these overlaps:
  ```typescript
  export interface MyComponentProps extends Omit<HTMLMotionProps<"section">, "title"> {
    title?: React.ReactNode;
  }
  ```
- **Rule**: Run `npx tsc --noEmit` and `npm run lint` on the codebase after any modification to ensure zero compilation or typing errors.
