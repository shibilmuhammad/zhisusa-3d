import { Vector3Tuple } from "three";

export type SceneKey = "hero" | "live" | "work" | "leisure" | "booking" | "gallery" | "footer";

export interface SceneConfig {
  key: SceneKey;
  label: string;
  cameraPosition: Vector3Tuple;
  cameraTarget: Vector3Tuple;
  lightColor: string;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  environmentPreset: "sunset" | "dawn" | "night" | "forest" | "studio" | "city" | "park";
  environmentIntensity: number;
  bloomIntensity: number;
  // Camera animation properties
  cameraFov?: number;
  cameraZoom?: number;
  modelRotation?: Vector3Tuple;
  modelScale?: number;
  accentColor?: string;
  backgroundColor?: string;
}

export const sceneSequence: SceneConfig[] = [
  {
    key: "hero",
    label: "Welcome",
    // Very zoomed out to show entire frame initially
    cameraPosition: [0, 8, 25],
    cameraTarget: [0, 1.5, 0],
    cameraFov: 60,
    lightColor: "#88c9ff",
    fogColor: "#0a1a2f",
    fogNear: 10,
    fogFar: 38,
    environmentPreset: "dawn",
    environmentIntensity: 0.5,
    bloomIntensity: 0.65
  },
  {
    key: "live",
    label: "Live",
    // Focus on house - camera positioned to show house clearly, shifted to show house more on right side
    // Work plot is at [-5, 0, -3] (left side, behind house)
    // Fire is at [3, -0.1, 1.8] (right side, front) - opposite sides
    // House is at [0, 0, 0] (center), front faces positive Z direction
    // Rotate house to left (negative Y rotation) so front faces viewport
    // Camera positioned to focus on house center, excluding work plot and fire from view
    cameraPosition: [-6, 3, 5],
    cameraTarget: [-0.5, 1.5, 0],
    cameraFov: 55,
    cameraZoom: 1,
    modelRotation: [0, -Math.PI * 0.3, 0],
    modelScale: 0.8,
    lightColor: "#ffe0b2",
    fogColor: "#13233a",
    fogNear: 15,
    fogFar: 50,
    environmentPreset: "forest",
    environmentIntensity: 0.75,
    bloomIntensity: 0.55
  },
  {
    key: "work",
    label: "Work",
    // Show table and laptop - OutdoorWorkspace at [-5, 0, -3] (left side, behind house)
    // Fire is at [3, -0.1, 1.8] (right side, front) - opposite sides of house
    // Table is at [0, 0.15, 0] relative to workspace, laptop at [0, 1, 0] relative to table
    // Absolute position: [-5, 0, -3] + [0, 0.15, 0] + [0, 1, 0] = [-5, 1.15, -3]
    // Camera positioned further back and shifted to show more on right side (left side reserved for text overlay)
    cameraPosition: [-9, 1.6, 0.5],
    cameraTarget: [-5.5, 1.15, -3],
    cameraFov: 65,
    cameraZoom: 1,
    modelRotation: [0, Math.PI * 0.35, 0],
    modelScale: 0.8,
    lightColor: "#cbd8ff",
    fogColor: "#0f1a28",
    fogNear: 8,
    fogFar: 30,
    environmentPreset: "studio",
    environmentIntensity: 0.85,
    bloomIntensity: 0.48
  },
  {
    key: "leisure",
    label: "Leisure",
    // Show campfire - campfire is at [3, -0.1, 1.8] (right side of house at [0, 0, 0]) with fire at [0, 0.58, 0] relative
    // Camera positioned to show more on right side (left side reserved for text overlay)
    cameraPosition: [2.5, 0.9, 3.5],
    cameraTarget: [3, 0.48, 1.8],
    cameraFov: 60,
    lightColor: "#ffd9a6",
    fogColor: "#182226",
    fogNear: 11,
    fogFar: 40,
    environmentPreset: "sunset",
    environmentIntensity: 0.7,
    bloomIntensity: 0.72
  },
  {
    key: "booking",
    label: "Booking",
    cameraPosition: [0, 2.1, 6.5],
    cameraTarget: [0, 1.4, 0],
    lightColor: "#b5f5ff",
    fogColor: "#11202c",
    fogNear: 12,
    fogFar: 42,
    environmentPreset: "city",
    environmentIntensity: 0.6,
    bloomIntensity: 0.58
  },
  {
    key: "gallery",
    label: "Gallery",
    cameraPosition: [-1.6, 2.9, 8.4],
    cameraTarget: [-0.2, 1.5, 0],
    lightColor: "#a8c8ff",
    fogColor: "#101c2a",
    fogNear: 9,
    fogFar: 38,
    environmentPreset: "night",
    environmentIntensity: 0.65,
    bloomIntensity: 0.62
  },
  {
    key: "footer",
    label: "Visit",
    // Zoomed out view to show everything
    cameraPosition: [0, 8, 20],
    cameraTarget: [0, 1.5, 0],
    cameraFov: 70,
    lightColor: "#9fe8ff",
    fogColor: "#091323",
    fogNear: 12,
    fogFar: 46,
    environmentPreset: "park",
    environmentIntensity: 0.7,
    bloomIntensity: 0.68
  }
];

