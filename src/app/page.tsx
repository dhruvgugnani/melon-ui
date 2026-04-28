import { Scene } from "@/components/scene/Scene";
import { Overlay } from "@/components/overlay/Overlay";
import { SmoothScroll } from "@/components/SmoothScroll";
import { LoadingScreen } from "@/components/overlay/LoadingScreen";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="relative w-full bg-black min-h-screen">
        <LoadingScreen />
        <Scene />
        <Overlay />
      </main>
    </SmoothScroll>
  );
}
