"use client";

import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, Group, Object3D } from "three";

import { useSectionOpacity } from "@/components/3DScenes/hooks/useSectionOpacity";
import { useSectionProgress } from "@/components/3DScenes/hooks/useSectionProgress";
import { ModelAsset } from "@/components/3DScenes/models/ModelAsset";

export const LiveScene = () => {
  const { opacity, visible } = useSectionOpacity("live");
  const sectionProgress = useSectionProgress("live");

  const accentOpacity = useMemo(() => 0.4 + progress * 0.4, [progress]);

  return (
    <group visible={visible} name="LiveScene" position={[0, 0, 0]}>
      <group position={[0, -0.9, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[10, 48]} />
          <meshStandardMaterial color={fill.clone().lerp(accent, opacity * 0.06)} />
        </mesh>
      </group>

      <ModelAsset
        ref={villaRef}
        url="/models/live-villa.glb"
        position={[0, -0.2, 0]}
        scale={[1.5, 1.5, 1.5]}
        rotation={[0, Math.PI / 8, 0]}
        onReady={(root) => {
          doorRef.current = root.getObjectByName("Door") ?? null;
          lightRef.current = root.getObjectByName("InteriorLight") ?? null;
        }}
        fallback={
          <group position={[0, 0.2, 0]} scale={[1.4, 1.4, 1.4]}>
            <mesh castShadow position={[0, 0.8, 0]}>
              <boxGeometry args={[2.6, 1.6, 2]} />
              <meshStandardMaterial
                color={fill.clone().lerp(accent, 0.25)}
                roughness={0.35}
                metalness={0.05}
              />
            </mesh>
            <mesh castShadow position={[0, 1.9, 0]}>
              <coneGeometry args={[1.6, 1.2, 6]} />
              <meshStandardMaterial color={fill.clone().lerp(accent, 0.5)} />
            </mesh>
            <mesh castShadow position={[0, 2.15, 0]}>
              <boxGeometry args={[0.8, 0.32, 0.12]} />
              <meshStandardMaterial color="#ffffff" emissive="#FFD7A3" emissiveIntensity={opacity} />
            </mesh>
            <mesh position={[0, 0.05, -0.98]}>
              <planeGeometry args={[2.6, 1.8]} />
              <meshStandardMaterial color="#63442d" roughness={1} />
            </mesh>
          </group>
        }
      />

      <Float floatIntensity={0.2} rotationIntensity={0.15}>
        <mesh position={[0, 1.4, 1.1]}>
          <planeGeometry args={[1.6, 0.9]} />
          <meshStandardMaterial
            transparent
            opacity={0.4 + opacity * 0.4}
            color={accent.clone().lerp(fill, 0.3)}
          />
        </mesh>
      </Float>

      <group position={[-2.6, 0.3, -1.8]}>
        {[...Array(4)].map((_, idx) => (
          <mesh key={`live-tree-${idx}`} position={[idx * 1.4, 0, -idx * 0.6]} scale={[0.6, 1.8, 0.6]}>
            <coneGeometry args={[0.7, 1.6, 5]} />
            <meshStandardMaterial color={accent.clone().lerp(fill, 0.25)} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

