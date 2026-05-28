import React from "react";
import { Navbar } from "@/components/overlay/Navbar";
import { SpotlightSearch } from "@/components/layout/SpotlightSearch";
import { SmoothScrollLayout } from "@/components/community/SmoothScrollLayout";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#050505] text-white flex flex-col">
      {/* Search overlay & Navbar */}
      <Navbar />
      <SpotlightSearch />

      {/* Main scrolling content area */}
      <div className="flex-1 w-full overflow-hidden">
        <SmoothScrollLayout>
          <div className="relative w-full min-h-full">
            {/* Background Cyber Grid */}
            <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
                  `,
                  backgroundSize: "24px 24px",
                }}
              />
              {/* Glow blobs */}
              <div className="absolute -left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-[#ff5c71]/3 blur-[120px]" />
              <div className="absolute -right-[10%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-[#7fff5e]/3 blur-[120px]" />
            </div>

            {/* Scrollable page body with top padding to clear Navbar */}
            <div className="relative z-10 w-full pt-32 px-6 md:px-10 lg:px-14 pb-32">
              {children}
            </div>
          </div>
        </SmoothScrollLayout>
      </div>
    </div>
  );
}
