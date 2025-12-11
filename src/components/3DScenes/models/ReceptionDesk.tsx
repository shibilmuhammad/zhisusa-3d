"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useExperienceStore } from "@/stores/useExperienceStore";

export const ReceptionDesk = () => {
  const deskRef = useRef<THREE.Group>(null);
  const currentScene = useExperienceStore((state) => state.currentScene);
  
  // Show in hero (small), leisure (small), and booking (normal, camera zooms)
  if (currentScene !== "hero" && currentScene !== "leisure" && currentScene !== "booking") {
    return null;
  }
  
  // Scale - small in hero and leisure, normal in booking
  const scale = currentScene === "booking" ? 1 : 0.25;
  
  // Position much further to the right, away from the house
  // Ground is at Y = -2, table top will be at Y = -1.2 (0.8 units above ground)
  const position: [number, number, number] = [32, -2, 6];
  
  // Table dimensions
  const tableTopHeight = 0.05;
  const tableHeight = 0.8; // Height from ground to table top
  const tableTopY = tableHeight + tableTopHeight / 2;
  
  // Freeze static objects for performance
  useEffect(() => {
    if (deskRef.current) {
      deskRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.frustumCulled = true;
          child.matrixAutoUpdate = false;
          child.updateMatrix();
        }
      });
    }
  }, []);
  
  return (
    <group ref={deskRef} position={position} scale={scale}>
      {/* ========== SIMPLE WOODEN TABLE - OPTIMIZED ========== */}
      <group>
        {/* Table top - OPTIMIZED geometry (reduced segments) */}
        <mesh position={[0, tableTopY, 0]} castShadow receiveShadow frustumCulled>
          <boxGeometry args={[1.2, tableTopHeight, 0.6, 8, 2, 6]} />
          <meshStandardMaterial
            color="#8a6f52"
            roughness={0.88}
            metalness={0.01}
            envMapIntensity={0.7}
          />
        </mesh>
        
        {/* Subtle wood grain on table top - OPTIMIZED */}
        {[-0.4, 0, 0.4].map((x, i) => (
          <mesh key={`grain-${i}`} position={[x, tableTopY + 0.001, 0]} castShadow frustumCulled>
            <boxGeometry args={[0.015, tableTopHeight, 0.6]} />
            <meshStandardMaterial 
              color="#6a5342" 
              roughness={1} 
              metalness={0}
            />
          </mesh>
        ))}
        
        {/* Simple table legs - OPTIMIZED geometry */}
        {[
          [-0.5, tableHeight / 2, -0.25],
          [0.5, tableHeight / 2, -0.25],
          [-0.5, tableHeight / 2, 0.25],
          [0.5, tableHeight / 2, 0.25]
        ].map((legPos, i) => (
          <mesh key={`leg-${i}`} position={legPos as [number, number, number]} castShadow receiveShadow frustumCulled>
            <boxGeometry args={[0.06, tableHeight, 0.06, 4, 8, 4]} />
            <meshStandardMaterial
              color="#6a5442"
              roughness={0.92}
              metalness={0}
              envMapIntensity={0.5}
            />
          </mesh>
        ))}
      </group>
      
      {/* ========== SINGLE BOOKING OBJECT: "BOOK NOW" SIGN - OPTIMIZED ========== */}
      <group position={[0, tableTopY + 0.15, 0]}>
        {/* Sign board - OPTIMIZED geometry */}
        <mesh castShadow receiveShadow frustumCulled>
          <boxGeometry args={[0.5, 0.2, 0.03, 6, 3, 2]} />
          <meshStandardMaterial
            color="#8a6f52"
            roughness={0.88}
            metalness={0.01}
            envMapIntensity={0.7}
          />
        </mesh>
        
        {/* Engraved text area - OPTIMIZED */}
        <mesh position={[0, 0, 0.016]} castShadow receiveShadow frustumCulled>
          <boxGeometry args={[0.45, 0.15, 0.01, 6, 3, 1]} />
          <meshStandardMaterial
            color="#5a4332"
            roughness={0.94}
            metalness={0}
            envMapIntensity={0.3}
          />
        </mesh>
        
        {/* Subtle wood grain on sign - OPTIMIZED */}
        {[-0.2, 0, 0.2].map((x, i) => (
          <mesh key={`sign-grain-${i}`} position={[x, 0, 0.016]} castShadow frustumCulled>
            <boxGeometry args={[0.01, 0.2, 0.005]} />
            <meshStandardMaterial 
              color="#6a5342" 
              roughness={1} 
              metalness={0}
            />
          </mesh>
        ))}
      </group>
      
      {/* ========== SOFT SHADOWS AND AMBIENT OCCLUSION - OPTIMIZED ========== */}
      {/* Contact shadow directly under table */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow frustumCulled>
        <planeGeometry args={[1.5, 1.0]} />
        <shadowMaterial opacity={0.5} transparent />
      </mesh>
      
      {/* Soft ambient occlusion shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow frustumCulled>
        <planeGeometry args={[2.0, 1.5]} />
        <shadowMaterial opacity={0.25} transparent />
      </mesh>
    </group>
  );
};
