"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Group, Vector3, Euler } from "three";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { sceneSequence } from "@/animations/constants";

const CABIN_MODEL_URL = "/models/cozy_cottage.glb";

// Smooth lerp helper
const lerp = (start: number, end: number, factor: number) => {
  return start + (end - start) * factor;
};

export const AFrameCabin = () => {
  const groupRef = useRef<Group>(null);
  const { camera } = useThree();
  const currentScene = useExperienceStore((state) => state.currentScene);
  const sectionProgress = useExperienceStore((state) => state.sectionProgress);

  // Target values for smooth transitions
  const targetCameraPos = useRef(new Vector3());
  const targetCameraLookAt = useRef(new Vector3());
  const targetModelRotation = useRef(new Euler());
  const targetFov = useRef(60);

  // Load the cozy cottage model
  let cottageScene;
  try {
    const { scene } = useGLTF(CABIN_MODEL_URL);
    cottageScene = scene;
  } catch (error) {
    console.warn("Cozy cottage model not found, using fallback");
  }

  // Helper function to get adjusted camera position
  const getAdjustedCameraPosition = (config: typeof sceneSequence[0]): [number, number, number] => {
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
    let cameraPosition = [...config.cameraPosition] as [number, number, number];
    
    if (isMobile && config.key === "work") {
      // Move camera more to the left on mobile (more negative X)
      cameraPosition[0] = cameraPosition[0] - 2; // Shift left by 2 units
    }
    
    return cameraPosition;
  };

  // Update target values when scene changes
  useEffect(() => {
    const activeConfig = sceneSequence.find((cfg) => cfg.key === currentScene);
    if (!activeConfig) return;

    // Get adjusted camera position (mobile-specific for work section)
    const cameraPosition = getAdjustedCameraPosition(activeConfig);

    // Update camera targets
    targetCameraPos.current.set(...cameraPosition);
    targetCameraLookAt.current.set(...activeConfig.cameraTarget);
    targetFov.current = activeConfig.cameraFov ?? 60;

    // Update model rotation targets
    if (activeConfig.modelRotation) {
      targetModelRotation.current.set(...activeConfig.modelRotation);
    }

    console.log(`🎥 Camera transition to ${currentScene}:`, {
      position: cameraPosition,
      target: activeConfig.cameraTarget,
      fov: activeConfig.cameraFov,
      rotation: activeConfig.modelRotation,
      isMobile: typeof window !== "undefined" && window.innerWidth <= 768
    });
  }, [currentScene]);

  // Handle window resize to adjust camera on mobile/desktop switch
  useEffect(() => {
    const handleResize = () => {
      const activeConfig = sceneSequence.find((cfg) => cfg.key === currentScene);
      if (!activeConfig) return;
      
      const cameraPosition = getAdjustedCameraPosition(activeConfig);
      targetCameraPos.current.set(...cameraPosition);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentScene]);

  // Smooth camera and model animation
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Get current section progress for easing
    const progress = sectionProgress[currentScene] ?? 0;
    const easedProgress = easeInOutCubic(progress);

    // Smooth camera position lerp
    const lerpFactor = Math.min(delta * 2, 1); // Smooth but responsive
    camera.position.x = lerp(camera.position.x, targetCameraPos.current.x, lerpFactor);
    camera.position.y = lerp(camera.position.y, targetCameraPos.current.y, lerpFactor);
    camera.position.z = lerp(camera.position.z, targetCameraPos.current.z, lerpFactor);

    // Smooth camera lookAt
    const currentLookAt = new Vector3();
    camera.getWorldDirection(currentLookAt);
    currentLookAt.add(camera.position);
    
    currentLookAt.x = lerp(currentLookAt.x, targetCameraLookAt.current.x, lerpFactor);
    currentLookAt.y = lerp(currentLookAt.y, targetCameraLookAt.current.y, lerpFactor);
    currentLookAt.z = lerp(currentLookAt.z, targetCameraLookAt.current.z, lerpFactor);
    
    camera.lookAt(currentLookAt);

    // Smooth FOV transition
    if ('fov' in camera) {
      (camera as any).fov = lerp((camera as any).fov, targetFov.current, lerpFactor * 0.5);
      camera.updateProjectionMatrix();
    }

    // Smooth model rotation
    groupRef.current.rotation.x = lerp(
      groupRef.current.rotation.x,
      targetModelRotation.current.x,
      lerpFactor * 0.8
    );
    groupRef.current.rotation.y = lerp(
      groupRef.current.rotation.y,
      targetModelRotation.current.y,
      lerpFactor * 0.8
    );
    groupRef.current.rotation.z = lerp(
      groupRef.current.rotation.z,
      targetModelRotation.current.z,
      lerpFactor * 0.8
    );

    // Subtle breathing animation
    const breathe = 1 + Math.sin(Date.now() * 0.0005) * 0.01;
    groupRef.current.scale.setScalar(breathe);
  });

  // Easing function
  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  return (
    <group ref={groupRef} position={[1, 0, 0]}>
      {cottageScene ? (
        <primitive
          object={cottageScene.clone()}
          scale={0.8}
          position={[0, 0, 0]}
          castShadow
          receiveShadow
        />
      ) : (
        // Enhanced Fallback: Realistic Natural Cottage
        <group>
          {/* Foundation - stone/concrete base */}
          <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.8, 0.3, 3.3]} />
            <meshStandardMaterial
              color="#5a5a5a"
              roughness={0.98}
              metalness={0}
              envMapIntensity={0.2}
            />
          </mesh>
          
          {/* Foundation texture detail */}
          {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
            <mesh key={`foundation-${i}`} position={[x, -0.1, 0]} castShadow>
              <boxGeometry args={[0.05, 0.3, 3.3]} />
              <meshStandardMaterial color="#4a4a4a" roughness={1} />
            </mesh>
          ))}
          
          {/* Main house body - natural wood with realistic material */}
          <mesh position={[0, 1, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.5, 2.2, 3]} />
            <meshStandardMaterial
              color="#7a6046"
              roughness={0.95}
              metalness={0.02}
              envMapIntensity={0.6}
            />
          </mesh>
          
          {/* Side walls with wood texture */}
          <mesh position={[-1.76, 1, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
            <planeGeometry args={[3, 2.2, 4, 8]} />
            <meshStandardMaterial
              color="#7a6046"
              roughness={0.95}
              metalness={0.02}
              envMapIntensity={0.5}
            />
          </mesh>
          <mesh position={[1.76, 1, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
            <planeGeometry args={[3, 2.2, 4, 8]} />
            <meshStandardMaterial
              color="#7a6046"
              roughness={0.95}
              metalness={0.02}
              envMapIntensity={0.5}
            />
          </mesh>
          
          {/* Back wall */}
          <mesh position={[0, 1, -1.52]} castShadow receiveShadow>
            <planeGeometry args={[3.5, 2.2, 8, 8]} />
            <meshStandardMaterial
              color="#7a6046"
              roughness={0.95}
              metalness={0.02}
              envMapIntensity={0.5}
            />
          </mesh>
          
          {/* Front wall - detailed wood planks */}
          <mesh position={[0, 1, 1.52]} castShadow receiveShadow>
            <planeGeometry args={[3.5, 2.2, 8, 8]} />
            <meshStandardMaterial
              color="#8a6f52"
              roughness={0.95}
              metalness={0}
              envMapIntensity={0.4}
            />
          </mesh>
          
          {/* Realistic wood plank lines - more detail */}
          {[-1.4, -0.7, 0, 0.7, 1.4].map((x, i) => (
            <mesh key={`plank-${i}`} position={[x, 1, 1.53]} castShadow>
              <boxGeometry args={[0.04, 2.2, 0.02]} />
              <meshStandardMaterial color="#5a4332" roughness={0.98} />
            </mesh>
          ))}
          
          {/* Horizontal wood grain lines */}
          {[0.3, 0.9, 1.5, 2.1].map((y, i) => (
            <mesh key={`grain-${i}`} position={[0, y, 1.53]} castShadow>
              <boxGeometry args={[3.5, 0.01, 0.01]} />
              <meshStandardMaterial color="#6a5342" roughness={1} />
            </mesh>
          ))}

          {/* A-Frame Roof - realistic wood shingles with texture */}
          <mesh position={[0, 2.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
            <coneGeometry args={[2.7, 1.9, 16]} />
            <meshStandardMaterial
              color="#4a3a28"
              roughness={0.98}
              metalness={0}
              envMapIntensity={0.4}
            />
          </mesh>
          
          {/* Roof shingle detail - individual shingles */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const radius = 2.5;
            return (
              <mesh
                key={`shingle-${i}`}
                position={[
                  Math.cos(angle) * radius * 0.3,
                  2.8 + Math.sin(angle) * 0.3,
                  Math.sin(angle) * radius * 0.3
                ]}
                rotation={[0, angle, Math.PI / 4]}
                castShadow
              >
                <boxGeometry args={[0.4, 0.05, 0.3]} />
                <meshStandardMaterial color="#3a2818" roughness={1} />
              </mesh>
            );
          })}

          {/* Roof overhang with proper shadows */}
          <mesh position={[0, 2.2, 1.6]} rotation={[-Math.PI / 6, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.9, 0.18, 0.9]} />
            <meshStandardMaterial
              color="#5a4832"
              roughness={0.95}
              metalness={0}
              envMapIntensity={0.3}
            />
          </mesh>
          
          {/* Roof shingle texture lines */}
          <mesh position={[0, 2.25, 1.8]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
            <boxGeometry args={[3.9, 0.02, 0.05]} />
            <meshStandardMaterial color="#3a2818" roughness={1} />
          </mesh>
          <mesh position={[0, 2.4, 1.6]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
            <boxGeometry args={[3.9, 0.02, 0.05]} />
            <meshStandardMaterial color="#3a2818" roughness={1} />
          </mesh>

          {/* Wooden door with realistic grain and shadow */}
          <mesh position={[0, 0.7, 1.52]} castShadow receiveShadow>
            <boxGeometry args={[0.7, 1.6, 0.08]} />
            <meshStandardMaterial 
              color="#5a3a21" 
              roughness={0.88}
              metalness={0.02}
              envMapIntensity={0.4}
            />
          </mesh>
          
          {/* Door panels detail */}
          <mesh position={[0, 0.9, 1.53]} castShadow>
            <boxGeometry args={[0.55, 0.55, 0.02]} />
            <meshStandardMaterial color="#4a2a11" roughness={0.92} />
          </mesh>
          <mesh position={[0, 0.4, 1.53]} castShadow>
            <boxGeometry args={[0.55, 0.55, 0.02]} />
            <meshStandardMaterial color="#4a2a11" roughness={0.92} />
          </mesh>
          
          {/* Door frame with depth */}
          <mesh position={[0, 0.7, 1.545]} castShadow receiveShadow>
            <boxGeometry args={[0.88, 1.78, 0.06]} />
            <meshStandardMaterial 
              color="#3a2718" 
              roughness={0.95}
              metalness={0}
            />
          </mesh>
          
          {/* Door handle */}
          <mesh position={[0.25, 0.7, 1.56]} castShadow>
            <sphereGeometry args={[0.03, 12, 12]} />
            <meshStandardMaterial 
              color="#8b7355" 
              roughness={0.4}
              metalness={0.6}
            />
          </mesh>

          {/* Left window with ultra-realistic glass */}
          <mesh position={[-1, 1.3, 1.52]} receiveShadow>
            <planeGeometry args={[0.65, 0.65]} />
            <meshPhysicalMaterial 
              color="#b8d4e8"
              transmission={0.95}
              thickness={0.8}
              roughness={0.05}
              metalness={0.02}
              transparent
              opacity={0.2}
              envMapIntensity={2.0}
              ior={1.5}
              reflectivity={0.9}
            />
          </mesh>
          
          {/* Window frame left with depth and shadow */}
          <mesh position={[-1, 1.3, 1.54]} castShadow receiveShadow>
            <boxGeometry args={[0.82, 0.82, 0.08]} />
            <meshStandardMaterial 
              color="#3a2718" 
              roughness={0.95}
              metalness={0}
              envMapIntensity={0.3}
            />
          </mesh>
          
          {/* Window cross divider left */}
          <mesh position={[-1, 1.3, 1.55]} castShadow>
            <boxGeometry args={[0.65, 0.03, 0.02]} />
            <meshStandardMaterial color="#2a1708" roughness={0.98} />
          </mesh>
          <mesh position={[-1, 1.3, 1.55]} castShadow>
            <boxGeometry args={[0.03, 0.65, 0.02]} />
            <meshStandardMaterial color="#2a1708" roughness={0.98} />
          </mesh>

          {/* Right window with ultra-realistic glass */}
          <mesh position={[1, 1.3, 1.52]} receiveShadow>
            <planeGeometry args={[0.65, 0.65]} />
            <meshPhysicalMaterial 
              color="#b8d4e8"
              transmission={0.95}
              thickness={0.8}
              roughness={0.05}
              metalness={0.02}
              transparent
              opacity={0.2}
              envMapIntensity={2.0}
              ior={1.5}
              reflectivity={0.9}
            />
          </mesh>
          
          {/* Window frame right with depth and shadow */}
          <mesh position={[1, 1.3, 1.54]} castShadow receiveShadow>
            <boxGeometry args={[0.82, 0.82, 0.08]} />
            <meshStandardMaterial 
              color="#3a2718" 
              roughness={0.95}
              metalness={0}
              envMapIntensity={0.3}
            />
          </mesh>
          
          {/* Window cross divider right */}
          <mesh position={[1, 1.3, 1.55]} castShadow>
            <boxGeometry args={[0.65, 0.03, 0.02]} />
            <meshStandardMaterial color="#2a1708" roughness={0.98} />
          </mesh>
          <mesh position={[1, 1.3, 1.55]} castShadow>
            <boxGeometry args={[0.03, 0.65, 0.02]} />
            <meshStandardMaterial color="#2a1708" roughness={0.98} />
          </mesh>

          {/* Chimney - realistic stone texture with detail */}
          <mesh position={[1.3, 3.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.5, 1.4, 0.5]} />
            <meshStandardMaterial 
              color="#696969" 
              roughness={0.98}
              metalness={0}
              envMapIntensity={0.3}
            />
          </mesh>
          
          {/* Chimney stone texture lines */}
          {[0.2, 0.5, 0.8, 1.1].map((y, i) => (
            <mesh key={`chimney-stone-${i}`} position={[1.3, 2.5 + y, 0]} castShadow>
              <boxGeometry args={[0.5, 0.02, 0.5]} />
              <meshStandardMaterial color="#5a5a5a" roughness={1} />
            </mesh>
          ))}
          
          {/* Chimney top cap */}
          <mesh position={[1.3, 3.95, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.6, 0.1, 0.6]} />
            <meshStandardMaterial 
              color="#7a7a7a" 
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>

          {/* Small porch/deck */}
          <mesh position={[0, 0, 2.2]} receiveShadow>
            <boxGeometry args={[3.8, 0.15, 1]} />
            <meshStandardMaterial
              color="#8B7355"
              roughness={0.9}
              metalness={0}
            />
          </mesh>

          {/* Porch support posts */}
          <mesh position={[-1.5, 0.6, 2.5]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 1.2]} />
            <meshStandardMaterial color="#654321" roughness={0.85} />
          </mesh>
          <mesh position={[1.5, 0.6, 2.5]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 1.2]} />
            <meshStandardMaterial color="#654321" roughness={0.85} />
          </mesh>

          {/* Natural foundation stones */}
          <mesh position={[-1.6, 0.15, 0]} receiveShadow>
            <boxGeometry args={[0.4, 0.3, 3]} />
            <meshStandardMaterial color="#696969" roughness={1} />
          </mesh>
          <mesh position={[1.6, 0.15, 0]} receiveShadow>
            <boxGeometry args={[0.4, 0.3, 3]} />
            <meshStandardMaterial color="#696969" roughness={1} />
          </mesh>

          {/* Side window for work section view */}
          <mesh position={[1.76, 1.2, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.2, 0.8]} />
            <meshPhysicalMaterial 
              color="#87CEEB"
              transmission={0.85}
              thickness={0.5}
              roughness={0.15}
              metalness={0.05}
              transparent
              opacity={0.35}
              envMapIntensity={1.5}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};

// Preload the model
useGLTF.preload(CABIN_MODEL_URL);

