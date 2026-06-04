# MelonUI Component Development Guidelines

This document defines the core engineering standards and architectural rules for building, modifying, and refactoring MelonUI components. AI agents and developers MUST adhere strictly to these patterns to ensure that components are highly reusable, type-safe, and visually premium.

---

## ⚡ 1. The Dynamic Prop Architecture (Slot & Wrapper Patterns)

To build industry-standard interactive components, you must design props to allow maximum customizability without breaking default implementations.

### 1.1 The children Slot Rule (Reactbits-Style Customization)
If a component wraps content (e.g., cards, panels, tickets, tabs), it **MUST NOT** restrict developers to static string props. It should act as an interactive structural frame that accepts custom JSX.

*   **Pattern**: Expose both standard `children` (mapping to the primary visual surface) and specialized slots (e.g., `frontChildren`, `backChildren`, `revealChildren`, `topChildren`) for multi-state layouts.
*   **Fallback Strategy**: Always check if `children` (or state-specific slots) are passed. If present, render the children directly. Otherwise, fall back to rendering the default layout built from basic props.
*   **Example**:
    ```tsx
    export interface InteractiveCardProps extends React.ComponentPropsWithoutRef<"div"> {
      title?: string;
      accentColor?: string;
      children?: React.ReactNode; // Custom overlay/content
    }

    export function InteractiveCard({
      title = "Default Core",
      accentColor = "#7fff5e",
      children,
      ...props
    }: InteractiveCardProps) {
      return (
        <div className="card-frame" {...props}>
          {children ? children : (
            <div className="default-layout">
              <h3 style={{ color: accentColor }}>{title}</h3>
            </div>
          )}
        </div>
      );
    }
    ```

### 1.2 Destructuring & Clean Defaults
Assign default values to props directly inside the function signature via destructuring. This makes default behaviors clear to both builders and consuming AIs.
*   **Anti-Pattern**: Using `Component.defaultProps` (deprecated in modern React).
*   **Anti-Pattern**: Manual checks like `const activeColor = color || "#ff5c71"`.

---

## 🎨 2. Component Composition & Clean DOM Rules

### 2.1 Ref Forwarding (Industry Standard)
To play nicely with animation libraries (GSAP, Framer Motion) and focus managers (Radix, shadcn), components must forward their root element references.
*   **Rule**: Wrap components in `React.forwardRef`, matching the generic type parameters `<ElementType, PropInterface>`.
*   **Example**:
    ```tsx
    export const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
      ({ className = "", ...props }, ref) => {
        return <input ref={ref} className={`premium-input ${className}`} {...props} />;
      }
    );
    CustomInput.displayName = "CustomInput";
    ```

### 2.2 Native Props Inheritance
Always extend the native HTML element props so consumers can pass down custom attributes (`onClick`, `aria-*`, `data-*`, `style`) seamlessly.
*   **Rule**: Use `React.ComponentPropsWithoutRef<"tagName">` and spread remaining props (`...props`) onto the root wrapper.

### 2.3 No Hardcoded Wrapper Backgrounds
*   **Rule**: Components must never enclose themselves in mock parent containers (e.g. `bg-[#060606] h-[400px] w-full`). Let the consuming canvas define the boundaries.
*   **Exception**: High-fidelity backgrounds/canvas visuals (e.g. `MatrixRain`, `StickerWall`) are permitted to define default sizing, but must expose customization options.

---

## 🍉 3. Design Aesthetics & The Brand Palette

### 3.1 The Purple Ban (Strictly Enforced)
Purple, violet, and deep indigo are forbidden as default colors. They represent the generic AI design cliché.
*   **MelonUI Core Accent Tokens**:
    *   🍉 **Neon Coral**: `#ff5c71`
    *   ⚡ **Acid Green / Neon Green**: `#7fff5e`
    *   🍦 **Warm Cream**: `#e8d5b7`
    *   🌌 **Deep Obsidian / Dark Charcoal**: `#050505` / `#0d0d10`
    *   💎 **Cyan Telemetry**: `#00f0ff`

---

## ⚙️ 4. Performance & Lifecycles

### 4.1 Memory Leak Prevention
Always clean up animation resources during the unmount cycle.
*   **Framer Motion**: Keep state-driven components inside `<AnimatePresence>` wrappers when layout shifts are active.
*   **GSAP**: Wrap code block initializations in GSAP Contexts or clean them up in the returning hook function:
    ```typescript
    useEffect(() => {
      const ctx = gsap.context(() => {
        gsap.to(".animated-node", { opacity: 1 });
      });
      return () => ctx.revert(); // Clean up context!
    }, []);
    ```
