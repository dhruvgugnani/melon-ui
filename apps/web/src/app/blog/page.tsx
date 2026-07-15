import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "MelonUI Engineering Blog | React UI Components & Motion Design",
  description: "Read high-quality articles on React components, creative coding, design systems, GSAP animations, and Tailwind CSS. Learn how to design premium interactive websites.",
  keywords: [
    "react components",
    "ui components",
    "web components",
    "creative coding",
    "gsap react animation",
    "framer motion components",
    "design systems tailwind css",
    "interactive frontend library",
    "best react UI libraries",
    "melonui blog"
  ],
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogLandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "MelonUI Engineering Blog",
    "description": "Guides and tutorials on React components, UI design, web animation and frontend engineering.",
    "publisher": {
      "@type": "Organization",
      "name": "MelonUI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://melonui.dev/favicon.ico"
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto selection:bg-[#ff5c71]/20 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <header className="max-w-4xl mb-16">
        <h1 
          className="text-5xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter text-[#f4f4f4] mb-6"
          style={{ fontFamily: "var(--font-londrina-solid)" }}
        >
          MelonUI Blog
        </h1>
        <p className="font-mono text-[#777] text-sm max-w-2xl leading-relaxed">
          Deep dives, technical guides, and best practices on building customizable <strong className="text-white">React UI components</strong>, <strong className="text-white">GSAP animations</strong>, and responsive <strong className="text-white">Tailwind CSS design systems</strong>.
        </p>
      </header>

      <section aria-label="Articles Grid" className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
        {blogPosts.map((post) => (
          <article 
            key={post.slug} 
            className="group relative flex flex-col justify-between border border-[#ff5c71]/10 bg-[#080808] p-6 store-card-glow hover:border-[#ff5c71]/35 transition-colors overflow-hidden"
          >
            {/* Brackets */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#ff5c71]/25 pointer-events-none" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#ff5c71]/25 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#ff5c71]/25 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#ff5c71]/25 pointer-events-none" />

            <div className="space-y-4">
              <header className="flex justify-between items-center text-[10px] font-mono text-[#555] uppercase tracking-wider">
                <span>{post.category}</span>
                <span>{post.date}</span>
              </header>

              <h2 
                className="text-3xl font-black uppercase text-[#e5e5e5] group-hover:text-[#ff5c71] transition-colors leading-none tracking-tight"
                style={{ fontFamily: "var(--font-londrina-solid)" }}
              >
                <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                  {post.title}
                </Link>
              </h2>

              <p className="text-xs font-mono text-[#666] leading-relaxed line-clamp-3">
                {post.description}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.03] flex items-center justify-between">
              <span className="font-mono text-[9px] text-[#555] uppercase">{post.readTime}</span>
              <Link 
                href={`/blog/${post.slug}`} 
                className="font-mono text-[10px] uppercase text-[#ff5c71] hover:text-[#7fff5e] transition-colors flex items-center gap-1.5"
              >
                Read Article
                <span className="text-[12px]">→</span>
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
