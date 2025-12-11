"use client";

import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group } from "three";

import { useSectionOpacity } from "@/components/3DScenes/hooks/useSectionOpacity";
import { useSectionProgress } from "@/components/3DScenes/hooks/useSectionProgress";
import { ModelAsset } from "@/components/3DScenes/models/ModelAsset";

const framePositions = [
  { position: [-2.8, 1.4, -2], rotation: [0, 0.4, 0] },
  { position: [0, 1.2, -2.4], rotation: [0, 0, 0] },
  { position: [2.8, 1.4, -2], rotation: [0, -0.4, 0] },
  { position: [-1.4, 1, 2], rotation: [0, 1.2, 0] },
  { position: [1.8, 1.6, 2.2], rotation: [0, -1, 0] }
] as const;

export const GalleryScene = () => {
  const { opacity, visible } = useSectionOpacity("gallery");
  const sectionProgress = useSectionProgress("gallery");
  const groupRef = useRef<Group | null>(null);

  const parallax = useMemo(
    () => framePositions.map((_, idx) => (idx - (framePositions.length - 1) / 2) * 0.5),
    []
  );

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, idx) => {
      child.position.x =
        (framePositions[idx].position[0] ?? 0) + parallax[idx] * Math.sin(sectionProgress * Math.PI);
    });
  });

  return (
    <group visible={visible} name="GalleryScene" ref={groupRef}>
      {framePositions.map((frame, index) => (
        <Float key={`gallery-frame-${index}`} speed={0.8 + index * 0.03} rotationIntensity={0.1}>
          <ModelAsset
            url="/models/gallery-frame.glb"
            position={frame.position as [number, number, number]}
            rotation={frame.rotation as [number, number, number]}
            scale={[1, 1, 1]}
            fallback={
              <group>
                <mesh castShadow>
                  <boxGeometry args={[1.4, 1.8, 0.08]} />
                  <meshStandardMaterial color="#0A1A2F" />
                </mesh>
                <mesh position={[0, 0, 0.05]}>
                  <planeGeometry args={[1.2, 1.6]} />
                  <meshStandardMaterial
                    color="#92F0FF"
                    transparent
                    opacity={0.35 + opacity * 0.45}
                    emissive="#92F0FF"
                    emissiveIntensity={0.2 + opacity * 0.4}
                  />
                </mesh>
              </group>
            }
          />
        </Float>
      ))}
    </group>
  );
};

