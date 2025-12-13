"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { MeshStandardMaterial, MeshPhysicalMaterial } from "three";

export const CheckInKiosk = () => {
  const kioskRef = useRef<THREE.Group>(null);
  const ledRef = useRef<THREE.Mesh>(null);
  const currentScene = useExperienceStore((state) => state.currentScene);
  
  // Show in hero (small), leisure (small), and booking (normal, camera zooms)
  if (currentScene !== "hero" && currentScene !== "leisure" && currentScene !== "booking") {
    return null;
  }
  
  // Scale - small in hero and leisure, normal in booking
  const scale = currentScene === "booking" ? 1 : 0.25;
  
  // Position in a clear area away from trees - far to the right and forward
  const position: [number, number, number] = [18, 0, 5];
  
  // Animate LED glow
  useFrame((state) => {
    if (ledRef.current) {
      const time = state.clock.elapsedTime;
      const pulse = 0.6 + Math.sin(time * 2) * 0.2;
      const material = ledRef.current.material;

      if (
        !Array.isArray(material) &&
        (material instanceof MeshStandardMaterial ||
          material instanceof MeshPhysicalMaterial)
      ) {
        material.emissiveIntensity = pulse;
      }

    }
  });
  
  return (
    <group ref={kioskRef} position={position} scale={scale}>
      {/* Ambient light for kiosk */}
      <pointLight
        position={[0, 1.5, 0]}
        intensity={2}
        distance={10}
        color="#b5f5ff"
        castShadow={false}
      />
      
      {/* Top light for screen illumination */}
      <directionalLight
        position={[0, 5, 0]}
        intensity={1.5}
        color="#ffffff"
        castShadow={false}
      />
      
      {/* Screen backlight */}
      <pointLight
        position={[0, 1.8, 0.1]}
        intensity={1.2}
        distance={4}
        color="#4a90e2"
        castShadow={false}
      />
      
      {/* ========== BASE PLATFORM ========== */}
      <group position={[0, 0, 0]}>
        {/* Base plate - metallic */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.15, 32]} />
          <meshStandardMaterial
            color="#3a3a3a"
            roughness={0.3}
            metalness={0.9}
            envMapIntensity={1.5}
          />
        </mesh>
        
        {/* Soft blue LED light under base - animated */}
        <mesh ref={ledRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.65, 0.65, 0.02, 32]} />
          <meshStandardMaterial
            color="#4a90e2"
            emissive="#4a90e2"
            emissiveIntensity={0.6}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* LED glow effect */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.01, 32]} />
          <meshStandardMaterial
            color="#6ba3d4"
            emissive="#6ba3d4"
            emissiveIntensity={0.3}
            transparent
            opacity={0.4}
          />
        </mesh>
      </group>
      
      {/* ========== MAIN KIOSK BODY ========== */}
      <group position={[0, 0.8, 0]}>
        {/* Main body - sleek metallic */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 1.6, 0.4, 8, 16, 8]} />
          <meshStandardMaterial
            color="#4a4a4a"
            roughness={0.2}
            metalness={0.95}
            envMapIntensity={2.0}
          />
        </mesh>
        
        {/* Rounded corners - front top */}
        <mesh position={[0, 0.8, 0.2]} castShadow receiveShadow>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color="#4a4a4a"
            roughness={0.2}
            metalness={0.95}
            envMapIntensity={2.0}
          />
        </mesh>
        <mesh position={[-0.55, 0.8, 0.2]} castShadow receiveShadow>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color="#4a4a4a"
            roughness={0.2}
            metalness={0.95}
            envMapIntensity={2.0}
          />
        </mesh>
        <mesh position={[0.55, 0.8, 0.2]} castShadow receiveShadow>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color="#4a4a4a"
            roughness={0.2}
            metalness={0.95}
            envMapIntensity={2.0}
          />
        </mesh>
        
        {/* Side panels - metallic with beveled edges */}
        <mesh position={[-0.6, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 1.6, 0.4, 4, 16, 8]} />
          <meshStandardMaterial
            color="#3a3a3a"
            roughness={0.15}
            metalness={0.95}
            envMapIntensity={2.2}
          />
        </mesh>
        <mesh position={[0.6, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 1.6, 0.4, 4, 16, 8]} />
          <meshStandardMaterial
            color="#3a3a3a"
            roughness={0.15}
            metalness={0.95}
            envMapIntensity={2.2}
          />
        </mesh>
        
        {/* Back panel */}
        <mesh position={[0, 0, -0.2]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 1.6, 0.08, 8, 16, 4]} />
          <meshStandardMaterial
            color="#3a3a3a"
            roughness={0.2}
            metalness={0.9}
            envMapIntensity={1.8}
          />
        </mesh>
        
        {/* ========== GLASS SCREEN ========== */}
        <group position={[0, 0.3, 0.21]}>
          {/* Screen frame - metallic bezel */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.0, 0.8, 0.12, 8, 8, 4]} />
            <meshStandardMaterial
              color="#2a2a2a"
              roughness={0.1}
              metalness={0.98}
              envMapIntensity={2.5}
            />
          </mesh>
          
          {/* Glass screen - ultra-realistic */}
          <mesh position={[0, 0, 0.06]} castShadow>
            <boxGeometry args={[0.92, 0.72, 0.02, 8, 8, 2]} />
            <meshPhysicalMaterial
              color="#1a1a2a"
              roughness={0.05}
              metalness={0.1}
              transmission={0.95}
              thickness={0.1}
              ior={1.5}
              clearcoat={1}
              clearcoatRoughness={0.01}
              envMapIntensity={3.0}
              reflectivity={0.98}
            />
          </mesh>
          
          {/* Screen content - "CHECK-IN / BOOK NOW" text area */}
          <mesh position={[0, 0, 0.07]} castShadow>
            <boxGeometry args={[0.88, 0.68, 0.01]} />
            <meshStandardMaterial
              color="#0a1a2a"
              roughness={0.3}
              metalness={0.2}
              emissive="#1a3a5a"
              emissiveIntensity={0.4}
            />
          </mesh>
          
          {/* Text display areas */}
          {/* "CHECK-IN" text area */}
          <mesh position={[0, 0.15, 0.08]} castShadow>
            <boxGeometry args={[0.7, 0.15, 0.005]} />
            <meshStandardMaterial
              color="#2a4a6a"
              emissive="#4a90e2"
              emissiveIntensity={0.6}
              roughness={0.2}
              metalness={0.3}
            />
          </mesh>
          
          {/* "/" divider */}
          <mesh position={[0, 0, 0.08]} castShadow>
            <boxGeometry args={[0.05, 0.2, 0.005]} />
            <meshStandardMaterial
              color="#4a90e2"
              emissive="#6ba3d4"
              emissiveIntensity={0.8}
            />
          </mesh>
          
          {/* "BOOK NOW" text area */}
          <mesh position={[0, -0.15, 0.08]} castShadow>
            <boxGeometry args={[0.7, 0.15, 0.005]} />
            <meshStandardMaterial
              color="#2a4a6a"
              emissive="#4a90e2"
              emissiveIntensity={0.6}
              roughness={0.2}
              metalness={0.3}
            />
          </mesh>
          
          {/* Screen glow effect */}
          <mesh position={[0, 0, 0.065]} castShadow>
            <boxGeometry args={[0.94, 0.74, 0.01]} />
            <meshStandardMaterial
              color="#4a90e2"
              emissive="#6ba3d4"
              emissiveIntensity={0.2}
              transparent
              opacity={0.3}
            />
          </mesh>
        </group>
        
        {/* ========== INTERACTIVE BUTTONS ========== */}
        <group position={[0, -0.4, 0.21]}>
          {/* Button panel */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.8, 0.25, 0.08, 8, 4, 4]} />
            <meshStandardMaterial
              color="#2a2a2a"
              roughness={0.2}
              metalness={0.9}
              envMapIntensity={2.0}
            />
          </mesh>
          
          {/* Touch buttons */}
          {[
            { x: -0.25, label: "CHECK-IN" },
            { x: 0.25, label: "BOOK NOW" }
          ].map((btn, i) => (
            <group key={`btn-${i}`} position={[btn.x, 0, 0.05]}>
              {/* Button surface */}
              <mesh castShadow>
                <boxGeometry args={[0.35, 0.18, 0.02, 8, 4, 2]} />
                <meshStandardMaterial
                  color="#3a5a7a"
                  roughness={0.1}
                  metalness={0.8}
                  emissive="#4a90e2"
                  emissiveIntensity={0.3}
                  envMapIntensity={1.5}
                />
              </mesh>
              {/* Button highlight */}
              <mesh position={[0, 0, 0.011]} castShadow>
                <boxGeometry args={[0.33, 0.16, 0.005]} />
                <meshStandardMaterial
                  color="#6ba3d4"
                  emissive="#8bb5e0"
                  emissiveIntensity={0.4}
                  transparent
                  opacity={0.6}
                />
              </mesh>
            </group>
          ))}
        </group>
        
        {/* ========== METALLIC ACCENTS ========== */}
        {/* Top accent strip */}
        <mesh position={[0, 0.8, 0.15]} castShadow receiveShadow>
          <boxGeometry args={[1.15, 0.05, 0.02]} />
          <meshStandardMaterial
            color="#5a5a5a"
            roughness={0.1}
            metalness={0.98}
            envMapIntensity={2.5}
          />
        </mesh>
        
        {/* Bottom accent strip */}
        <mesh position={[0, -0.8, 0.15]} castShadow receiveShadow>
          <boxGeometry args={[1.15, 0.05, 0.02]} />
          <meshStandardMaterial
            color="#5a5a5a"
            roughness={0.1}
            metalness={0.98}
            envMapIntensity={2.5}
          />
        </mesh>
        
        {/* Side accent strips */}
        <mesh position={[-0.55, 0, 0.15]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.05, 0.02]} />
          <meshStandardMaterial
            color="#5a5a5a"
            roughness={0.1}
            metalness={0.98}
            envMapIntensity={2.5}
          />
        </mesh>
        <mesh position={[0.55, 0, 0.15]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.05, 0.02]} />
          <meshStandardMaterial
            color="#5a5a5a"
            roughness={0.1}
            metalness={0.98}
            envMapIntensity={2.5}
          />
        </mesh>
      </group>
      
      {/* Shadow under kiosk - ambient occlusion */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[0.8, 32]} />
        <shadowMaterial opacity={0.4} transparent />
      </mesh>
    </group>
  );
};





