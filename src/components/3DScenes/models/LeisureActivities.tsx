"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Animated fire effect component
const FireEffect = () => {
  const fireRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (fireRef.current) {
      // Subtle animation - flickering and movement
      const time = state.clock.elapsedTime;
      fireRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const scale = 1 + Math.sin(time * 3 + i) * 0.1;
          child.scale.y = scale;
          child.position.y = 0.2 + Math.sin(time * 2 + i) * 0.05;
        }
      });
    }
  });
  
  return (
    <group ref={fireRef} position={[0, 0, 0]}>
      {/* Fire flames - realistic multiple layers for depth, rising from ground */}
      {[
        { pos: [0, 0.05, 0], scale: [0.3, 0.4, 0.3], color: "#ff6b00" },
        { pos: [0.05, 0.15, 0.03], scale: [0.25, 0.35, 0.25], color: "#ff8c42" },
        { pos: [-0.04, 0.22, -0.02], scale: [0.2, 0.3, 0.2], color: "#ffa64d" },
        { pos: [0.03, 0.28, 0.04], scale: [0.18, 0.25, 0.18], color: "#ffb366" },
        { pos: [-0.03, 0.12, 0.02], scale: [0.22, 0.32, 0.22], color: "#ff7a2a" },
        { pos: [0.04, 0.25, -0.03], scale: [0.19, 0.28, 0.19], color: "#ff9d55" }
      ].map((flame, i) => (
        <mesh key={`flame-${i}`} position={flame.pos} castShadow>
          <coneGeometry args={[flame.scale[0], flame.scale[1], 16]} />
          <meshStandardMaterial
            color={flame.color}
            emissive={flame.color}
            emissiveIntensity={1.0 + i * 0.1}
            roughness={0.2}
            metalness={0}
            transparent
            opacity={0.75 + i * 0.03}
          />
        </mesh>
      ))}
      
      {/* Realistic smoke particles - rising from fire */}
      {[
        { x: -0.08, z: 0.05, y: 0.4, size: 0.05 },
        { x: 0.06, z: -0.07, y: 0.6, size: 0.06 },
        { x: -0.05, z: -0.04, y: 0.8, size: 0.07 },
        { x: 0.07, z: 0.06, y: 1.0, size: 0.08 },
        { x: 0.02, z: -0.03, y: 1.2, size: 0.09 },
        { x: -0.04, z: 0.03, y: 1.4, size: 0.10 },
        { x: 0.05, z: -0.05, y: 1.6, size: 0.11 }
      ].map((smoke, i) => (
        <mesh
          key={`smoke-${i}`}
          position={[smoke.x, smoke.y, smoke.z]}
        >
          <sphereGeometry args={[smoke.size, 12, 12]} />
          <meshStandardMaterial
            color="#6a6a6a"
            roughness={1}
            metalness={0}
            transparent
            opacity={0.4 - i * 0.04}
          />
        </mesh>
      ))}
    </group>
  );
};

