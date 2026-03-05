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
    cameraPosition: [11.21, 28.81, 28.29],
    cameraTarget: [23.00, 21.80, -25.00],
    cameraFov: 12.300,
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
    cameraPosition: [16.63, 30.18, 4.90],
    cameraTarget: [23.00, 21.80, -25.00],
    cameraFov: 12.300,
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
    cameraPosition: [52.22, 26.46, -7.64],
    cameraTarget: [52.10, 25.10, -11.70],
    cameraFov: 10.000,
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
    cameraPosition: [142.61, 54.35, -88.66],
    cameraTarget: [52.10, 4.80, -113.20],
    cameraFov: 10.000,
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
    cameraPosition: [50.98, 10.82, -59.10],
    cameraTarget: [52.10, 4.80, -113.20],
    cameraFov: 10.000,
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
    cameraPosition: [53.32, 12.49, -169.98],
    cameraTarget: [52.10, 4.80, -113.20],
    cameraFov: 10.000,
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
    cameraPosition: [95.30, 13.66, -222.13],
    cameraTarget: [52.10, 4.80, -113.20],
    cameraFov: 10.000,
    lightColor: "#9fe8ff",
    fogColor: "#091323",
    fogNear: 12,
    fogFar: 46,
    environmentPreset: "park",
    environmentIntensity: 0.7,
    bloomIntensity: 0.68
  }
];

