"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import { useProgress } from "@react-three/drei";

import { sceneSequence, SceneKey } from "@/animations/constants";
import { SceneOverlayStack } from "@/components/ui/SceneOverlayStack";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

const Experience = dynamic(() => import("./Experience"), { ssr: false });

// Component to track loading progress inside Canvas and expose it
const LoadingTracker = ({ onProgress }: { onProgress: (progress: number, active: boolean) => void }) => {
  const { progress, active } = useProgress();

  useEffect(() => {
    onProgress(progress, active);
  }, [progress, active, onProgress]);

  return null;
};

export const SceneRoot = () => {
  const scrollPages = useMemo(() => Math.max(1, sceneSequence.length), []);
  const containerRef = useRef<HTMLDivElement>(null);
  const setProgress = useExperienceStore((state) => state.setProgress);
  const setScene = useExperienceStore((state) => state.setScene);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingProgress = (progress: number, active: boolean) => {
    setLoadingProgress(progress);
    setIsLoading(active);
  };

  // Mobile scroll snap handler - detects which section is in view
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    const handleMobileScroll = () => {
      const sections = document.querySelectorAll('.scene-section');
      const viewportCenter = window.innerHeight / 2;
      let activeSection: Element | null = null;
      let minDistance = Infinity;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);

        if (distance < minDistance && rect.top < viewportCenter && rect.bottom > viewportCenter) {
          minDistance = distance;
          activeSection = section;
        }
      });

      if (activeSection) {
        const sectionElement = activeSection as HTMLElement;
        if (sectionElement.id) {
          const sceneKey = sectionElement.id.replace('section-', '') as SceneKey;
        if (sceneKey) {
          setScene(sceneKey);
          
          // Update progress based on scroll position
          const totalSections = sections.length;
          const currentIndex = Array.from(sections).indexOf(activeSection);
          const progress = currentIndex / (totalSections - 1 || 1);
          setProgress(progress);
        }
        }
      }
    };

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleMobileScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    handleMobileScroll(); // Initial call

    return () => window.removeEventListener("scroll", throttledScroll);
  }, [setScene, setProgress]);

  // Desktop scroll handler for performance
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    let ticking = false;
    
    const handleScroll = () => {
      if (!containerRef.current || ticking) return;
      
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const scrollHeight = containerRef.current!.scrollHeight - window.innerHeight;
        const progress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
        setProgress(progress);
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [setProgress]);

  const containerHeight = scrollPages * 100;
  
  // Limit DPR to 1.5 max for performance
  const dpr = typeof window !== "undefined" 
    ? Math.min(window.devicePixelRatio, 1.5) 
    : 1;

  // On mobile, don't set height (CSS handles it with fixed positioning)
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const containerStyle = isMobile 
    ? {} 
    : { 
        height: `${containerHeight}vh`, 
        minHeight: `${containerHeight}vh`,
      };

  return (
    <section
      ref={containerRef}
      className="experience-container"
      style={containerStyle}
    >
      {/* Left side: Text overlays */}
      <div className="text-overlay-container">
        <SceneOverlayStack />
      </div>

      {/* Right side: Spacer for scrolling */}
      <div className="canvas-panel-spacer" />

      {/* Fixed curved panel with 3D */}
      <div className="canvas-panel">
        <Canvas
          shadows
          frameloop="always"
          dpr={[1, dpr]}
          performance={{ min: 0.5 }}
          camera={{ position: [0, 2, 8], fov: 60, near: 0.1, far: 1000 }}
          gl={{ 
            antialias: false,
            alpha: false, 
            powerPreference: "high-performance",
            toneMapping: ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            outputColorSpace: SRGBColorSpace,
            preserveDrawingBuffer: false,
          }}
          style={{ pointerEvents: 'auto' }}
        >
          <color attach="background" args={['#0a1929']} />
          {/* Loading tracker inside Canvas to access useProgress */}
          <LoadingTracker onProgress={handleLoadingProgress} />
          {/* Wrap ENTIRE scene in Suspense so useProgress can track loading */}
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>
      </div>
      
      {/* External Loading Screen - Shows until all assets are loaded */}
      <LoadingScreen progress={loadingProgress} active={isLoading} />
    </section>
  );
};

export default SceneRoot;
