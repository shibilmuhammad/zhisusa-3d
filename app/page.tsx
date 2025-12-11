"use client";

import { SceneRoot } from "@/components/3DScenes/SceneRoot";
import { Header } from "@/components/ui/Header";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { sceneSequence } from "@/animations/constants";

export default function Home() {
  return (
    <main className="page">
      <Header />
      <SceneRoot />
      <ProgressIndicator />
      <ScrollToTop />
      
      {/* Mobile-only scroll snap sections */}
      <div className="mobile-sections">
        {sceneSequence.map((scene) => (
          <section
            key={scene.key}
            className="scene-section"
            data-scene-key={scene.key}
            id={`section-${scene.key}`}
          />
        ))}
      </div>
    </main>
  );
}

