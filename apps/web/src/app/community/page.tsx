"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Navbar } from "@/components/overlay/Navbar";
import { SpotlightSearch } from "@/components/layout/SpotlightSearch";
import gsap from "gsap";

export default function CommunitySubmitPage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "Buttons",
    codeUrl: "",
    author: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.codeUrl || !formData.author) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    // Mock API post request
    try {
      await fetch("/api/registry", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.warn("API call failed (running in mock mode):", err);
    }

    // GSAP animated transition to success state
    const tl = gsap.timeline({
      onComplete: () => {
        setIsSubmitted(true);
        setIsSubmitting(false);
        // Animate success screen in
        gsap.fromTo(
          successRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }
        );
      },
    });

    tl.to(formRef.current, {
      scale: 0.95,
      opacity: 0,
      duration: 0.45,
      ease: "power2.in",
    });
  };

  const categories = [
    "Buttons",
    "Navigations",
    "Cards",
    "Inputs",
    "Cursors",
    "Widgets",
    "3D Backgrounds",
    "Scroll Effects",
    "GSAP Text",
    "Page Transitions",
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#050505] relative text-white select-text">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
            `,
            backgroundSize: "24px 24px"
          }}
        />
        <div className="absolute left-[20%] top-[30%] h-[400px] w-[400px] rounded-full bg-[#ff5c71]/4 blur-[100px]" />
        <div className="absolute right-[20%] top-[20%] h-[400px] w-[400px] rounded-full bg-[#7fff5e]/2 blur-[100px]" />
      </div>

      <Navbar />
      <SpotlightSearch />

      <main className="flex-1 flex items-center justify-center pt-28 px-4 pb-20 relative z-10">
        <div className="w-full max-w-lg">
          {!isSubmitted ? (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-6 p-6 md:p-8 rounded-[8px] border border-white/10 bg-zinc-950/40 backdrop-blur-md shadow-[0_12px_48px_rgba(0,0,0,0.6)]"
            >
              {/* Header */}
              <div className="space-y-2 text-center">
                <div className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#7fff5e] animate-pulse" />
                  <span className="font-mono text-[9px] text-[#ff5c71] uppercase tracking-[0.25em]">Submit Component</span>
                </div>
                <h1
                  className="text-4xl font-black uppercase text-white leading-none"
                  style={{ fontFamily: "var(--font-londrina-solid)" }}
                >
                  Share Your Drop
                </h1>
                <p className="text-xs text-white/50 max-w-sm mx-auto leading-relaxed">
                  Have you built a chaotic component or a WebGL shader layout? Share it with the MelonUI storefront community.
                </p>
              </div>

              <hr className="border-white/5" />

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label htmlFor="title" className="block font-mono text-[10px] text-white/40 uppercase tracking-wider">
                    Component Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Kinetic Magnet Grid"
                    className="w-full px-4 py-2.5 bg-zinc-950/80 border border-white/10 rounded-[6px] font-mono text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#7fff5e] focus:ring-1 focus:ring-[#7fff5e]/20 transition-all"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label htmlFor="category" className="block font-mono text-[10px] text-white/40 uppercase tracking-wider">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-white/10 rounded-[6px] font-mono text-xs text-white focus:outline-none focus:border-[#7fff5e] transition-all appearance-none cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-zinc-950 text-white">
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Source Link */}
                <div className="space-y-1.5">
                  <label htmlFor="codeUrl" className="block font-mono text-[10px] text-white/40 uppercase tracking-wider">
                    GitHub / Source Code Link *
                  </label>
                  <input
                    id="codeUrl"
                    type="url"
                    required
                    value={formData.codeUrl}
                    onChange={(e) => setFormData({ ...formData, codeUrl: e.target.value })}
                    placeholder="e.g. https://github.com/user/component"
                    className="w-full px-4 py-2.5 bg-zinc-950/80 border border-white/10 rounded-[6px] font-mono text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#7fff5e] focus:ring-1 focus:ring-[#7fff5e]/20 transition-all"
                  />
                </div>

                {/* Author */}
                <div className="space-y-1.5">
                  <label htmlFor="author" className="block font-mono text-[10px] text-white/40 uppercase tracking-wider">
                    Creator Handle *
                  </label>
                  <input
                    id="author"
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="e.g. @dhruvgugnani"
                    className="w-full px-4 py-2.5 bg-zinc-950/80 border border-white/10 rounded-[6px] font-mono text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#7fff5e] focus:ring-1 focus:ring-[#7fff5e]/20 transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#7fff5e] text-black font-black uppercase tracking-wider text-xs rounded-full hover:bg-white active:scale-95 shadow-[0_4px_20px_rgba(127,255,94,0.15)] hover:scale-[1.01] transition-all duration-200 cursor-pointer disabled:opacity-50"
                style={{ fontFamily: "var(--font-londrina-solid)" }}
              >
                {isSubmitting ? "Uploading..." : "Submit Component"}
              </button>
            </form>
          ) : (
            <div
              ref={successRef}
              className="text-center p-8 rounded-[8px] border border-white/10 bg-zinc-950/40 backdrop-blur-md shadow-[0_12px_48px_rgba(0,0,0,0.6)] space-y-6"
            >
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full border-2 border-[#7fff5e] bg-[#7fff5e]/10 flex items-center justify-center text-[#7fff5e]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
              </div>

              <div className="space-y-2">
                <h2
                  className="text-4xl font-black uppercase text-white leading-none"
                  style={{ fontFamily: "var(--font-londrina-solid)" }}
                >
                  Drop Received!
                </h2>
                <p className="text-xs text-white/50 max-w-sm mx-auto leading-relaxed font-mono">
                  Thanks for contributing to MelonUI. Our design auditors will review your component&apos;s taste score shortly.
                </p>
              </div>

              <Link
                href="/components"
                className="inline-block px-6 py-2.5 bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 rounded-full transition-all text-xs font-bold"
              >
                Back to Components
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
