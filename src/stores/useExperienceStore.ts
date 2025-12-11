import { create } from "zustand";
import { SceneKey, sceneSequence } from "@/animations/constants";

interface ExperienceState {
  currentScene: SceneKey;
  progress: number;
  sectionProgress: Record<SceneKey, number>;
  setScene: (scene: SceneKey) => void;
  setProgress: (value: number) => void;
  setSectionProgressMap: (values: Partial<Record<SceneKey, number>>) => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  currentScene: sceneSequence[0].key,
  progress: 0,
  sectionProgress: sceneSequence.reduce(
    (acc, scene) => ({ ...acc, [scene.key]: scene.key === sceneSequence[0].key ? 1 : 0 }),
    {} as Record<SceneKey, number>
  ),
  setScene: (scene) => set({ currentScene: scene }),
  setProgress: (value) => set({ progress: value }),
  setSectionProgressMap: (values) =>
    set((state) => ({
      sectionProgress: { ...state.sectionProgress, ...values }
    }))
}));

