import { ClientScene } from "@/components/scene/ClientScene";
import { ClientOverlay } from "@/components/overlay/ClientOverlay";
import { LoadingScreen } from "@/components/overlay/LoadingScreen";

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-black text-white">
      <ClientScene />
      <LoadingScreen />
      <ClientOverlay />
    </main>
  );
}
