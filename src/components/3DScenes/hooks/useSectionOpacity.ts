"use client";

import { useMemo } from "react";

import { SceneKey, sceneSequence } from "@/animations/constants";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { useSectionProgress } from "./useSectionProgress";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const useSectionOpacity = (sceneKey: SceneKey, fadeRadius = 0.16) => {
  const progress = useExperienceStore((state) => state.progress);
  const sectionProgress = useSectionProgress(sceneKey);

  return useMemo(() => {
    if (sectionProgress !== undefined) {
      const eased = Math.pow(clamp(sectionProgress, 0, 1), 1.2);
      return {
        opacity: eased,
        visible: eased > 0.05
      };
    }

    const index = sceneSequence.findIndex((scene) => scene.key === sceneKey);
    if (index === -1) {
      return { opacity: 0, visible: false };
    }

    const total = sceneSequence.length - 1 || 1;
    const center = index / total;
    const distance = Math.abs(progress - center);
    const opacity = clamp(1 - distance / fadeRadius, 0, 1) ** 1.2;

    return {
      opacity,
      visible: opacity > 0.05
    };
  }, [progress, sceneKey, fadeRadius, sectionProgress]);
};

