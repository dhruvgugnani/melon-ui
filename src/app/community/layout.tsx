import { Sidebar } from "@/components/community/Sidebar";
import { SmoothScrollLayout } from "@/components/community/SmoothScrollLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Store | MelonUI",
  description: "Hand-crafted, GSAP-powered, Three.js-infused components. Copy. Paste. Ship.",
  openGraph: {
    title: "Community Store | MelonUI",
    description: "Hand-crafted, GSAP-powered, Three.js-infused components. Copy. Paste. Ship.",
    images: [{ url: "/api/og?title=Community%20Store&category=MelonUI%20Components" }],
  },
  alternates: {
    canonical: "/community",
  },
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#050505]">
      <Sidebar />
      <main className="flex-1 overflow-hidden relative">
        <SmoothScrollLayout>
          {children}
        </SmoothScrollLayout>
      </main>
    </div>
  );
}
