"use client";

import { motion } from "framer-motion";

import { sceneSequence, SceneKey } from "@/animations/constants";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { scrollToSection } from "@/utils/navigation";

export const ProgressIndicator = () => {
  const progress = useExperienceStore((state) => state.progress);
  const currentScene = useExperienceStore((state) => state.currentScene);
  const sectionProgress = useExperienceStore((state) => state.sectionProgress);

  return (
    <div className="experience-progress">
      <div className="experience-progress__rail">
        <motion.div
          className="experience-progress__active"
          style={{ height: `${Math.round(progress * 100)}%` }}
        />
      </div>
      <div className="experience-progress__labels">
        {sceneSequence.map((scene) => (
          <button
            key={scene.key}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Sidebar button clicked:", scene.key);
              scrollToSection(scene.key);
            }}
            className={`experience-progress__label ${
              currentScene === scene.key ? "is-active" : ""
            }`}
            aria-label={`Go to ${scene.label} section`}
            style={{ pointerEvents: 'auto', zIndex: 100 }}
          >
            <motion.span
              className="experience-progress__pulse"
              animate={{
                scale: 0.8 + (sectionProgress[scene.key] ?? 0) * 0.6,
                opacity: 0.3 + (sectionProgress[scene.key] ?? 0) * 0.7
              }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            />
            <span>{scene.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;

