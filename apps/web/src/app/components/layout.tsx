import { DocsLayout } from "@/components/layout/DocsLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "React Components & Web UI Components Library | MelonUI",
  description: "Browse our collection of beautifully animated React components, UI components, and web components styled with Tailwind CSS. Perfect for building interactive user interfaces with GSAP & Framer Motion.",
  openGraph: {
    title: "React Components & Web UI Components Library | MelonUI",
    description: "Browse our collection of beautifully animated React components, UI components, and web components styled with Tailwind CSS.",
    images: [{ url: "/api/og?title=React%20Components%20Library&category=MelonUI%20Components" }],
  },
  alternates: {
    canonical: "/components",
  },
};

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsLayout>{children}</DocsLayout>;
}
