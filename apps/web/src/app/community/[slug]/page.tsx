import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { componentsData, getComponentBySlug } from '@/data/components';
import { ComponentShowcase } from '@/components/community/ComponentShowcase';

import dynamic from 'next/dynamic';
import React from 'react';
import fs from 'fs';
import path from 'path';

// Dynamically import all components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentsMap: Record<string, React.ComponentType<any>> = {
  CliTerminal: dynamic(() => import('@/components/community/demos/CliTerminal').then(m => m.CliTerminal)),
  ChangelogCard: dynamic(() => import('@/components/community/demos/ChangelogCard').then(m => m.ChangelogCard)),
  SeedBurstButton: dynamic(() => import('@/components/community/demos/SeedBurstButton').then(m => m.SeedBurstButton)),
  RippleButton: dynamic(() => import('@/components/community/demos/RippleButton').then(m => m.RippleButton)),
  MagneticNav: dynamic(() => import('@/components/community/demos/MagneticNav').then(m => m.MagneticNav)),
  BreadcrumbTrail: dynamic(() => import('@/components/community/demos/BreadcrumbTrail').then(m => m.BreadcrumbTrail)),
  RindPeelCard: dynamic(() => import('@/components/community/demos/RindPeelCard').then(m => m.RindPeelCard)),
  FlipCard: dynamic(() => import('@/components/community/demos/FlipCard').then(m => m.FlipCard)),
  VineInput: dynamic(() => import('@/components/community/demos/VineInput').then(m => m.VineInput)),
  TagInput: dynamic(() => import('@/components/community/demos/TagInput').then(m => m.TagInput)),
  ParticleBackground: dynamic(() => import('@/components/community/demos/ClientParticleBackground').then(m => m.ParticleBackground)),
  FloatingOrbs: dynamic(() => import('@/components/community/demos/ClientFloatingOrbs').then(m => m.FloatingOrbs)),
  JuicyCursor: dynamic(() => import('@/components/community/demos/JuicyCursor').then(m => m.JuicyCursor)),
  CrosshairCursor: dynamic(() => import('@/components/community/demos/CrosshairCursor').then(m => m.CrosshairCursor)),
  HarvestReveal: dynamic(() => import('@/components/community/demos/HarvestReveal').then(m => m.HarvestReveal)),
  ParallaxStrips: dynamic(() => import('@/components/community/demos/ParallaxStrips').then(m => m.ParallaxStrips)),
  MelonDripText: dynamic(() => import('@/components/community/demos/MelonDripText').then(m => m.MelonDripText)),
  ScrambleText: dynamic(() => import('@/components/community/demos/ScrambleText').then(m => m.ScrambleText)),
  RindWipeTransition: dynamic(() => import('@/components/community/demos/RindWipeTransition').then(m => m.RindWipeTransition)),
  MorphTransition: dynamic(() => import('@/components/community/demos/MorphTransition').then(m => m.MorphTransition)),
  HoloTicket: dynamic(() => import('@/components/community/demos/HoloTicket').then(m => m.HoloTicket)),
  SolarCarousel: dynamic(() => import('@/components/community/demos/SolarCarousel').then(m => m.SolarCarousel)),
  KineticMagnet: dynamic(() => import('@/components/community/demos/KineticMagnet').then(m => m.KineticMagnet)),
};

