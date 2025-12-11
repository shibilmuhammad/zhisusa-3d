"use client";

import { RoundedBox } from "@react-three/drei";

import { useSectionOpacity } from "@/components/3DScenes/hooks/useSectionOpacity";
import { useSectionProgress } from "@/components/3DScenes/hooks/useSectionProgress";
import { sceneSequence } from "@/animations/constants";

const footerConfig = sceneSequence.find((scene) => scene.key === "footer")!;

export const FooterScene = () => {
  const { opacity, visible } = useSectionOpacity("footer");
  const progress = useSectionProgress("footer");

  return (
    <group visible={visible} name="FooterScene" position={[0, 0, 0]}>
      <RoundedBox
        args={[12, 7, 0.4]}
        radius={1}
        smoothness={6}
        position={[0, 1.6, -4]}
        scale={[1, 1, 1]}
      >
        <meshBasicMaterial color={footerConfig.backgroundColor} transparent opacity={0.92 * opacity} />
      </RoundedBox>

      <mesh position={[0, 1.3, -0.1]} rotation={[Math.PI / 2, progress * Math.PI * 0.15, 0]}>
        <ringGeometry args={[1.4, 1.8, 64]} />
        <meshBasicMaterial color={footerConfig.accentColor} transparent opacity={0.35 * opacity} />
      </mesh>

      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.6 + progress * 0.6, 32]} />
        <meshBasicMaterial color={footerConfig.accentColor} transparent opacity={0.25 * opacity} />
            </mesh>
    </group>
  );
};


