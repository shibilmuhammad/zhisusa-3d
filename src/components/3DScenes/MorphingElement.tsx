"use client";

import { useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { Group, Color, TextureLoader } from "three";
import { RoundedBox, useGLTF } from "@react-three/drei";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { sceneSequence } from "@/animations/constants";

/* -------------------------------- TYPES -------------------------------- */

type Vec3 = [number, number, number];

type Model3DProps = {
  url: string;
  position?: Vec3;
  rotation?: Vec3;
  scale?: number;
};

type PhotoCardProps = {
  position?: Vec3;
  rotation?: Vec3;
  scale?: number;
  imageUrl: string;
  aspectRatio?: number;
  title?: string;
};

/* ------------------------------- HELPERS -------------------------------- */

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* ----------------------------- MODEL LOADER ----------------------------- */

const Model3D = ({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: Model3DProps) => {
  const { scene } = useGLTF(url);

  return (
    <primitive
      object={scene}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    />
  );
};

/* ------------------------------ PHOTO CARD ------------------------------ */

const PhotoCard = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  imageUrl,
  aspectRatio = 1.5,
}: PhotoCardProps) => {
  const groupRef = useRef<Group>(null);

  const texture = useMemo(
    () => new TextureLoader().load(imageUrl),
    [imageUrl]
  );

  const gradientColor = useMemo(() => {
    const hash = imageUrl
      .split("")
      .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
    return `hsl(${Math.abs(hash) % 360}, 85%, 65%)`;
  }, [imageUrl]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    groupRef.current.position.y =
      position[1] + Math.sin(t * 0.6 + position[0]) * 0.05;
    groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.02;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Glass frame */}
      <RoundedBox args={[aspectRatio, 1, 0.12]} radius={0.05}>
        <meshPhysicalMaterial
          transparent
          transmission={0.95}
          roughness={0.05}
          thickness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </RoundedBox>

      {/* Image */}
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[aspectRatio * 0.9, 0.9]} />
        <meshStandardMaterial
          map={texture}
          emissive={new Color(gradientColor)}
          emissiveIntensity={0.15}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

/* --------------------------- MAIN COMPONENT ----------------------------- */

export const MorphingElement = () => {
  const groupRef = useRef<Group>(null);

  const currentScene = useExperienceStore((s) => s.currentScene);
  const progress = useExperienceStore((s) => s.progress);

  const activeConfig = useMemo(
    () => sceneSequence.find((s) => s.key === currentScene) ?? sceneSequence[0],
    [currentScene]
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const eased = easeInOutCubic(progress);

    groupRef.current.rotation.y +=
      (eased * Math.PI * 2 - groupRef.current.rotation.y) * delta * 2;

    const pulse = 1 + Math.sin(Date.now() * 0.001) * 0.02;
    groupRef.current.scale.lerp(
      { x: pulse, y: pulse, z: pulse } as any,
      delta * 2
    );
  });

  const renderGeometry = () => {
    switch (activeConfig.key) {
      case "hero":
        return (
          <>
            <Suspense fallback={null}>
              <Model3D
                url="/models/low_poly_tree_scene_free.glb"
                position={[0, -2, 0]}
                scale={0.8}
              />
            </Suspense>

            <PhotoCard
              position={[-1.8, 0.8, 0.3]}
              rotation={[0.1, 0.25, -0.05]}
              scale={0.6}
              imageUrl="https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
            />
            <PhotoCard
              position={[1.7, -0.7, 0.25]}
              rotation={[-0.05, -0.25, 0.04]}
              scale={0.55}
              imageUrl="https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
            />
          </>
        );

      case "live":
        return (
          <PhotoCard
            scale={1.4}
            imageUrl="https://images.unsplash.com/photo-1518780664697-55e3ad937233"
          />
        );

      case "work":
        return (
          <PhotoCard
            scale={1.4}
            imageUrl="https://images.unsplash.com/photo-1497366754035-f200968a6e72"
          />
        );

      case "leisure":
        return (
          <PhotoCard
            scale={1.4}
            imageUrl="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d"
          />
        );

      case "gallery":
        return (
          <PhotoCard
            scale={1.4}
            imageUrl="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a"
          />
        );

      case "footer":
        return (
          <PhotoCard
            scale={1.5}
            imageUrl="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"
          />
        );

      default:
        return null;
    }
  };

  return (
    <group ref={groupRef} key={`morph-${activeConfig.key}`}>
      {renderGeometry()}
    </group>
  );
};
