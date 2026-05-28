import { LoadingScreen } from "@/components/overlay/LoadingScreen";
import { ClientScene } from "@/components/scene/ClientScene";
import { ClientOverlay } from "@/components/overlay/ClientOverlay";

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-black text-white">
      <LoadingScreen />
      <ClientScene />
      <ClientOverlay />
    </main>
  );
}