export const LeisureActivities = () => {
  return (
    <group position={[6, -2, -5]}>
      {/* ========== PROFESSIONAL NATURAL POND ========== */}
      <group position={[0, 0, 0]}>
        {/* Surrounding natural terrain - grass and earth - higher detail */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow castShadow>
          <circleGeometry args={[5.5, 128]} />
          <meshStandardMaterial
            color="#3d4f2f"
            roughness={0.96}
            metalness={0}
            envMapIntensity={0.5}
          />
        </mesh>
        
        {/* Pond muddy bottom - natural depth - higher detail */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]} receiveShadow>
          <circleGeometry args={[3.8, 128]} />
          <meshStandardMaterial
            color="#1a1510"
            roughness={1}
            metalness={0}
            envMapIntensity={0.2}
          />
        </mesh>
        
        {/* Pond water - ultra-realistic with refraction - higher detail */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow castShadow>
          <circleGeometry args={[3.5, 128]} />
          <meshPhysicalMaterial
            color="#2a4a54"
            roughness={0.01}
            metalness={0.1}
            transparent
            opacity={0.75}
            envMapIntensity={3.5}
            transmission={0.6}
            thickness={2.0}
            ior={1.33}
            reflectivity={0.98}
            clearcoat={1}
            clearcoatRoughness={0.02}
            side={2}
          />
        </mesh>
        
        {/* Water surface reflection highlight */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.07, 0]} receiveShadow>
          <circleGeometry args={[3.5, 128]} />
          <meshStandardMaterial
            color="#4a6a74"
            roughness={0.1}
            metalness={0.3}
            transparent
            opacity={0.2}
            envMapIntensity={2.0}
          />
        </mesh>
        
        {/* Natural sandy/rocky shore transition */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} receiveShadow>
          <ringGeometry args={[3.5, 4.2, 64]} />
          <meshStandardMaterial
            color="#9a8567"
            roughness={0.98}
            metalness={0}
            envMapIntensity={0.3}
          />
        </mesh>
        
        {/* Professional wooden dock - realistic construction */}
        <group position={[0, -0.05, 3.2]}>
          {/* Main deck surface - individual planks */}
          {Array.from({ length: 9 }).map((_, i) => (
            <mesh
              key={`plank-${i}`}
              position={[(i - 4) * 0.22, 0.08, -0.8]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.2, 0.06, 3.2, 4, 2, 16]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? "#8a7456" : "#7a6446"}
                roughness={0.92}
                metalness={0}
                envMapIntensity={0.4}
              />
            </mesh>
          ))}
          
          {/* Crossbeams underneath deck */}
          <mesh position={[0, 0.02, -0.3]} castShadow receiveShadow>
            <boxGeometry args={[2, 0.15, 0.15]} />
            <meshStandardMaterial color="#5a4332" roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.02, -1.3]} castShadow receiveShadow>
            <boxGeometry args={[2, 0.15, 0.15]} />
            <meshStandardMaterial color="#5a4332" roughness={0.95} />
          </mesh>
          
          {/* Thick support posts in water */}
          {[
            [-0.85, -0.5, -0.3],
            [0.85, -0.5, -0.3],
            [-0.85, -0.5, -1.3],
            [0.85, -0.5, -1.3]
          ].map((pos, i) => (
            <mesh key={`post-${i}`} position={pos} castShadow receiveShadow>
              <cylinderGeometry args={[0.12, 0.14, 1.2, 24]} />
              <meshStandardMaterial
                color="#4a3828"
                roughness={0.96}
                metalness={0}
                envMapIntensity={0.35}
              />
            </mesh>
          ))}
          
          {/* Dock edge trim */}
          <mesh position={[0, 0.12, -0.8]} castShadow>
            <boxGeometry args={[2.05, 0.04, 3.25]} />
            <meshStandardMaterial color="#6a5442" roughness={0.9} />
          </mesh>
          
          {/* Metal bolts/hardware details */}
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh
              key={`bolt-${i}`}
              position={[(i % 2 === 0 ? -0.9 : 0.9), 0.12, -0.3 - (Math.floor(i / 2) * 0.5)]}
              castShadow
            >
              <cylinderGeometry args={[0.015, 0.015, 0.03, 8]} />
              <meshStandardMaterial
                color="#3a3a3a"
                roughness={0.4}
                metalness={0.8}
              />
            </mesh>
          ))}
        </group>
        
        {/* Professional fishing equipment */}
        {/* High-end fishing rod */}
        <group position={[0.6, 0.08, 3]} rotation={[Math.PI / 4, Math.PI / 10, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.012, 0.018, 2.2, 12]} />
            <meshStandardMaterial
              color="#1a1a1a"
              roughness={0.3}
              metalness={0.6}
              envMapIntensity={1.5}
            />
          </mesh>
          {/* Rod guides */}
          {[0.3, 0.6, 0.9].map((z, i) => (
            <mesh key={`guide-${i}`} position={[0, z, 0]} castShadow>
              <torusGeometry args={[0.02, 0.003, 8, 12]} />
              <meshStandardMaterial color="#4a4a4a" roughness={0.3} metalness={0.7} />
            </mesh>
          ))}
          {/* Fishing line */}
          <mesh position={[0, 0.8, 0.15]} rotation={[Math.PI / 2.5, 0, 0]} castShadow>
            <cylinderGeometry args={[0.001, 0.001, 1.5]} />
            <meshStandardMaterial
              color="#e0e0e0"
              roughness={0.2}
              metalness={0.3}
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
        
        {/* Professional tackle box - realistic details */}
        <mesh position={[-0.65, 0.18, 2.5]} rotation={[0, Math.PI / 6, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.45, 0.25, 0.28]} />
          <meshStandardMaterial
            color="#2d4a5a"
            roughness={0.4}
            metalness={0.6}
            envMapIntensity={1.2}
          />
        </mesh>
        {/* Tackle box handle */}
        <mesh position={[-0.65, 0.32, 2.5]} rotation={[0, Math.PI / 6, 0]} castShadow>
          <boxGeometry args={[0.3, 0.04, 0.06]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.5} />
        </mesh>
        {/* Tackle box latches */}
        <mesh position={[-0.65, 0.2, 2.64]} castShadow>
          <boxGeometry args={[0.08, 0.15, 0.02]} />
          <meshStandardMaterial color="#c9a86a" roughness={0.3} metalness={0.9} />
        </mesh>
        
        {/* Insulated cooler for drinks */}
        <mesh position={[0.75, 0.2, 2.2]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 0.35, 0.3]} />
          <meshStandardMaterial
            color="#d4d4d4"
            roughness={0.6}
            metalness={0.2}
            envMapIntensity={0.8}
          />
        </mesh>
        <mesh position={[0.75, 0.38, 2.2]} castShadow receiveShadow>
          <boxGeometry args={[0.41, 0.04, 0.31]} />
          <meshStandardMaterial color="#3a6a8a" roughness={0.5} metalness={0.3} />
        </mesh>
        
        {/* Folding camp chair - premium quality */}
        <group position={[0, 0.05, 3.5]} rotation={[0, Math.PI, 0]}>
          {/* Seat frame - aluminum */}
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.55, 0.05, 0.5]} />
            <meshStandardMaterial
              color="#5a5a5a"
              roughness={0.4}
              metalness={0.7}
            />
          </mesh>
          {/* Seat fabric */}
          <mesh position={[0, 0.48, 0]} receiveShadow>
            <boxGeometry args={[0.5, 0.02, 0.46]} />
            <meshStandardMaterial
              color="#2a4a3a"
              roughness={0.8}
              metalness={0}
            />
          </mesh>
          {/* Backrest frame */}
          <mesh position={[0, 0.75, -0.22]} castShadow receiveShadow>
            <boxGeometry args={[0.55, 0.6, 0.05]} />
            <meshStandardMaterial color="#5a5a5a" roughness={0.4} metalness={0.7} />
          </mesh>
          {/* Backrest fabric */}
          <mesh position={[0, 0.75, -0.2]} receiveShadow>
            <boxGeometry args={[0.5, 0.55, 0.02]} />
            <meshStandardMaterial color="#2a4a3a" roughness={0.8} />
          </mesh>
          {/* Chair legs - crossed design */}
          {[[-0.22, 0.22, 0], [0.22, 0.22, 0], [-0.22, 0.22, -0.4], [0.22, 0.22, -0.4]].map((pos, i) => (
            <mesh key={`leg-${i}`} position={pos} rotation={[0, 0, i < 2 ? Math.PI / 12 : -Math.PI / 12]} castShadow>
              <cylinderGeometry args={[0.015, 0.018, 0.5, 12]} />
              <meshStandardMaterial color="#4a4a4a" roughness={0.5} metalness={0.7} />
            </mesh>
          ))}
        </group>
        
        {/* Natural water plants - cattails */}
        {[
          [-3, 0, 1.2],
          [-3.2, 0, 0.5],
          [-2.8, 0, 1.5],
          [2.8, 0, 1],
          [3, 0, 0.3],
          [2.5, 0, 1.4]
        ].map((pos, i) => (
          <group key={`cattail-${i}`} position={pos}>
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.02, 0.025, 1.2, 12]} />
              <meshStandardMaterial
                color="#3a5a2a"
                roughness={0.9}
                metalness={0}
              />
            </mesh>
            <mesh position={[0, 1.25, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.18, 12]} />
              <meshStandardMaterial
                color="#5a4332"
                roughness={0.95}
                metalness={0}
              />
            </mesh>
          </group>
        ))}
        
        {/* Realistic water lilies */}
        {[
          [-1.5, -0.07, -0.8],
          [1.2, -0.07, -1.2],
          [-0.5, -0.07, -1.5],
          [1.8, -0.07, 0.5]
        ].map((pos, i) => (
          <group key={`lily-${i}`} position={pos}>
            {/* Lily pad - realistic shape */}
            <mesh rotation={[-Math.PI / 2, 0, i * 0.5]}>
              <circleGeometry args={[0.22, 16]} />
              <meshStandardMaterial
                color="#2d4520"
                roughness={0.9}
                metalness={0}
                side={2}
              />
            </mesh>
            {/* Small slit in lily pad */}
            <mesh rotation={[-Math.PI / 2, 0, i * 0.5]} position={[0.15, 0.001, 0]}>
              <boxGeometry args={[0.08, 0.001, 0.02]} />
              <meshStandardMaterial color="#1a2a15" roughness={1} />
            </mesh>
            {/* Flower */}
            {i % 2 === 0 && (
              <mesh position={[0, 0.08, 0]} castShadow>
                <sphereGeometry args={[0.06, 12, 12]} />
                <meshStandardMaterial
                  color={i % 3 === 0 ? "#f5e6d3" : "#ffd4e5"}
                  roughness={0.8}
                  metalness={0}
                  emissive={i % 3 === 0 ? "#f5e6d3" : "#ffd4e5"}
                  emissiveIntensity={0.15}
                />
              </mesh>
            )}
          </group>
        ))}
        
        {/* Natural rocks around pond edge */}
        {[
          [-3.5, -0.08, -1],
          [-3.2, -0.1, 1.8],
          [3.4, -0.09, 0.5],
          [2.8, -0.08, -1.5]
        ].map((pos, i) => (
          <mesh key={`rock-${i}`} position={pos} rotation={[0, i * 0.8, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.3 + i * 0.05, 8, 6]} />
            <meshStandardMaterial
              color="#4a4a4a"
              roughness={0.95}
              metalness={0}
              envMapIntensity={0.2}
            />
          </mesh>
        ))}
      </group>
      
      {/* ========== REALISTIC CAMPFIRE SCENE ========== */}
      <group position={[2, 0, -1]}>
        {/* Natural dirt/ash area around fire - on ground level */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[2.5, 2.2]} />
          <meshStandardMaterial
            color="#2a2a1a"
            roughness={0.98}
            metalness={0}
          />
        </mesh>
        
        {/* Soft shadow under campfire area */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
          <planeGeometry args={[3, 2.5]} />
          <shadowMaterial opacity={0.3} transparent />
        </mesh>
        
        {/* Scattered rocks around fire - realistic irregular rocks, natural placement, on ground */}
        {[
          { pos: [-1.2, 0.06, -0.8], rot: [0.1, 0.3, 0.2], size: 0.12 },
          { pos: [1.1, 0.06, -0.9], rot: [0.15, -0.2, 0.1], size: 0.14 },
          { pos: [-0.9, 0.06, 1.0], rot: [0.2, 0.4, -0.15], size: 0.11 },
          { pos: [1.3, 0.06, 0.7], rot: [-0.1, -0.3, 0.25], size: 0.13 },
          { pos: [-0.5, 0.06, -1.1], rot: [0.25, 0.1, 0.3], size: 0.10 },
          { pos: [0.6, 0.06, 1.2], rot: [-0.15, 0.2, -0.2], size: 0.12 },
          { pos: [-1.4, 0.06, 0.3], rot: [0.3, -0.4, 0.15], size: 0.15 },
          { pos: [0.8, 0.06, -1.3], rot: [-0.2, 0.25, 0.2], size: 0.11 }
        ].map((rock, i) => (
          <group key={`scattered-rock-${i}`} position={rock.pos} rotation={rock.rot}>
            {/* Main rock - irregular shape */}
            <mesh castShadow receiveShadow>
              <dodecahedronGeometry args={[rock.size, 1]} />
              <meshStandardMaterial
                color="#4a4a4a"
                roughness={0.98}
                metalness={0}
                envMapIntensity={0.25}
              />
            </mesh>
            {/* Rock detail */}
            <mesh position={[rock.size * 0.3, rock.size * 0.2, rock.size * 0.2]} castShadow>
              <dodecahedronGeometry args={[rock.size * 0.3, 0]} />
              <meshStandardMaterial
                color="#3a3a3a"
                roughness={1}
                metalness={0}
              />
            </mesh>
          </group>
        ))}
        
        {/* ========== CAMPFIRE - Round Stones Ring ========== */}
        <group position={[0, 0, 0]}>
          {/* Fire pit stones - realistic irregular stones, arranged in circle, sitting on ground */}
          {[
            { angle: 0, rot: 0.1, size: 0.14, shape: "irregular" },
            { angle: Math.PI * 2/8, rot: 0.2, size: 0.13, shape: "round" },
            { angle: Math.PI * 4/8, rot: 0.15, size: 0.15, shape: "irregular" },
            { angle: Math.PI * 6/8, rot: 0.25, size: 0.12, shape: "flat" },
            { angle: Math.PI * 8/8, rot: 0.18, size: 0.14, shape: "round" },
            { angle: Math.PI * 10/8, rot: 0.22, size: 0.13, shape: "irregular" },
            { angle: Math.PI * 12/8, rot: 0.12, size: 0.15, shape: "round" },
            { angle: Math.PI * 14/8, rot: 0.2, size: 0.13, shape: "flat" }
          ].map((stone, i) => (
            <group
              key={`stone-${i}`}
              position={[
                Math.cos(stone.angle) * 0.4,
                stone.size * 0.7,
                Math.sin(stone.angle) * 0.4
              ]}
              rotation={[0, stone.angle, stone.rot]}
            >
              {/* Main stone body - higher detail */}
              <mesh castShadow receiveShadow>
                {stone.shape === "irregular" ? (
                  <dodecahedronGeometry args={[stone.size, 1]} />
                ) : stone.shape === "flat" ? (
                  <boxGeometry args={[stone.size * 1.5, stone.size * 0.6, stone.size * 1.2]} />
                ) : (
                  <sphereGeometry args={[stone.size, 16, 12]} />
                )}
                <meshStandardMaterial
                  color="#5a5a5a"
                  roughness={0.98}
                  metalness={0}
                  envMapIntensity={0.25}
                />
              </mesh>
              {/* Stone texture detail */}
              <mesh position={[0, stone.size * 0.3, 0]} castShadow>
                <boxGeometry args={[stone.size * 0.3, stone.size * 0.1, stone.size * 0.3]} />
                <meshStandardMaterial
                  color="#4a4a4a"
                  roughness={1}
                  metalness={0}
                />
              </mesh>
            </group>
          ))}
          
          {/* Burning logs in fire - realistic wood with bark texture, positioned on ground */}
          {[
            { pos: [0, 0.2, 0], rot: [0, 0, Math.PI / 6] },
            { pos: [0.08, 0.18, 0.05], rot: [0, Math.PI / 3, -Math.PI / 8] },
            { pos: [-0.06, 0.19, -0.04], rot: [0, -Math.PI / 4, Math.PI / 5] }
          ].map((log, i) => (
            <group key={`log-${i}`} position={log.pos} rotation={log.rot}>
              {/* Main log body - higher detail */}
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
                <meshStandardMaterial
                  color="#3a2a1a"
                  roughness={0.95}
                  metalness={0}
                  envMapIntensity={0.35}
                />
              </mesh>
              {/* Bark texture rings */}
              <mesh position={[0, 0.1, 0]} castShadow>
                <torusGeometry args={[0.062, 0.003, 8, 16]} />
                <meshStandardMaterial
                  color="#2a1a0a"
                  roughness={1}
                  metalness={0}
                />
              </mesh>
              <mesh position={[0, -0.1, 0]} castShadow>
                <torusGeometry args={[0.062, 0.003, 8, 16]} />
                <meshStandardMaterial
                  color="#2a1a0a"
                  roughness={1}
                  metalness={0}
                />
              </mesh>
              {/* Charred/glowing ends from fire */}
              <mesh position={[0, 0.2, 0]} castShadow>
                <cylinderGeometry args={[0.062, 0.062, 0.02, 16]} />
                <meshStandardMaterial
                  color="#1a0a0a"
                  roughness={0.8}
                  metalness={0}
                  emissive="#ff6b00"
                  emissiveIntensity={0.3}
                />
              </mesh>
            </group>
          ))}
          
          {/* Shadow under logs and stones */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
            <circleGeometry args={[0.6, 16]} />
            <shadowMaterial opacity={0.4} transparent />
          </mesh>
          
          {/* Animated fire - emissive glowing, positioned on ground */}
          <group position={[0, 0, 0]}>
            <FireEffect />
          </group>
          
          {/* Warm fire light */}
          <pointLight
            position={[0, 0.3, 0]}
            intensity={2.5}
            distance={6}
            color="#ff8c42"
            castShadow
          />
          
          {/* Additional warm fill light */}
          <pointLight
            position={[0, 0.4, 0]}
            intensity={1.2}
            distance={8}
            color="#ffb366"
            castShadow={false}
          />
        </group>
        
        {/* ========== WOODEN LOG SEATS (Semicircle) ========== */}
        {[
          { angle: -Math.PI / 3, dist: 1.8 },
          { angle: -Math.PI / 6, dist: 1.7 },
          { angle: Math.PI / 6, dist: 1.7 },
          { angle: Math.PI / 3, dist: 1.8 }
        ].map((seat, i) => (
          <group
            key={`seat-${i}`}
            position={[
              Math.cos(seat.angle) * seat.dist,
              0.15, // Log radius so it sits on ground
              Math.sin(seat.angle) * seat.dist
            ]}
            rotation={[0, seat.angle + Math.PI / 2, 0]}
          >
            {/* Log seat - horizontal, sitting on ground - realistic wood */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.15, 0.15, 1.2, 24]} />
              <meshStandardMaterial
                color="#6a5442"
                roughness={0.95}
                metalness={0}
                envMapIntensity={0.4}
              />
            </mesh>
            
            {/* Shadow under log */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]} receiveShadow>
              <planeGeometry args={[1.2, 0.3]} />
              <shadowMaterial opacity={0.3} transparent />
            </mesh>
            
            {/* Realistic wood grain lines - more detail */}
            {[-0.5, -0.3, -0.1, 0.1, 0.3, 0.5].map((offset, j) => (
              <mesh key={`grain-${j}`} position={[offset, 0, 0.151]} castShadow>
                <boxGeometry args={[0.015, 0.35, 0.002]} />
                <meshStandardMaterial color="#5a4332" roughness={1} />
              </mesh>
            ))}
            {/* Bark texture rings */}
            <mesh position={[0, 0, 0.152]} castShadow>
              <torusGeometry args={[0.15, 0.005, 8, 24]} />
              <meshStandardMaterial color="#5a4332" roughness={1} />
            </mesh>
            
            {/* Lantern on first log */}
            {i === 0 && (
              <group position={[0, 0.25, 0]}>
                {/* Lantern base */}
                <mesh castShadow receiveShadow>
                  <cylinderGeometry args={[0.08, 0.08, 0.15, 12]} />
                  <meshStandardMaterial
                    color="#3a3a3a"
                    roughness={0.4}
                    metalness={0.7}
                  />
                </mesh>
                
                {/* Lantern glass */}
                <mesh position={[0, 0.08, 0]} castShadow>
                  <cylinderGeometry args={[0.07, 0.07, 0.2, 12]} />
                  <meshPhysicalMaterial
                    color="#fff4e0"
                    transmission={0.3}
                    roughness={0.1}
                    metalness={0}
                    emissive="#ffd700"
                    emissiveIntensity={0.8}
                    transparent
                    opacity={0.9}
                  />
                </mesh>
                
                {/* Lantern top */}
                <mesh position={[0, 0.2, 0]} castShadow>
                  <cylinderGeometry args={[0.09, 0.08, 0.05, 12]} />
                  <meshStandardMaterial
                    color="#2a2a2a"
                    roughness={0.3}
                    metalness={0.8}
                  />
                </mesh>
                
                {/* Lantern handle */}
                <mesh position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <torusGeometry args={[0.05, 0.01, 8, 16]} />
                  <meshStandardMaterial
                    color="#2a2a2a"
                    roughness={0.4}
                    metalness={0.7}
                  />
                </mesh>
                
                {/* Lantern light */}
                <pointLight
                  position={[0, 0.08, 0]}
                  intensity={1.2}
                  distance={4}
                  color="#ffd700"
                  castShadow
                />
              </group>
            )}
          </group>
        ))}
        
        {/* ========== TREES BEHIND CAMPFIRE ========== */}
        {[
          [-2.5, 0, -1.5],
          [2.8, 0, -1.2],
          [-2.2, 0, 1.8],
          [2.5, 0, 2]
        ].map((pos, i) => (
          <group key={`tree-${i}`} position={pos as [number, number, number]}>
            {/* Tree trunk */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.4, 0.5, 6, 12]} />
              <meshStandardMaterial
                color="#4a3a28"
                roughness={0.95}
                metalness={0}
                envMapIntensity={0.2}
              />
            </mesh>
            
            {/* Tree foliage - layered */}
            {[
              [0, 4, 0, 1.8],
              [0, 5, 0, 1.5],
              [0, 5.8, 0, 1.2]
            ].map((foliage, j) => (
              <mesh
                key={`foliage-${j}`}
                position={[foliage[0], foliage[1], foliage[2]]}
                castShadow
                receiveShadow
              >
                <sphereGeometry args={[foliage[3], 12, 12]} />
                <meshStandardMaterial
                  color="#2d5016"
                  roughness={0.9}
                  metalness={0}
                  envMapIntensity={0.5}
                />
              </mesh>
            ))}
          </group>
        ))}
        
      </group>
    </group>
  );
};
