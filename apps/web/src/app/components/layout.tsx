import { DocsLayout } from "@/components/layout/DocsLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Components | MelonUI",
  description: "Hand-crafted, GSAP-powered, Three.js-infused components. Copy. Paste. Ship.",
  openGraph: {
    title: "Components | MelonUI",
    description: "Hand-crafted, GSAP-powered, Three.js-infused components. Copy. Paste. Ship.",
    images: [{ url: "/api/og?title=Components&category=MelonUI%20Components" }],
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
