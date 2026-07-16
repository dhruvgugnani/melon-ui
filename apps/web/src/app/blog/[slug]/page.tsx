import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { blogPosts, getPostBySlug } from "@/data/blog";
import { CodeBlock } from "@/components/blog/CodeBlock";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(
  props: BlogPostPageProps
): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://melonui.dev";

  return {
    title: `${post.title} | MelonUI Blog`,
    description: post.description,
    keywords: [...post.tags, "react components", "ui library", "motion design", "frontend tutorial"],
    openGraph: {
      title: `${post.title} | MelonUI Blog`,
      description: post.description,
      type: "article",
      url: `${siteUrl}/blog/${post.slug}`,
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | MelonUI Blog`,
      description: post.description,
      images: [`/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}`],
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

// Simple inline formatting parser (bold and code backticks)
const parseInline = (text: string): React.ReactNode => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={index} className="font-bold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={index}
              className="px-1.5 py-0.5 rounded bg-zinc-950/60 border border-white/5 font-mono text-[#7fff5e] text-[10px] mx-0.5"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      })}
    </>
  );
};

// Markdown table renderer
const renderTable = (block: string, key: number) => {
  const lines = block.trim().split("\n");
  const rows = lines
    .map((line) => {
      // Remove leading and trailing pipe
      const trimmedLine = line.trim().replace(/^\||\|$/g, "");
      return trimmedLine.split("|").map((cell) => cell.trim());
    })
    // Filter out divider row (e.g., contains '---')
    .filter((row) => !row.some((cell) => cell.includes("---")));

  if (rows.length === 0) return null;

  const headers = rows[0];
  const dataRows = rows.slice(1);

  return (
    <div key={key} className="overflow-x-auto my-8 border border-white/10 rounded-lg bg-zinc-950/20 backdrop-blur-sm">
      <table className="w-full text-left border-collapse text-xs font-mono">
        <thead>
          <tr className="border-b border-[#ff5c71]/20 bg-[#ff5c71]/5">
            {headers.map((cell, idx) => (
              <th key={idx} className="p-4 uppercase text-[#ff5c71] font-bold tracking-wider">
                {parseInline(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {dataRows.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-white/[0.01] transition-colors">
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="p-4 text-white/80 leading-relaxed">
                  {parseInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default async function BlogPostPage(props: BlogPostPageProps) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "datePublished": new Date(post.date).toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "MelonUI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://melonui.dev/favicon.ico"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://melonui.dev/blog/${post.slug}`
    }
  };

  // Simple parser to render markdown string with beautiful styling
  const renderContent = (content: string) => {
    return content.split("\n\n").map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // H1 Header (Rendered as H2 for SEO heading hierarchy compliance)
      if (trimmed.startsWith("# ")) {
        return (
          <h2 
            key={idx}
            className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-8 mt-12"
            style={{ fontFamily: "var(--font-londrina-solid)" }}
          >
            {parseInline(trimmed.slice(2))}
          </h2>
        );
      }

      // H2 Header
      if (trimmed.startsWith("## ")) {
        return (
          <h2 
            key={idx}
            className="text-2xl md:text-3xl font-black uppercase text-[#ff5c71] tracking-tight mb-6 mt-10"
            style={{ fontFamily: "var(--font-londrina-solid)" }}
          >
            {parseInline(trimmed.slice(3))}
          </h2>
        );
      }

      // H3 Header
      if (trimmed.startsWith("### ")) {
        return (
          <h3 
            key={idx}
            className="text-xl md:text-2xl font-bold uppercase text-[#e5e5e5] tracking-tight mb-4 mt-8"
            style={{ fontFamily: "var(--font-londrina-solid)" }}
          >
            {parseInline(trimmed.slice(4))}
          </h3>
        );
      }

      // Code Block
      if (trimmed.startsWith("```")) {
        const lines = trimmed.split("\n");
        const language = lines[0].replace("```", "").trim();
        const code = lines.slice(1, -1).join("\n");
        return <CodeBlock key={idx} code={code} language={language} />;
      }

      // Bullet points
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        return (
          <ul key={idx} className="list-disc pl-6 space-y-2 mb-6 font-mono text-xs text-[#bbb] leading-relaxed">
            {trimmed.split("\n").map((line, lIdx) => (
              <li key={lIdx}>
                {parseInline(line.replace(/^(\*|-)\s+/, ""))}
              </li>
            ))}
          </ul>
        );
      }

      // Numbered List
      if (/^\d+\./.test(trimmed)) {
        return (
          <ol key={idx} className="list-decimal pl-6 space-y-2 mb-6 font-mono text-xs text-[#bbb] leading-relaxed">
            {trimmed.split("\n").map((line, lIdx) => (
              <li key={lIdx}>
                {parseInline(line.replace(/^\d+\.\s+/, ""))}
              </li>
            ))}
          </ol>
        );
      }

      // Table
      if (trimmed.startsWith("|")) {
        return renderTable(trimmed, idx);
      }

      // Paragraph text
      return (
        <p key={idx} className="font-mono text-xs text-[#aaa] leading-relaxed mb-6">
          {parseInline(trimmed)}
        </p>
      );
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto selection:bg-[#ff5c71]/20 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <header className="max-w-4xl mb-12 pb-8 border-b border-[#ff5c71]/10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-3 mb-6">
          <Link href="/blog" className="font-mono text-[10px] text-[#555] hover:text-[#f4f4f4] transition-colors uppercase tracking-[0.25em]">
            Blog
          </Link>
          <span className="text-[#333] text-xs">/</span>
          <span className="font-mono text-[10px] text-[#ff5c71] uppercase tracking-[0.25em]">{post.category}</span>
        </nav>

        <h1 
          className="text-4xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter text-[#f4f4f4] mb-6"
          style={{ fontFamily: "var(--font-londrina-solid)" }}
        >
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] text-[#555] uppercase tracking-wider">
          <div className="flex gap-4">
            <span>By {post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
          </div>
          <span>{post.readTime}</span>
        </div>
      </header>

      <section className="max-w-3xl">
        <div className="prose prose-invert prose-xs">
          {renderContent(post.content)}
        </div>
      </section>

      <footer className="max-w-3xl mt-16 pt-8 border-t border-[#ff5c71]/10 flex justify-between items-center">
        <div className="flex gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 border border-[#1a1a1a] bg-[#0c0c0c] text-[#555] font-mono text-[9px] uppercase tracking-widest">
              {tag}
            </span>
          ))}
        </div>
        <Link href="/blog" className="font-mono text-xs uppercase text-[#ff5c71] hover:text-[#7fff5e] transition-colors">
          ← Back to Blog
        </Link>
      </footer>
    </div>
  );
}
