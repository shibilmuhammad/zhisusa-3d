"use client";

import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { useMemo, useRef } from "react";

import { SceneKey, sceneSequence } from "@/animations/constants";
import { useExperienceStore } from "@/stores/useExperienceStore";

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

export const ScrollSync = () => {
  const data = useScroll();
  const setScene = useExperienceStore((state) => state.setScene);
  const setProgress = useExperienceStore((state) => state.setProgress);
  const setSectionProgressMap = useExperienceStore((state) => state.setSectionProgressMap);
  
  // Throttle updates for performance
  const lastUpdateRef = useRef(0);
  const throttleMs = 16; // ~60fps

  const totalScenes = useMemo(() => sceneSequence.length, []);
  const window = useMemo(() => 1 / totalScenes, [totalScenes]);

  useFrame(() => {
    if (!data) return;
    
    // Throttle updates
    const now = performance.now();
    if (now - lastUpdateRef.current < throttleMs) return;
    lastUpdateRef.current = now;

    const progress = clamp(data.offset, 0, 1);
    setProgress(progress);

    const progressMap = sceneSequence.reduce<Record<SceneKey, number>>((acc, scene, index) => {
      const center = index / (totalScenes - 1 || 1);
      const start = clamp(center - window, 0, 1);
      const end = clamp(center + window, 0, 1);
      const local = clamp((progress - start) / Math.max(end - start, 0.0001), 0, 1);
      acc[scene.key] = local;
      return acc;
    }, {} as Record<SceneKey, number>);

    setSectionProgressMap(progressMap);

    const activeIndex = Math.min(
      totalScenes - 1,
      Math.round(progress * (totalScenes - 1))
    );
    const nextScene = sceneSequence[activeIndex]?.key ?? sceneSequence[0].key;
    setScene(nextScene as SceneKey);
  });

  return null;
};
