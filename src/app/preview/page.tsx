import { LoadingScreen } from "@/components/overlay/LoadingScreen";
import { ClientScene } from "@/components/scene/ClientScene";
import { ClientOverlay } from "@/components/overlay/ClientOverlay";

export default function PreviewPage() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-black">
      <LoadingScreen />
      <ClientScene />
      <ClientOverlay />
    </main>
  );
}
