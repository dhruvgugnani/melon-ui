import { Sidebar } from "@/components/community/Sidebar";
import { SmoothScrollLayout } from "@/components/community/SmoothScrollLayout";

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
