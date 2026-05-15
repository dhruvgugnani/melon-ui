export function Frame() {
  return (
    <div className="fixed z-[9999] pointer-events-none"
      style={{
        // Negative inset to push outer curved corners way off-screen,
        // so it looks perfectly square on the outside.
        top: "-200px", bottom: "-200px", left: "-200px", right: "-200px",
        // Padding = 200px (offscreen) + 12px (visible thickness) = 212px
        padding: "212px",
        // Outer radius = 212px (padding) + 40px (inner curve) = 252px
        borderRadius: "252px",
        
        // Melon dark-charcoal rind texture with warm grain
        background: `
          linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.25'/%3E%3C/svg%3E"),
          repeating-linear-gradient(135deg, #1a0e0e 0px, #120a0a 12px, #0d0505 24px, #0d0505 36px)
        `,
        backgroundBlendMode: "normal, overlay, normal",
        boxShadow: "0 20px 60px rgba(0,0,0,0.95), inset 0 0 0 1px rgba(255,92,113,0.06)",
        
        // Mask to hollow out the center
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    >
      {/* Inner depth/bevel shadow (using absolute to match the inner hole) */}
      <div 
        className="absolute"
        style={{
          // Match the inner hole exactly
          top: "212px", bottom: "212px", left: "212px", right: "212px",
          borderRadius: "40px",
          boxShadow: "inset 0 10px 30px rgba(0,0,0,0.95), inset 0 -4px 15px rgba(255,255,255,0.05)"
        }}
      />
    </div>
  );
}
