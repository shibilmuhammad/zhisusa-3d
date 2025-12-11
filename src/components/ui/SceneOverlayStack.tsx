"use client";

import { CSSProperties, useEffect, useRef } from "react";

import { sceneSequence, SceneKey } from "@/animations/constants";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { BookingCard } from "./booking/BookingCard";
import { GalleryCarouselHint } from "./gallery/GalleryCarouselHint";
import { debugNavigationSetup } from "@/utils/navigation";

export const SceneOverlayStack = () => {
  const currentScene = useExperienceStore((state) => state.currentScene);
  const sectionProgress = useExperienceStore((state) => state.sectionProgress);
  const setScene = useExperienceStore((state) => state.setScene);
  const setSectionProgressMap = useExperienceStore((state) => state.setSectionProgressMap);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Initialize observer once
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px", // Trigger when section is centered in viewport
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      let mostVisibleEntry: IntersectionObserverEntry | null = null;
      let maxRatio = 0;
      let currentSceneEntry: IntersectionObserverEntry | null = null;

      entries.forEach((entry) => {
        // Support both overlay cards (data-scene-key) and mobile sections (id="section-{key}")
        let sceneKey = entry.target.getAttribute("data-scene-key") as SceneKey;
        if (!sceneKey) {
          const id = entry.target.id;
          if (id && id.startsWith("section-")) {
            sceneKey = id.replace("section-", "") as SceneKey;
          }
        }
        if (!sceneKey) return;

        // Update section progress based on intersection ratio
        const progress = entry.isIntersecting ? entry.intersectionRatio : 0;
        setSectionProgressMap({ [sceneKey]: progress });

        // Track current scene entry if present
        if (sceneKey === currentScene) {
          currentSceneEntry = entry;
        }

        // Track the most visible section
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisibleEntry = entry;
        }
      });

      // Keep current scene active as long as it's still visible at all
      const currentRatio = currentSceneEntry ? (currentSceneEntry as any).intersectionRatio : 0;
      if (currentRatio > 0) {
        return;
      }

      // Otherwise, set the most visible section as active
      if (mostVisibleEntry && maxRatio > 0) {
        const targetEl = (mostVisibleEntry as any).target as HTMLElement;
        let sceneKey = targetEl.getAttribute("data-scene-key") as SceneKey;
        if (!sceneKey) {
          const id = targetEl.id;
          if (id && id.startsWith("section-")) {
            sceneKey = id.replace("section-", "") as SceneKey;
          }
        }
        if (sceneKey) {
          setScene(sceneKey);
          console.log("Section in view:", sceneKey, "Ratio:", maxRatio.toFixed(2));
        }
      }
    };

    observerRef.current = new IntersectionObserver(observerCallback, observerOptions);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [setScene, setSectionProgressMap]);

  // Observe sections as they mount
  useEffect(() => {
    const observer = observerRef.current;
    if (!observer) return;

    // Observe all current overlay card sections
    sectionRefs.current.forEach((section) => {
      observer.observe(section);
    });

    // Also observe mobile sections if they exist
    const mobileSections = document.querySelectorAll('.scene-section');
    mobileSections.forEach((section) => {
      observer.observe(section);
    });

    // Cleanup function to unobserve on unmount
    return () => {
      sectionRefs.current.forEach((section) => {
        observer.unobserve(section);
      });
      mobileSections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  });

  // Debug: Run navigation setup check when page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      debugNavigationSetup();
    }, 1500); // Wait 1.5 seconds for everything to render

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="overlay-stack">
      {sceneSequence.map((scene) => {
        const isActive = scene.key === currentScene;
        const progress = sectionProgress[scene.key] ?? 0;

        return (
          <article
            key={scene.key}
            ref={(el) => {
              if (el) sectionRefs.current.set(scene.key, el);
            }}
            data-scene-key={scene.key}
            className={`overlay-card ${isActive ? "overlay-card--active" : ""}`}
            style={{ "--overlay-progress": progress } as CSSProperties}
          >
            <div className="overlay-card__label">{scene.label}</div>
            <div className="overlay-card__progress">
              <span style={{ transform: `scaleX(${Math.max(0.08, progress)})` }} />
            </div>
            <h2 className="overlay-card__title">
              {scene.key === "hero" && "Beyond Retreat — Enter the ZHISUSA Realm"}
              {scene.key === "live" && "Experience Premium Living"}
              {scene.key === "work" && "Inspired Work Sanctuaries"}
              {scene.key === "leisure" && "Reignite Your Leisure"}
              {scene.key === "booking" && "Reserve Your Stay"}
              {scene.key === "gallery" && "Immersive Gallery Moments"}
              {scene.key === "footer" && "Visit ZHISUSA"}
            </h2>
            <p className="overlay-card__body">
              {scene.key === "hero" &&
                "A cinematic welcome blending mountains, ocean breeze, and luminous calm. Scroll to journey through the experiences that define our luxury nature stay."}
              {scene.key === "live" &&
                "Private villas and eco-tents designed for comfort and clarity. Light spills through bespoke architecture that harmonises with the landscape."}
              {scene.key === "work" &&
                "Glasshouse workspaces framed by nature. Strategise, collaborate, and create with serene focus and adaptive lighting."}
              {scene.key === "leisure" &&
                "Lakeside rituals, campfire gatherings, and reflective lawns. Every detail invites slow living."}
              {scene.key === "booking" &&
                "Choose your arrival, define your ritual, and secure a bespoke itinerary that flows with your rhythms."}
              {scene.key === "gallery" &&
                "Slide through curated memories. Each frame captures the glow of ZHISUSA at different hours of the day."}
              {scene.key === "footer" &&
                "Plot your path to the retreat — tap the beacon and follow the illuminated trail into the valley."}
            </p>

            {scene.key === "booking" && <BookingCard highlight={isActive} />}
            {scene.key === "gallery" && <GalleryCarouselHint active={isActive} />}
          </article>
        );
      })}
    </div>
  );
};

