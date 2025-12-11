"use client";

import { useMemo } from "react";

import { SceneKey, sceneSequence } from "@/animations/constants";
import { useExperienceStore } from "@/stores/useExperienceStore";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const useSectionProgress = (sceneKey: SceneKey) => {
  const globalProgress = useExperienceStore((state) => state.progress);
  const sectionProgress = useExperienceStore((state) => state.sectionProgress[sceneKey]);

  const smoothProgress = useMemo(() => {
    const index = sceneSequence.findIndex((scene) => scene.key === sceneKey);
    if (index === -1) {
      return 0;
    }

    if (typeof sectionProgress === "number") {
      return sectionProgress;
    }

    const total = sceneSequence.length - 1 || 1;
    const center = index / total;
    const radius = 1 / (sceneSequence.length * 1.2);
    return clamp(1 - Math.abs(globalProgress - center) / radius, 0, 1);
  }, [globalProgress, sceneKey, sectionProgress]);

  return smoothProgress;
};

export default useSectionProgress;


