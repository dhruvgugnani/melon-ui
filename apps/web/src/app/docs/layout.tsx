import { DocsLayout } from "@/components/layout/DocsLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs | MelonUI",
  description: "Learn how to configure your project and install the necessary dependencies for MelonUI.",
  openGraph: {
    title: "Docs | MelonUI",
    description: "Learn how to configure your project and install the necessary dependencies for MelonUI.",
    images: [{ url: "/api/og?title=Docs&category=MelonUI%20Documentation" }],
  },
  alternates: {
    canonical: "/docs",
  },
};

export default function DocsLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsLayout>{children}</DocsLayout>;
}
