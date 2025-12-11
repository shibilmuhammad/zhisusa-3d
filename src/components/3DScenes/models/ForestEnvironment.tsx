"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { OutdoorWorkspace } from "./OutdoorWorkspace";
import { LeisureActivities } from "./LeisureActivities";

export const ForestEnvironment = () => {
  // Create random tree positions - keeping zoom path completely clear
  const treePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const minDistance = 11; // Increased distance from cottage
    
    // Generate trees in a circle, avoiding the entire front-right quadrant (zoom path)
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      
      // COMPLETELY SKIP front-right quadrant where camera zooms (0 to PI/2 and PI*1.5 to PI*2)
      const isInZoomPath = (angle >= 0 && angle <= Math.PI * 0.6) || (angle >= Math.PI * 1.4 && angle <= Math.PI * 2);
      if (isInZoomPath) continue;
      
      // Also reduce density in extended front area
      const isNearZoomPath = angle > Math.PI * 0.6 && angle < Math.PI * 0.9;
      if (isNearZoomPath && Math.random() > 0.4) continue;
      
      const distance = minDistance + Math.random() * 10;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const y = -2; // Ground level
      
      positions.push([x, y, z]);
    }
    
    return positions;
  }, []);

  return (
    <group>
      {/* Ground - realistic grassy terrain with high detail */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow castShadow>
        <circleGeometry args={[40, 128]} />
        <meshStandardMaterial
          color="#3d4f2f"
          roughness={0.98}
          metalness={0}
          envMapIntensity={0.4}
        />
      </mesh>

      {/* Grass layer - natural green with variation and realistic texture */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.97, 0]} receiveShadow castShadow>
        <circleGeometry args={[38, 128]} />
        <meshStandardMaterial
          color="#4a6339"
          roughness={0.97}
          metalness={0}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* Subtle ground texture variation for realism */}
      {Array.from({ length: 15 }).map((_, i) => {
        const angle = (i / 15) * Math.PI * 2;
        const distance = 5 + (i % 5) * 3;
        return (
          <mesh
            key={`ground-patch-${i}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[
              Math.cos(angle) * distance,
              -1.96,
              Math.sin(angle) * distance
            ]}
            receiveShadow
          >
            <circleGeometry args={[0.8, 16]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#3d5028" : "#4a6339"}
              roughness={0.98}
              metalness={0}
              envMapIntensity={0.3}
            />
          </mesh>
        );
      })}

      {/* Trees around cottage */}
      {treePositions.map((pos, idx) => (
        <Tree key={idx} position={pos} scale={0.8 + Math.random() * 0.5} />
      ))}

      {/* Additional environmental elements */}
      
      {/* Bushes near cottage */}
      <Bush position={[-5, -1.8, -3]} scale={0.6} />
      <Bush position={[5.5, -1.8, -2]} scale={0.5} />
      <Bush position={[-4, -1.8, 4]} scale={0.7} />
      <Bush position={[6, -1.8, 3]} scale={0.55} />

      {/* Path/clearing around cottage */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.95, 2.5]} receiveShadow>
        <circleGeometry args={[5, 32]} />
        <meshStandardMaterial
          color="#8B7355"
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Natural rocks */}
      <Rock position={[-7, -1.7, 5]} scale={0.4} />
      <Rock position={[8, -1.7, 6]} scale={0.35} />
      <Rock position={[-6, -1.8, -5]} scale={0.3} />

      {/* Outdoor workspace - visible in welcome section, zoomed to in work section */}
      <OutdoorWorkspace />
      
      {/* Leisure activities - pond with fishing and archery range */}
      <LeisureActivities />
    </group>
  );
};

// Realistic tree component with detailed bark and foliage
const Tree = ({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) => {
  return (
    <group position={position} scale={scale}>
      {/* Realistic trunk with detailed bark texture - higher poly count */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.35, 5, 24]} />
        <meshStandardMaterial
          color="#3d2817"
          roughness={0.98}
          metalness={0}
          envMapIntensity={0.15}
        />
      </mesh>
      
      {/* Trunk texture variation - subtle rings */}
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.28, 0.02, 8, 24]} />
        <meshStandardMaterial
          color="#2a1a0f"
          roughness={1}
          metalness={0}
        />
      </mesh>
      <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.26, 0.02, 8, 24]} />
        <meshStandardMaterial
          color="#2a1a0f"
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Foliage - lower layer (darker, more realistic) - higher detail */}
      <mesh position={[0, 5.2, 0]} castShadow receiveShadow>
        <coneGeometry args={[2.2, 3.5, 16]} />
        <meshStandardMaterial
          color="#2a4a1a"
          roughness={0.92}
          metalness={0}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* Additional foliage clusters for realism */}
      <mesh position={[0.8, 5.5, 0.6]} castShadow receiveShadow>
        <sphereGeometry args={[0.9, 12, 12]} />
        <meshStandardMaterial
          color="#2d4f1c"
          roughness={0.9}
          metalness={0}
          envMapIntensity={0.45}
        />
      </mesh>
      <mesh position={[-0.7, 5.6, -0.5]} castShadow receiveShadow>
        <sphereGeometry args={[0.85, 12, 12]} />
        <meshStandardMaterial
          color="#2d4f1c"
          roughness={0.9}
          metalness={0}
          envMapIntensity={0.45}
        />
      </mesh>

      {/* Foliage - middle layer - higher detail */}
      <mesh position={[0, 6.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.7, 3, 16]} />
        <meshStandardMaterial
          color="#325d20"
          roughness={0.9}
          metalness={0}
          envMapIntensity={0.55}
        />
      </mesh>
      
      {/* Additional middle foliage clusters */}
      <mesh position={[0.6, 6.8, 0.4]} castShadow receiveShadow>
        <sphereGeometry args={[0.7, 12, 12]} />
        <meshStandardMaterial
          color="#356022"
          roughness={0.88}
          metalness={0}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Foliage - top layer (lighter, catching sunlight) - higher detail */}
      <mesh position={[0, 7.8, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.2, 2.5, 16]} />
        <meshStandardMaterial
          color="#3a6b26"
          roughness={0.88}
          metalness={0}
          envMapIntensity={0.65}
        />
      </mesh>
      
      {/* Top foliage highlight - catching light */}
      <mesh position={[0, 8.2, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshStandardMaterial
          color="#4a7a2f"
          roughness={0.85}
          metalness={0}
          envMapIntensity={0.7}
        />
      </mesh>
    </group>
  );
};

// Realistic bush component with detailed foliage
const Bush = ({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) => {
  return (
    <group position={position} scale={scale}>
      {/* Main bush body */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color="#3a5a2a"
          roughness={0.95}
          metalness={0}
          envMapIntensity={0.4}
        />
      </mesh>
      {/* Additional foliage clusters for realism */}
      <mesh position={[0.5, 0.2, 0.3]} castShadow receiveShadow>
        <sphereGeometry args={[0.7, 12, 12]} />
        <meshStandardMaterial
          color="#2d4a1e"
          roughness={0.95}
          metalness={0}
          envMapIntensity={0.35}
        />
      </mesh>
      <mesh position={[-0.4, 0.1, 0.2]} castShadow receiveShadow>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshStandardMaterial
          color="#355a24"
          roughness={0.95}
          metalness={0}
          envMapIntensity={0.35}
        />
      </mesh>
      <mesh position={[0.3, -0.1, -0.4]} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshStandardMaterial
          color="#3a5a2a"
          roughness={0.95}
          metalness={0}
          envMapIntensity={0.35}
        />
      </mesh>
      {/* Shadow under bush */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <circleGeometry args={[1.2, 16]} />
        <shadowMaterial opacity={0.2} transparent />
      </mesh>
    </group>
  );
};

// Realistic rock component with detailed geometry
const Rock = ({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) => {
  return (
    <group position={position} scale={scale}>
      {/* Main rock body - irregular shape */}
      <mesh castShadow receiveShadow>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#5a5a5a"
          roughness={0.98}
          metalness={0}
          envMapIntensity={0.2}
        />
      </mesh>
      {/* Rock detail - smaller pieces */}
      <mesh position={[0.3, 0.2, 0.2]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color="#4a4a4a"
          roughness={1}
          metalness={0}
        />
      </mesh>
      <mesh position={[-0.25, -0.15, 0.3]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial
          color="#4a4a4a"
          roughness={1}
          metalness={0}
        />
      </mesh>
    </group>
  );
};

