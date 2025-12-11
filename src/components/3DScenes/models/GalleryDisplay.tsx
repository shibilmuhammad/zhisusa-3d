"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useExperienceStore } from "@/stores/useExperienceStore";

export const GalleryDisplay = () => {
  const galleryRef = useRef<THREE.Group>(null);
  const currentScene = useExperienceStore((state) => state.currentScene);
  
  // Show in hero (small), booking (small), and gallery (normal, camera zooms)
  if (currentScene !== "hero" && currentScene !== "booking" && currentScene !== "gallery") {
    return null;
  }
  
  // Scale - small in hero and booking, normal in gallery
  const scale = currentScene === "gallery" ? 1 : 0.25;
  
  // Position slightly to the right, away from the house
  // Ground is at Y = -2
  const position: [number, number, number] = [30, -2, 6];
  
  // Gallery wall dimensions
  const wallHeight = 3.5;
  const wallWidth = 4.5;
  
  // Frame positions - 6 frames in 2 rows x 3 columns
  const frames = [
    // Top row
    { x: -1.2, y: 1.0, id: 0 },
    { x: 0, y: 1.0, id: 1 },
    { x: 1.2, y: 1.0, id: 2 },
    // Bottom row
    { x: -1.2, y: -0.3, id: 3 },
    { x: 0, y: -0.3, id: 4 },
    { x: 1.2, y: -0.3, id: 5 },
  ];
  
  // Freeze static objects for performance
  useEffect(() => {
    if (galleryRef.current) {
      galleryRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.frustumCulled = true;
          child.matrixAutoUpdate = false;
          child.updateMatrix();
        }
      });
    }
  }, []);

  return (
    <group ref={galleryRef} position={position} scale={scale}>
      {/* ========== OPTIMIZED GALLERY WALL ========== */}
      <group position={[0, wallHeight / 2, 0]}>
        {/* Main wall panel - OPTIMIZED geometry (reduced segments) */}
        <mesh castShadow receiveShadow frustumCulled>
          <boxGeometry args={[wallWidth, wallHeight, 0.15, 16, 16, 2]} />
          <meshStandardMaterial
            color="#f5f5f0"
            roughness={0.7}
            metalness={0.05}
            envMapIntensity={0.6}
          />
        </mesh>
        
        {/* Simplified curved surface effect - fewer segments */}
        {[-1, 0, 1].map((x, i) => (
          <mesh key={`curve-${i}`} position={[x * 1.5, 0, 0.08]} castShadow receiveShadow frustumCulled>
            <boxGeometry args={[1.5, wallHeight, 0.02, 4, 16, 1]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.6}
              metalness={0.05}
              envMapIntensity={0.7}
            />
          </mesh>
        ))}
        
        {/* Wall base molding - OPTIMIZED */}
        <mesh position={[0, -wallHeight / 2 + 0.1, 0.08]} castShadow receiveShadow frustumCulled>
          <boxGeometry args={[wallWidth, 0.2, 0.05, 8, 2, 2]} />
          <meshStandardMaterial
            color="#e8e8e0"
            roughness={0.8}
            metalness={0.05}
            envMapIntensity={0.5}
          />
        </mesh>
        
        {/* Wall top molding - OPTIMIZED */}
        <mesh position={[0, wallHeight / 2 - 0.1, 0.08]} castShadow receiveShadow frustumCulled>
          <boxGeometry args={[wallWidth, 0.2, 0.05, 8, 2, 2]} />
          <meshStandardMaterial
            color="#e8e8e0"
            roughness={0.8}
            metalness={0.05}
            envMapIntensity={0.5}
          />
        </mesh>
      </group>
      
      {/* ========== PHOTO FRAMES - OPTIMIZED (removed expensive spotlights) ========== */}
      {frames.map((frame) => (
        <group key={`frame-group-${frame.id}`} position={[frame.x, frame.y + wallHeight / 2, 0]}>
          {/* Simple emissive glow instead of spotlight for performance */}
          <mesh position={[0, 0.7, 0.3]} frustumCulled>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.3}
              transparent
              opacity={0.4}
            />
          </mesh>
          
          {/* Photo frame */}
          <PhotoFrame
            position={[0, 0, 0.1]}
            frameId={frame.id}
          />
        </group>
      ))}
      
      {/* ========== FLOOR REFLECTION - OPTIMIZED ========== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.01, 0]} receiveShadow frustumCulled>
        <planeGeometry args={[wallWidth + 1, 2]} />
        <meshStandardMaterial
          color="#3d5028"
          roughness={0.3}
          metalness={0.1}
          envMapIntensity={0.8}
        />
      </mesh>
      
      {/* ========== SOFT SHADOWS - OPTIMIZED ========== */}
      {/* Contact shadow directly under wall */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.99, 0]} receiveShadow frustumCulled>
        <planeGeometry args={[wallWidth + 0.5, 0.5]} />
        <shadowMaterial opacity={0.6} transparent />
      </mesh>
      
      {/* Soft ambient occlusion shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.98, 0]} receiveShadow frustumCulled>
        <planeGeometry args={[wallWidth + 1, 1]} />
        <shadowMaterial opacity={0.3} transparent />
      </mesh>
    </group>
  );
};

// Individual photo frame component - OPTIMIZED
const PhotoFrame = ({ position, frameId }: { position: [number, number, number]; frameId: number }) => {
  const frameWidth = 0.9;
  const frameHeight = 1.1;
  const frameDepth = 0.06;
  const matWidth = 0.05;
  
  // Different frame materials for variety
  const frameMaterials = [
    { color: "#8b7355", metalness: 0.3 },
    { color: "#c0c0c0", metalness: 0.8 },
    { color: "#8b7355", metalness: 0.3 },
    { color: "#c0c0c0", metalness: 0.8 },
    { color: "#8b7355", metalness: 0.3 },
    { color: "#c0c0c0", metalness: 0.8 },
  ];
  
  const frameMat = frameMaterials[frameId % frameMaterials.length];
  
  return (
    <group position={position}>
      {/* Frame outer border - OPTIMIZED geometry */}
      <mesh castShadow receiveShadow frustumCulled>
        <boxGeometry args={[frameWidth, frameHeight, frameDepth, 4, 4, 2]} />
        <meshStandardMaterial
          color={frameMat.color}
          roughness={frameMat.metalness > 0.5 ? 0.2 : 0.7}
          metalness={frameMat.metalness}
          envMapIntensity={frameMat.metalness > 0.5 ? 1.5 : 0.6}
        />
      </mesh>
      
      {/* Mat/Inner border - OPTIMIZED */}
      <mesh position={[0, 0, frameDepth / 2 + 0.01]} castShadow receiveShadow frustumCulled>
        <boxGeometry args={[frameWidth - matWidth * 2, frameHeight - matWidth * 2, 0.02, 4, 4, 1]} />
        <meshStandardMaterial
          color="#f5f5f0"
          roughness={0.6}
          metalness={0}
          envMapIntensity={0.4}
        />
      </mesh>
      
      {/* Photo/Texture area - OPTIMIZED */}
      <mesh position={[0, 0, frameDepth / 2 + 0.02]} castShadow receiveShadow frustumCulled>
        <boxGeometry args={[frameWidth - matWidth * 2 - 0.02, frameHeight - matWidth * 2 - 0.02, 0.01, 8, 8, 1]} />
        <meshStandardMaterial
          color={getPhotoColor(frameId)}
          roughness={0.3}
          metalness={0}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* Glass cover over photo - OPTIMIZED */}
      <mesh position={[0, 0, frameDepth / 2 + 0.025]} castShadow frustumCulled>
        <boxGeometry args={[frameWidth - matWidth * 2 - 0.01, frameHeight - matWidth * 2 - 0.01, 0.005, 8, 8, 1]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.05}
          metalness={0.05}
          transmission={0.9}
          thickness={0.01}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={2}
        />
      </mesh>
      
      {/* Frame corner accents for wooden frames - OPTIMIZED */}
      {frameMat.metalness < 0.5 && [
        [-frameWidth / 2, frameHeight / 2],
        [frameWidth / 2, frameHeight / 2],
        [-frameWidth / 2, -frameHeight / 2],
        [frameWidth / 2, -frameHeight / 2]
      ].map((corner, i) => (
        <mesh key={`corner-${i}`} position={[corner[0], corner[1], frameDepth / 2]} castShadow frustumCulled>
          <boxGeometry args={[0.08, 0.08, frameDepth, 2, 2, 2]} />
          <meshStandardMaterial
            color="#6a5442"
            roughness={0.6}
            metalness={0.1}
            envMapIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};

// Helper function to generate different photo colors/textures
const getPhotoColor = (frameId: number): string => {
  const photoColors = [
    "#e8d4c0",
    "#d0e8f0",
    "#f0e8d0",
    "#e0d8e8",
    "#d8e8d0",
    "#f0d8d0",
  ];
  return photoColors[frameId % photoColors.length];
};