export async function generateStaticParams() {
  return componentsData.map((component) => ({
    slug: component.slug,
  }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const component = getComponentBySlug(params.slug);

  if (!component) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://melonui.com';

  return {
    title: `${component.title} | MelonUI Community Components`,
    description: component.description,
    keywords: [...component.tags, component.title, "UI Component", "MelonUI", component.category],
    openGraph: {
      title: `${component.title} | MelonUI`,
      description: component.description,
      type: "article",
      url: `${siteUrl}/community/${component.slug}`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(component.title)}&category=${encodeURIComponent(component.category)}`,
          width: 1200,
          height: 630,
          alt: `${component.title} Component - MelonUI`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${component.title} | MelonUI`,
      description: component.description,
      images: [`/api/og?title=${encodeURIComponent(component.title)}&category=${encodeURIComponent(component.category)}`],
    },
    alternates: {
      canonical: `/community/${component.slug}`,
    },
  };
}

export default async function ComponentPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const component = getComponentBySlug(params.slug);

  if (!component) {
    notFound();
  }

  const ComponentToRender = componentsMap[component.componentPath];

  let fullSourceCode = component.codeSnippet;
  try {
    const filePath = path.join(process.cwd(), "src/components/community/demos", `${component.componentPath}.tsx`);
    if (fs.existsSync(filePath)) {
      fullSourceCode = fs.readFileSync(filePath, "utf8");
    } else {
      // Fallback for wrapped components (e.g. FloatingOrbs -> ClientFloatingOrbs)
      const wrapperName = component.componentPath === "FloatingOrbs" 
        ? "ClientFloatingOrbs" 
        : component.componentPath === "ParticleBackground" 
          ? "ClientParticleBackground" 
          : `Client${component.componentPath}`;
      const clientFilePath = path.join(process.cwd(), "src/components/community/demos", `${wrapperName}.tsx`);
      if (fs.existsSync(clientFilePath)) {
        fullSourceCode = fs.readFileSync(clientFilePath, "utf8");
      }
    }
  } catch (e) {
    console.error("Failed to read source file:", e);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": component.title,
    "description": component.description,
    "programmingLanguage": "TypeScript/React",
    "keywords": component.tags.join(', ')
  };

  const relatedComponents = componentsData
    .filter(c => c.category === component.category && c.slug !== component.slug)
    .slice(0, 3);

  return (
    <article className="min-h-screen bg-[#050505] selection:bg-[#ff5c71] selection:text-[#050505] px-6 md:px-10 lg:px-14 pb-32 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="flex justify-between items-start w-full mb-16">
        <div className="max-w-4xl">
          <nav aria-label="Breadcrumb" className="flex items-center gap-3 mb-6">
            <Link href="/community" className="font-mono text-[10px] text-[#333] hover:text-[#f4f4f4] transition-colors uppercase tracking-[0.25em]">
              Community
            </Link>
            <span className="text-[#333] text-xs">/</span>
            <span className="font-mono text-[10px] text-[#ff5c71] uppercase tracking-[0.25em]">{component.category}</span>
          </nav>

          <h1 className="text-5xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter text-[#f4f4f4] mb-6"
            style={{ fontFamily: "var(--font-londrina-solid)" }}>
            {component.title}
          </h1>
          <p className="font-mono text-[#777] text-sm max-w-2xl leading-relaxed mb-8">
            {component.description}
          </p>
        </div>

      </header>

      <section aria-labelledby="showcase-heading" className="mb-24">
        <h2 id="showcase-heading" className="sr-only">Component Showcase</h2>
        <ComponentShowcase
          title={component.title}
          description={component.description}
          tags={component.tags}
          cliCommand={component.cliCommand}
          codeSnippet={component.codeSnippet}
          usageCode={component.usageCode}
          aiPrompt={component.aiPrompt}
          componentPath={component.componentPath}
          scrollable={component.scrollable}
          component={ComponentToRender ? <ComponentToRender /> : <div>Component Not Found</div>}
        />
      </section>

      {relatedComponents.length > 0 && (
        <aside aria-labelledby="related-heading" className="border-t border-[#ff5c71]/10 pt-16">
          <h2 id="related-heading" className="text-3xl font-black uppercase tracking-tighter text-[#f4f4f4] mb-8"
            style={{ fontFamily: "var(--font-londrina-solid)" }}>
            More in {component.category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedComponents.map((related) => (
              <Link key={related.id} href={`/community/${related.slug}`} className="group block p-6 border border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#ff5c71]/50 transition-colors">
                <h3 className="text-xl font-bold uppercase text-[#e5e5e5] group-hover:text-[#ff5c71] mb-2" style={{ fontFamily: "var(--font-anton)" }}>{related.title}</h3>
                <p className="text-xs font-mono text-[#555] line-clamp-2">{related.description}</p>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </article>
  );
}
