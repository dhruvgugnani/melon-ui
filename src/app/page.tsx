import { LoadingScreen } from "@/components/overlay/LoadingScreen";
import { ClientScene } from "@/components/scene/ClientScene";
import { ClientOverlay } from "@/components/overlay/ClientOverlay";

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      <LoadingScreen />
      <ClientScene />
      <ClientOverlay />
    </main>
  );
}
