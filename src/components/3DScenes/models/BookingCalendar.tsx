"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { MeshStandardMaterial } from "three";


export const BookingCalendar = () => {
  const calendarRef = useRef<THREE.Group>(null);
  const iconRef = useRef<THREE.Group>(null);
  const currentScene = useExperienceStore((state) => state.currentScene);
  
  // Show in hero (small), leisure (small), and booking (normal, camera zooms)
  if (currentScene !== "hero" && currentScene !== "leisure" && currentScene !== "booking") {
    return null;
  }
  
  // Scale - small in hero and leisure, normal in booking (camera zooms to it smoothly)
  const scale = currentScene === "booking" ? 1 : 0.25;
  
  // Position in a clear area away from trees - far to the right and forward
  // Trees are positioned in a circle around center (0, -2, 0), avoiding front-right quadrant
  // Calendar positioned at [18, 0, 5] - far right and forward, completely clear of trees
  const position: [number, number, number] = [18, 0, 5];
  
  // Animate calendar icon rotation
  useFrame(() => {
    if (iconRef.current) {
      iconRef.current.rotation.y += 0.01;
    }
  });
  
  // Generate date tiles for a month view
  const generateDates = () => {
    const dates = [];
    // First row - week days header
    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
    for (let i = 0; i < 7; i++) {
      dates.push({ type: "header", label: weekDays[i], x: i - 3, y: 3 });
    }
    // Date tiles - 5 weeks x 7 days
    let dateNum = 1;
    for (let week = 0; week < 5; week++) {
      for (let day = 0; day < 7; day++) {
        if (dateNum <= 31) {
          dates.push({ type: "date", label: dateNum.toString(), x: day - 3, y: 2 - week, dateNum });
          dateNum++;
        }
      }
    }
    return dates;
  };
  
  const dates = generateDates();
  
  return (
    <group ref={calendarRef} position={position} scale={scale}>
      {/* Ambient light for calendar */}
      <pointLight
        position={[0, 2, 0]}
        intensity={2}
        distance={10}
        color="#b5f5ff"
        castShadow={false}
      />
      
      {/* Top light for elegance */}
      <directionalLight
        position={[0, 5, 0]}
        intensity={1.5}
        color="#ffffff"
        castShadow={false}
      />
      
      {/* Side accent lights for glass highlights */}
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
      
      {/* Rotating calendar icon on top */}
      <group ref={iconRef} position={[0, 4.55, 0]}>
        {/* Calendar icon - premium 3D representation */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.18, 0.24, 0.03]} />
          <meshPhysicalMaterial
            color="#4a90e2"
            roughness={0.1}
            metalness={0.2}
            transmission={0.4}
            thickness={0.15}
            ior={1.52}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={2}
          />
        </mesh>
        {/* Calendar rings - premium metal */}
        <mesh position={[0, 0.06, 0.016]} castShadow>
          <torusGeometry args={[0.04, 0.006, 8, 16]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#b5f5ff"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Glow effect around icon */}
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[0.22, 0.28, 0.01]} />
          <meshStandardMaterial
            color="#6ba3d4"
            emissive="#8bb5e0"
            emissiveIntensity={0.5}
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>
      
      {/* ========== WOODEN STAND FOR CALENDAR ========== */}
      <group position={[0, -1.75, 0]}>
        {/* Main support post - vertical - realistic wood with natural grain */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.15, 3.5, 0.15, 4, 16, 4]} />
          <meshStandardMaterial
            color="#6a5442"
            roughness={0.95}
            metalness={0}
            envMapIntensity={0.4}
          />
        </mesh>
        
        {/* Realistic wood grain texture lines on post - more detail */}
        {[0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1, 2.4, 2.7, 3.0].map((y, i) => (
          <mesh key={`grain-${i}`} position={[0, y - 1.75, 0.076]} castShadow>
            <boxGeometry args={[0.15, 0.008, 0.002]} />
            <meshStandardMaterial color="#5a4332" roughness={1} />
          </mesh>
        ))}
        
        {/* Cross support beams - horizontal - realistic wood */}
        <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 1.0, 0.1, 4, 8, 4]} />
          <meshStandardMaterial
            color="#6a5442"
            roughness={0.95}
            metalness={0}
            envMapIntensity={0.4}
          />
        </mesh>
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 1.0, 0.1, 4, 8, 4]} />
          <meshStandardMaterial
            color="#6a5442"
            roughness={0.95}
            metalness={0}
            envMapIntensity={0.4}
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
        
        {/* Base plate - sits on ground - realistic wood with grain */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.8, 0.15, 8, 8, 4]} />
          <meshStandardMaterial
            color="#5a4332"
            roughness={0.98}
            metalness={0}
            envMapIntensity={0.3}
          />
        </mesh>
        {/* Base plate wood grain */}
        {[-0.3, 0, 0.3].map((x, i) => (
          <mesh key={`base-grain-x-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, -3.49, 0]} castShadow>
            <boxGeometry args={[0.02, 0.8, 0.001]} />
            <meshStandardMaterial color="#4a3222" roughness={1} />
          </mesh>
        ))}
        {[-0.3, 0, 0.3].map((z, i) => (
          <mesh key={`base-grain-z-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.49, z]} castShadow>
            <boxGeometry args={[0.8, 0.02, 0.001]} />
            <meshStandardMaterial color="#4a3222" roughness={1} />
          </mesh>
        ))}
        
        {/* Shadow under stand */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.51, 0]} receiveShadow>
          <planeGeometry args={[1.2, 1.2]} />
          <shadowMaterial opacity={0.3} transparent />
        </mesh>
      </group>
      
      {/* Main calendar container - glassmorphism base, sitting on top of stand */}
      <group position={[0, 1.75, 0]}>
        {/* Back panel - frosted glass with premium finish */}
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
            emissive="#b5f5ff"
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
        
        {/* Divider between Check-in and Check-out */}
        <mesh rotation={[0, 0, 0]} position={[0, 0, 0.01]} castShadow>
          <boxGeometry args={[0.08, 3.5, 0.05]} />
          <meshPhysicalMaterial
            color="#4a90e2"
            roughness={0.2}
            metalness={0.3}
            emissive="#4a90e2"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Check-in label */}
        <mesh position={[-1.5, 3.2, 0.05]} castShadow>
          <boxGeometry args={[1.2, 0.3, 0.02]} />
          <meshStandardMaterial
            color="#2c5aa0"
            roughness={0.3}
            metalness={0.2}
            emissive="#4a90e2"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Check-out label */}
        <mesh position={[1.5, 3.2, 0.05]} castShadow>
          <boxGeometry args={[1.2, 0.3, 0.02]} />
          <meshStandardMaterial
            color="#2c5aa0"
            roughness={0.3}
            metalness={0.2}
            emissive="#4a90e2"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Date tiles */}
        {dates.map((date, i) => {
          if (date.type === "header") {
            // Week day headers
            return (
              <mesh
                key={`header-${i}`}
                position={[date.x * 0.55, date.y * 0.5, 0.02]}
                castShadow
              >
                <boxGeometry args={[0.5, 0.4, 0.03]} />
                <meshStandardMaterial
                  color="#6ba3d4"
                  roughness={0.4}
                  metalness={0.2}
                  emissive="#8bb5e0"
                  emissiveIntensity={0.15}
                />
              </mesh>
            );
          } else {
            // Date tiles with pulsing glow
            return (
              <DateTile
                key={`date-${date.dateNum}`}
                position={[date.x * 0.55, date.y * 0.5, 0.05]}
                date={date.label}
                isLeft={date.x < 0}
              />
            );
          }
        })}
      </group>
    </group>
  );
};

