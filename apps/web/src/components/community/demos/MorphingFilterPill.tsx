"use client";

import * as React from "react";
import { useState } from "react";
import { MorphingFilterPill } from "../../../../../../registry/components/morphing-filter-pill";

export function MorphingFilterPillDemo() {
  const [logs, setLogs] = useState<string[]>(["> INITIALIZING FILTER MODULE..."]);

  const addLog = (msg: string) => {
    setLogs((prev) => {
      const newLogs = [...prev, `> ${msg}`];
      if (newLogs.length > 5) newLogs.shift();
      return newLogs;
    });
  };

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center relative p-8 font-mono overflow-hidden">
      {/* Background Noise & Gradient */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[#050505]" />
         <div
           className="absolute inset-0 opacity-20 mix-blend-overlay"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
           }}
         />

      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-12">
        <div className="text-center mb-4">
           <h2 className="text-2xl font-bold tracking-[0.2em] text-white/90 uppercase mb-2">Query Parameters</h2>
           <p className="text-xs text-white/40 tracking-widest uppercase">Select to expand</p>
        </div>

        {/* The Filters Container */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm w-full">
          <MorphingFilterPill
            label="STATUS"
            primaryColor="#00f0ff"
            onChange={(val: string) => addLog(`STATUS UPDATED: ${val.toUpperCase()}`)}
            options={[
              { value: "all", label: "All" },
              { value: "live", label: "Live" },
              { value: "draft", label: "Draft" },
              { value: "archived", label: "Archived" },
            ]}
          />

          <MorphingFilterPill
            label="REGION"
            primaryColor="#ff5c71"
            onChange={(val: string) => addLog(`REGION UPDATED: ${val.toUpperCase()}`)}
            defaultValue="us-east"
            options={[
              { value: "global", label: "Global" },
              { value: "us-east", label: "US East" },
              { value: "eu-west", label: "EU West" },
            ]}
          />
        </div>

        {/* Dummy Terminal Output */}
        <div className="w-full max-w-md p-4 rounded-xl bg-black/60 border border-white/10 mt-8 h-40 flex flex-col justify-end">
            <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-2">
                <span className="text-[10px] text-white/40 tracking-widest uppercase">System Logs</span>

            </div>
            <div className="flex-1 overflow-hidden flex flex-col justify-end gap-1.5">
                {logs.map((log, i) => (
                    <div key={i} className="text-xs text-white/70 tracking-wide" style={{ opacity: (i + 1) / logs.length }}>
                        {log}
                    </div>
                ))}
                <div className="text-xs text-white/40 tracking-wide mt-1 animate-pulse">
                    _
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

export default MorphingFilterPillDemo;
