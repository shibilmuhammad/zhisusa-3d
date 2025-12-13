"use client";

import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, Group, Object3D, Mesh } from "three";

import { useSectionOpacity } from "@/components/3DScenes/hooks/useSectionOpacity";
import { useSectionProgress } from "@/components/3DScenes/hooks/useSectionProgress";
import { ModelAsset } from "@/components/3DScenes/models/ModelAsset";

export const LeisureScene = () => {
  const { opacity, visible } = useSectionOpacity("leisure");
  const sectionProgress = useSectionProgress("leisure");

  const water = useMemo(() => new Color("#00A4D6"), []);
  const fire = useMemo(() => new Color("#FF9966"), []);

  const lakeRef = useRef<Group | null>(null);
  const treesRef = useRef<Group | null>(null);
  const fireRef = useRef<Mesh | null>(null);

  useFrame((_, delta) => {
    const eased = Math.pow(sectionProgress, 1.2);
    if (lakeRef.current) {
      lakeRef.current.rotation.z = Math.sin(performance.now() * 0.0006) * 0.03;
      lakeRef.current.position.y = -0.18 + eased * 0.1;
    }
    if (treesRef.current) {
      treesRef.current.children.forEach((child, index) => {
        child.rotation.z = Math.sin(performance.now() * 0.0008 + index) * 0.05 * (0.6 + eased);
      });
    }
    if (fireRef.current) {
      const pulse = 0.4 + eased * 0.8 + Math.sin(performance.now() * 0.005) * 0.2;
      fireRef.current.scale.setScalar(0.9 + pulse * 0.4);
    }
  });

  return (
    <group visible={visible} name="LeisureScene">
      <group position={[0, -1.05, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[11, 64]} />
          <meshStandardMaterial color={water.clone().lerp(fire, 0.08)} />
        </mesh>
      </group>

      <ModelAsset
        ref={lakeRef}
        url="/models/leisure-lake.glb"
        position={[0, -0.3, 0]}
        scale={[1.8, 1.8, 1.8]}
        onReady={(root) => {
          const campfire = root.getObjectByName("Campfire");
          fireRef.current = (campfire && "isMesh" in campfire) ? campfire as Mesh : null;
          treesRef.current = root.getObjectByName("Trees") as Group | null;
        }}
        fallback={
          <group position={[0, -0.2, 0]}>
            <Float floatIntensity={0.12} rotationIntensity={0.1}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.5, 1.8, 32]} />
                <meshStandardMaterial
                  color="#92F0FF"
                  transparent
                  opacity={0.6 + opacity * 0.3}
                  emissive="#92F0FF"
                  emissiveIntensity={0.4 * opacity}
                />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <torusGeometry args={[0.2, 0.05, 16, 32]} />
                <meshStandardMaterial color="#ffffff" emissive="#fff1c4" emissiveIntensity={0.6} />
              </mesh>
            </Float>
          </group>
        }
      />

      <group ref={treesRef} position={[-3.6, 0, -1.8]}>
        {[...Array(5)].map((_, idx) => (
          <mesh
            key={`leisure-tree-${idx}`}
            position={[idx * 1.4, 0.6, (idx % 2) * 1.1]}
            scale={[0.4, 1 + idx * 0.2, 0.4]}
          >
            <coneGeometry args={[0.4, 1.4, 5]} />
            <meshStandardMaterial color="#00f5c8" />
          </mesh>
        ))}
      </group>

      <group position={[3, -0.1, 1.8]} rotation={[0, -0.6, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.6, 0.3, 1.6]} />
          <meshStandardMaterial color="#3a2a1d" />
        </mesh>
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
          <meshStandardMaterial color="#f4ddb1" />
        </mesh>
        <mesh position={[0, 0.58, 0]} castShadow ref={fireRef}>
          <sphereGeometry args={[0.24, 32, 32]} />
          <meshStandardMaterial
            color={fire}
            emissive={fire}
            emissiveIntensity={0.5 + opacity * 0.6 + sectionProgress * 0.8}
          />
        </mesh>
      </group>
    </group>
  );
};

