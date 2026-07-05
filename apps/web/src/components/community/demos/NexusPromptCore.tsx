"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface NexusPromptCoreProps extends React.ComponentPropsWithoutRef<"div"> {
  primaryColor?: string;
  accentColor?: string;
  glowColor?: string;
}

export function NexusPromptCore({
  primaryColor = "#00f0ff",
  accentColor = "#ff5c71",
  glowColor = "#7fff5e",
  className = "",
  style,
  ...props
}: NexusPromptCoreProps) {
  const [prompt, setPrompt] = useState("");
  const [state, setState] = useState<"IDLE" | "PROCESSING" | "COMPLETED">("IDLE");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setState("PROCESSING");

    // Simulate AI processing time
    setTimeout(() => {
      setState("COMPLETED");
    }, 2500);
  };

  const handleReset = () => {
    setState("IDLE");
    setPrompt("");
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  return (
    <div
      className={`relative flex items-center justify-center w-full min-h-[400px] font-['Outfit',sans-serif] ${className}`}
      style={style}
      {...props}
    >
      <AnimatePresence mode="wait">
        {state === "IDLE" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
            className="w-full max-w-lg"
          >
            <form onSubmit={handleSubmit} className="relative group">
              <div
                className="absolute -inset-1 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"
                style={{ background: `linear-gradient(90deg, ${primaryColor}, ${accentColor}, ${glowColor})` }}
              />
              <div className="relative flex items-center bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-2 pl-6 pr-2 shadow-2xl">
                <input
                  ref={inputRef}
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter search prompt..."
                  className="w-full bg-transparent text-white placeholder-white/30 outline-none text-lg tracking-wide"
                />
                <button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="ml-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed group/btn overflow-hidden relative"
                >
                   <div
                      className="absolute inset-0 opacity-0 group-hover/btn:opacity-20 transition-opacity"
                      style={{ background: `linear-gradient(135deg, ${primaryColor}, transparent)` }}
                    />
                  <svg className="w-5 h-5 text-white relative z-10 group-hover/btn:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {state === "PROCESSING" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="relative flex items-center justify-center"
          >
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="w-32 h-32 rounded-full absolute mix-blend-screen opacity-70 blur-xl"
               style={{ background: `conic-gradient(from 0deg, ${primaryColor}, transparent, ${accentColor}, transparent, ${glowColor})` }}
             />
             <motion.div
               animate={{ scale: [1, 1.1, 1] }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
               className="w-24 h-24 bg-black/80 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(255,255,255,0.1)] overflow-hidden"
             >
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />

                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ["10px", "30px", "10px"] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                      className="w-1.5 rounded-full"
                      style={{ backgroundColor: [primaryColor, accentColor, glowColor][i] }}
                    />
                  ))}
                </div>
             </motion.div>
          </motion.div>
        )}

        {state === "COMPLETED" && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
            className="w-full max-w-2xl relative"
          >
            {/* Morphing Background Plate */}
            <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-20" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }} />

            <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
               {/* Noise Overlay */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />

               <div className="p-6 border-b border-white/5 flex justify-between items-start bg-white/[0.02]">
                 <div className="flex gap-4 items-start">
                   <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/10" style={{ background: `linear-gradient(135deg, ${primaryColor}40, transparent)` }}>
                      <span className="text-white text-xs">AI</span>
                   </div>
                   <div>
                     <h3 className="text-white/40 text-xs tracking-widest uppercase mb-1">Search Request</h3>
                     <p className="text-white/90 text-sm">{prompt}</p>
                   </div>
                 </div>
                 <button onClick={handleReset} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors shrink-0">
                    <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                 </button>
               </div>

               <div className="p-8">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="prose prose-invert max-w-none"
                  >
                    <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse mb-4" />
                    <div className="h-4 w-full bg-white/10 rounded animate-pulse mb-4" style={{ animationDelay: "150ms" }} />
                    <div className="h-4 w-5/6 bg-white/10 rounded animate-pulse mb-8" style={{ animationDelay: "300ms" }} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="h-24 rounded-lg border border-white/5 bg-white/[0.01] p-4 flex flex-col justify-end relative overflow-hidden group">
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                         <span className="relative z-10 text-white/60 text-xs font-mono uppercase tracking-wider">Result Asset 01</span>
                         <motion.div
                           className="absolute top-0 right-0 w-16 h-16 blur-xl opacity-0 group-hover:opacity-40 transition-opacity"
                           style={{ backgroundColor: primaryColor }}
                         />
                      </div>
                      <div className="h-24 rounded-lg border border-white/5 bg-white/[0.01] p-4 flex flex-col justify-end relative overflow-hidden group">
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                         <span className="relative z-10 text-white/60 text-xs font-mono uppercase tracking-wider">Result Asset 02</span>
                         <motion.div
                           className="absolute top-0 right-0 w-16 h-16 blur-xl opacity-0 group-hover:opacity-40 transition-opacity"
                           style={{ backgroundColor: accentColor }}
                         />
                      </div>
                    </div>
                  </motion.div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NexusPromptCore;