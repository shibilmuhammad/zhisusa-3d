"use client";

import { Float } from "@react-three/drei";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { Color, Group } from "three";
import { useFrame } from "@react-three/fiber";

import { useSectionOpacity } from "@/components/3DScenes/hooks/useSectionOpacity";
import { useSectionProgress } from "@/components/3DScenes/hooks/useSectionProgress";
import { ModelAsset } from "@/components/3DScenes/models/ModelAsset";
import { SceneAssets } from "@/components/3DScenes/models/SceneAssets";
import { easeInOutQuad, easeOutCubic } from "@/animations/easings";

const DreiText = dynamic(async () => (await import("@react-three/drei")).Text, {
  ssr: false,
  loading: () => null
});

export const HeroScene = () => {
  const { opacity, visible } = useSectionOpacity("hero");
  const sectionProgress = useSectionProgress("hero");
  const [ready, setReady] = useState(false);

  const accent = useMemo(() => new Color("#92F0FF"), []);
  const tint = useMemo(() => new Color("#1b2d44"), []);
  const environmentRef = useRef<Group | null>(null);
  const cloudsRef = useRef<Group | null>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.04;
      cloudsRef.current.position.x = Math.sin(sectionProgress * Math.PI) * 0.6;
      cloudsRef.current.scale.setScalar(1 + easeOutCubic(1 - sectionProgress) * 0.18);
    }

    if (environmentRef.current) {
      const zoomOut = easeOutCubic(1 - sectionProgress);
      environmentRef.current.rotation.y = -0.22 + sectionProgress * 0.4;
      environmentRef.current.position.y = -1.6 - zoomOut * 0.6 + sectionProgress * 0.2;
      environmentRef.current.position.z = -1.8 - zoomOut * 1.2;
      environmentRef.current.scale.setScalar(3.4 * (1 + zoomOut * 0.35));
    }
  });

  return (
    <group visible={visible} name="HeroScene" position={[0, 0, 0]}>
      <group ref={cloudsRef} position={[0, 0.5, 0]}>
      <SceneAssets variant="heroTree" />
        {/* {[...Array(6)].map((_, index) => (
          <Float key={`cloud-${index}`} speed={0.4 + index * 0.05} floatIntensity={0.35}>
            <mesh
              position={[
                (index - 2.5) * 2.2,
                3 + Math.sin(index) * 0.3,
                -3 - (index % 2) * 1.5
              ]}
              scale={[1.4, 0.6, 0.6]}
            >
              <icosahedronGeometry args={[1, 1]} />
              <meshStandardMaterial transparent opacity={0.25 + opacity * 0.45} color="#D6F5FF" />
            </mesh>
          </Float>
        ))} */}
      </group>

      {/* <group ref={environmentRef}>
        <ModelAsset
          url="/models/hero-environment.glb"
          scale={[3.4, 3.4, 3.4]}
          position={[0, -1.6, -1.8]}
          rotation={[0, -0.15, 0]}
          fallback={
            <group position={[0, -1.2, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <circleGeometry args={[12, 64]} />
                <meshStandardMaterial color={tint.clone().lerp(accent, opacity * 0.2)} />
              </mesh>
              <mesh position={[0, 1.8, -2.5]} scale={[4.2, 2.4, 2.4]} castShadow>
                <coneGeometry args={[1, 1.8, 4]} />
                <meshStandardMaterial color={tint.clone().lerp(accent, 0.35 + opacity * 0.25)} />
              </mesh>
              <mesh position={[2, 1.2, -1.2]} scale={[2.6, 1.5, 2.6]} castShadow rotation={[0, 0.3, 0]}>
                <coneGeometry args={[1, 1.6, 5]} />
                <meshStandardMaterial color={tint.clone().lerp(accent, 0.3)} />
              </mesh>
              <mesh
                position={[-2.2, 1.4, -1.6]}
                scale={[2.8, 1.8, 2.8]}
                castShadow
                rotation={[0, -0.2, 0]}
              >
                <coneGeometry args={[1, 1.7, 5]} />
                <meshStandardMaterial color={tint.clone().lerp(accent, 0.28)} />
              </mesh>
            </group>
          }
        />
        <SceneAssets variant="heroTree" />
      </group> */}

      {/* {ready && (
        <Float speed={0.8} floatIntensity={0.35} rotationIntensity={0.4}>
          <DreiText
            position={[0, 2.6, 0]}
            maxWidth={6}
            letterSpacing={0.08}
            fontSize={0.8 + sectionProgress * 0.2}
            color={accent.clone().lerp(tint, easeInOutQuad(1 - sectionProgress))}
          >
            ZHISUSA
          </DreiText>
        </Float>
      )} */}

      {/* <Float speed={0.6} floatIntensity={0.25} rotationIntensity={0.1}>
        <mesh position={[0, 4.2, -1]} scale={[6, 1, 2]} rotation={[0.4, 0, 0]}>
          <torusGeometry args={[1, 0.08, 16, 64]} />
          <meshStandardMaterial
            color={accent.clone().lerp(new Color("#ffffff"), 0.35)}
            emissive={accent.clone().multiplyScalar(opacity * 0.8)}
            emissiveIntensity={0.45 + sectionProgress * 0.4}
          />
        </mesh>
      </Float> */}
    </group>
  );
};