// Individual date tile with pulsing glow
const DateTile = ({ position, date, isLeft }: { position: [number, number, number]; date: string; isLeft: boolean }) => {
  const tileRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const dateNum = parseInt(date);
  const isSelected = dateNum >= 5 && dateNum <= 12; // Example: selected date range
  
  useFrame((state) => {
    if (tileRef.current && glowRef.current) {
      const time = state.clock.elapsedTime;
      // Subtle pulsing glow - more pronounced for selected dates
      const pulseIntensity = isSelected ? 0.15 : 0.08;
      const pulse = 1 + Math.sin(time * 2) * pulseIntensity;
      glowRef.current.scale.setScalar(pulse);
      const baseOpacity = isSelected ? 0.5 : 0.25;
      const material = glowRef.current.material;

      if (!Array.isArray(material) && material instanceof MeshStandardMaterial) {
        material.transparent = true;
        material.opacity = baseOpacity + Math.sin(time * 2) * 0.1;
      }
      
    }
  });
  
  return (
    <group position={position}>
      {/* Glow effect behind tile */}
      <mesh ref={glowRef} position={[0, 0, -0.01]}>
        <boxGeometry args={[0.52, 0.42, 0.01]} />
        <meshStandardMaterial
          color={isSelected ? "#6ba3d4" : "#4a90e2"}
          emissive={isSelected ? "#8bb5e0" : "#6ba3d4"}
          emissiveIntensity={isSelected ? 1.2 : 0.8}
          transparent
          opacity={isSelected ? 0.5 : 0.25}
        />
      </mesh>
      
      {/* Main tile - glassmorphism with premium look */}
      <mesh ref={tileRef} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.4, 0.06]} />
        <meshPhysicalMaterial
          color={isSelected ? "#d0e8ff" : isLeft ? "#e8f4ff" : "#f0f8ff"}
          roughness={0.05}
          metalness={0.1}
          transmission={0.8}
          thickness={0.15}
          ior={1.52}
          clearcoat={1}
          clearcoatRoughness={0.02}
          envMapIntensity={2.5}
          reflectivity={0.9}
        />
      </mesh>
      
      {/* Date number indicator - simplified geometric representation */}
      <mesh position={[0, 0, 0.035]} castShadow>
        <boxGeometry args={[0.12, 0.15, 0.015]} />
        <meshStandardMaterial
          color={isSelected ? "#1a4a7a" : "#2c5aa0"}
          roughness={0.2}
          metalness={0.3}
          emissive={isSelected ? "#4a90e2" : "#2c5aa0"}
          emissiveIntensity={isSelected ? 0.3 : 0.1}
        />
      </mesh>
      
      {/* Corner accent for selected dates */}
      {isSelected && (
        <mesh position={[0.2, 0.15, 0.04]} castShadow>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color="#4a90e2"
            emissive="#6ba3d4"
            emissiveIntensity={0.8}
          />
        </mesh>
      )}
      
      {/* Soft shadow under tile */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.21, 0]} receiveShadow>
        <planeGeometry args={[0.5, 0.4]} />
        <shadowMaterial opacity={0.15} transparent />
      </mesh>
    </group>
  );
};

