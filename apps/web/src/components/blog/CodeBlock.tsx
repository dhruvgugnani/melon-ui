"use client";

import React, { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  return (
    <div className="relative group bg-[#090909] border border-[#ff5c71]/15 rounded-lg overflow-hidden my-6">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-950/80 border-b border-white/5 text-[10px] font-mono text-[#555] uppercase tracking-wider">
        <span>{language || "code"}</span>
        <button
          onClick={copyToClipboard}
          className="px-2 py-0.5 rounded border border-white/5 hover:border-white/20 bg-zinc-900 text-white/50 hover:text-white transition-colors cursor-pointer active:scale-95 flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7fff5e" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-[#7fff5e]">Copied!</span>
            </>
          ) : (
            <>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Code body */}
      <pre className="p-4 overflow-x-auto text-xs font-mono text-[#7fff5e]/90 leading-relaxed no-scrollbar">
        <code>{code}</code>
      </pre>
    </div>
  );
}
