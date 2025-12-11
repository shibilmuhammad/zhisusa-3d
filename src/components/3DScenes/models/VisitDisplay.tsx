"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/stores/useExperienceStore";

export const VisitDisplay = () => {
  const visitRef = useRef<THREE.Group>(null);
  const iconRef = useRef<THREE.Group>(null);
  const currentScene = useExperienceStore((state) => state.currentScene);
  
  // Show in hero (small) and footer (normal, camera zooms)
  if (currentScene !== "hero" && currentScene !== "footer") {
    return null;
  }
  
  // Scale - small in hero, normal in footer (camera zooms to it smoothly)
  const scale = currentScene === "footer" ? 1 : 0.25;
  
  // Position in front of the scene, centered
  const position: [number, number, number] = [0, 0, -8];
  
  // Animate location icon rotation
  useFrame(() => {
    if (iconRef.current) {
      iconRef.current.rotation.y += 0.01;
    }
  });
  
  return (
    <group ref={visitRef} position={position} scale={scale}>
      {/* Ambient light for visit display */}
      <pointLight
        position={[0, 2, 0]}
        intensity={2}
        distance={10}
        color="#9fe8ff"
        castShadow={false}
      />
      
      {/* Top light for elegance */}
      <directionalLight
        position={[0, 5, 0]}
        intensity={1.5}
        color="#ffffff"
        castShadow={false}
      />
      
      {/* Side accent lights */}
      <pointLight
        position={[-3, 2, 2]}
        intensity={0.8}
        distance={8}
        color="#e8f4ff"
        castShadow={false}
      />
      <pointLight
        position={[3, 2, 2]}
        intensity={0.8}
        distance={8}
        color="#e8f4ff"
        castShadow={false}
      />
      
      {/* ========== WOODEN STAND FOR VISIT DISPLAY ========== */}
      <group position={[0, -1.75, 0]}>
        {/* Main support post - vertical */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.15, 3.5, 0.15]} />
          <meshStandardMaterial
            color="#6a5442"
            roughness={0.9}
            metalness={0}
            envMapIntensity={0.3}
          />
        </mesh>
        
        {/* Wood grain texture lines on post */}
        {[0, 0.5, 1, 1.5, 2, 2.5, 3].map((y, i) => (
          <mesh key={`grain-${i}`} position={[0, y - 1.75, 0.076]} castShadow>
            <boxGeometry args={[0.15, 0.01, 0.002]} />
            <meshStandardMaterial color="#5a4332" roughness={1} />
          </mesh>
        ))}
        
        {/* Cross support beams - horizontal */}
        <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 1.0, 0.1]} />
          <meshStandardMaterial
            color="#6a5442"
            roughness={0.9}
            metalness={0}
            envMapIntensity={0.3}
          />
        </mesh>
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 1.0, 0.1]} />
          <meshStandardMaterial
            color="#6a5442"
            roughness={0.9}
            metalness={0}
            envMapIntensity={0.3}
          />
        </mesh>
        
        {/* Diagonal braces for stability */}
        <mesh position={[-0.4, -0.8, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
          <boxGeometry args={[0.08, 0.6, 0.08]} />
          <meshStandardMaterial
            color="#5a4332"
            roughness={0.95}
            metalness={0}
          />
        </mesh>
        <mesh position={[0.4, -0.8, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
          <boxGeometry args={[0.08, 0.6, 0.08]} />
          <meshStandardMaterial
            color="#5a4332"
            roughness={0.95}
            metalness={0}
          />
        </mesh>
        
        {/* Base plate - sits on ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.8, 0.15]} />
          <meshStandardMaterial
            color="#5a4332"
            roughness={0.95}
            metalness={0}
            envMapIntensity={0.2}
          />
        </mesh>
        
        {/* Shadow under stand */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.51, 0]} receiveShadow>
          <planeGeometry args={[1.2, 1.2]} />
          <shadowMaterial opacity={0.3} transparent />
        </mesh>
      </group>
      
      {/* ========== VISIT INFORMATION BOARD ========== */}
      <group position={[0, 1.75, 0]}>
        {/* Main board - frosted glass with premium finish */}
        <mesh rotation={[0, 0, 0]} position={[0, 0, -0.12]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 3.5, 0.12]} />
          <meshPhysicalMaterial
            color="#d8ecff"
            roughness={0.05}
            metalness={0.1}
            transmission={0.9}
            thickness={0.25}
            ior={1.52}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={2}
            reflectivity={0.95}
          />
        </mesh>
        
        {/* Subtle rim light effect */}
        <mesh rotation={[0, 0, 0]} position={[0, 0, -0.11]} castShadow>
          <boxGeometry args={[4.25, 3.55, 0.01]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#9fe8ff"
            emissiveIntensity={0.3}
            transparent
            opacity={0.4}
          />
        </mesh>
        
        {/* Side panels for depth */}
        <mesh rotation={[0, 0, 0]} position={[-2.05, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.05, 3.5, 0.3]} />
          <meshPhysicalMaterial
            color="#c8e6ff"
            roughness={0.15}
            metalness={0.1}
            transmission={0.7}
            thickness={0.15}
            ior={1.5}
          />
        </mesh>
        <mesh rotation={[0, 0, 0]} position={[2.05, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.05, 3.5, 0.3]} />
          <meshPhysicalMaterial
            color="#c8e6ff"
            roughness={0.15}
            metalness={0.1}
            transmission={0.7}
            thickness={0.15}
            ior={1.5}
          />
        </mesh>
        <mesh rotation={[0, 0, 0]} position={[0, 1.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.05, 0.3]} />
          <meshPhysicalMaterial
            color="#c8e6ff"
            roughness={0.15}
            metalness={0.1}
            transmission={0.7}
            thickness={0.15}
            ior={1.5}
          />
        </mesh>
        <mesh rotation={[0, 0, 0]} position={[0, -1.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.05, 0.3]} />
          <meshPhysicalMaterial
            color="#c8e6ff"
            roughness={0.15}
            metalness={0.1}
            transmission={0.7}
            thickness={0.15}
            ior={1.5}
          />
        </mesh>
        
        {/* Rotating location/map icon on top */}
        <group ref={iconRef} position={[0, 2.2, 0.05]}>
          {/* Map pin icon */}
          <mesh castShadow receiveShadow>
            <coneGeometry args={[0.08, 0.2, 8]} />
            <meshStandardMaterial
              color="#4a90e2"
              roughness={0.3}
              metalness={0.2}
              emissive="#6ba3d4"
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* Pin circle base */}
          <mesh position={[0, -0.1, 0]} castShadow>
            <torusGeometry args={[0.06, 0.02, 8, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.8}
              roughness={0.2}
              emissive="#9fe8ff"
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>
        
        {/* Information sections */}
        {/* Title area */}
        <mesh position={[0, 1.2, 0.05]} castShadow>
          <boxGeometry args={[3.5, 0.5, 0.02]} />
          <meshStandardMaterial
            color="#2c5aa0"
            roughness={0.3}
            metalness={0.2}
            emissive="#4a90e2"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Contact info section */}
        <mesh position={[0, 0.3, 0.05]} castShadow>
          <boxGeometry args={[3.2, 0.8, 0.02]} />
          <meshStandardMaterial
            color="#e8f4ff"
            roughness={0.4}
            metalness={0.1}
            emissive="#d0e8ff"
            emissiveIntensity={0.15}
          />
        </mesh>
        
        {/* Location info section */}
        <mesh position={[0, -0.5, 0.05]} castShadow>
          <boxGeometry args={[3.2, 0.8, 0.02]} />
          <meshStandardMaterial
            color="#e8f4ff"
            roughness={0.4}
            metalness={0.1}
            emissive="#d0e8ff"
            emissiveIntensity={0.15}
          />
        </mesh>
        
        {/* Call to action section */}
        <mesh position={[0, -1.3, 0.05]} castShadow>
          <boxGeometry args={[3.5, 0.6, 0.02]} />
          <meshStandardMaterial
            color="#4a90e2"
            roughness={0.3}
            metalness={0.2}
            emissive="#6ba3d4"
            emissiveIntensity={0.25}
          />
        </mesh>
        
        {/* Decorative elements - small icons */}
        {[
          { x: -1.5, y: 0.3, type: "phone" },
          { x: 1.5, y: 0.3, type: "email" },
          { x: -1.5, y: -0.5, type: "location" },
          { x: 1.5, y: -0.5, type: "time" }
        ].map((icon, i) => (
          <mesh key={`icon-${i}`} position={[icon.x, icon.y, 0.06]} castShadow>
            <boxGeometry args={[0.15, 0.15, 0.01]} />
            <meshStandardMaterial
              color="#4a90e2"
              roughness={0.2}
              metalness={0.3}
              emissive="#6ba3d4"
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};



