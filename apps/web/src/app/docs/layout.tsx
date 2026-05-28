import { DocsLayout } from "@/components/layout/DocsLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation & Installation Guides | MelonUI Components",
  description: "Learn how to configure your React, Next.js, and Tailwind CSS development workspace for MelonUI. Install visually stunning components via CLI or manual copy-paste guides.",
  openGraph: {
    title: "Documentation & Installation Guides | MelonUI Components",
    description: "Learn how to configure your React, Next.js, and Tailwind CSS development workspace for MelonUI.",
    images: [{ url: "/api/og?title=Docs%20and%20Setup&category=MelonUI%20Documentation" }],
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
