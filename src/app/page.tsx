import { SmoothScroll } from "@/components/SmoothScroll";
import { LoadingScreen } from "@/components/overlay/LoadingScreen";
import { ClientScene } from "@/components/scene/ClientScene";
import { ClientOverlay } from "@/components/overlay/ClientOverlay";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="relative w-full bg-black min-h-screen">
        <LoadingScreen />
        <ClientScene />
        <ClientOverlay />
      </main>
    </SmoothScroll>
  );
}
