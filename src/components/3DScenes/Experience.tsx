"use client";
import { useThree } from "@react-three/fiber";
import { useRef, Suspense, useEffect } from "react";
import { DirectionalLight, Group, ACESFilmicToneMapping, SRGBColorSpace, PCFSoftShadowMap, ShadowMapType } from "three";
import { OrbitControls, Sky, Environment } from "@react-three/drei";

import { MorphingElement } from "./MorphingElement";
import { AFrameCabin } from "./models/AFrameCabin";
import { ForestEnvironment } from "./models/ForestEnvironment";
import { ReceptionDesk } from "./models/ReceptionDesk";
import { GalleryDisplay } from "./models/GalleryDisplay";
import { VisitDisplay } from "./models/VisitDisplay";
import { useExperienceStore } from "@/stores/useExperienceStore";
import "./preload";

const ExperienceInner = () => {
  const groupRef = useRef<Group>(null);
  const dirLightRef = useRef<DirectionalLight>(null);
  const currentScene = useExperienceStore((state) => state.currentScene);
  const { gl } = useThree();
  
  // Optimized THREE.js rendering settings
  useEffect(() => {
    gl.toneMapping = ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.2;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = PCFSoftShadowMap as ShadowMapType;
    // Use PCFSoft for better performance than PCF
    gl.outputColorSpace = SRGBColorSpace;



  }, [gl]);

  // Show cabin model for "hero", "live", "work", "leisure", "booking", "gallery" and "footer" sections
  const showCabin = currentScene === "hero" || currentScene === "live" || currentScene === "work" || currentScene === "leisure" || currentScene === "booking" || currentScene === "gallery" || currentScene === "footer";
  
  // Show reception desk for "hero" (small), "leisure" (small), and "booking" (normal, camera zooms)
  const showReceptionDesk = currentScene === "hero" || currentScene === "leisure" || currentScene === "booking";
  
  // Show gallery display for "hero" (small) and "gallery" (normal, camera zooms)
  const showGallery = currentScene === "hero" || currentScene === "booking" || currentScene === "gallery";
  
  // Show visit display for "hero" (small) and "footer" (normal, camera zooms)
  const showVisit = currentScene === "hero" || currentScene === "footer";

  return (
    <>
      {/* Smooth 360 degree rotation controls - disabled for cabin/forest scenes */}
      <OrbitControls
        enabled={!showCabin}
        enableZoom={true}
        enablePan={false}
        minDistance={4}
        maxDistance={18}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate={!showCabin}
        autoRotateSpeed={0.3}
        enableDamping={true}
        dampingFactor={0.05}
      />

      {/* Soft sky gradient */}
      <Sky
        distance={450000}
        sunPosition={[100, 30, 100]}
        inclination={0.5}
        azimuth={0.25}
        turbidity={8}
        rayleigh={2}
      />

      {/* HDR environment lighting - optimized blur for performance */}
      <Environment
        preset="forest"
        background={false}
        blur={0.3}
        environmentIntensity={1.2}
      />

      <group ref={groupRef}>
        {/* Optimized lighting - ONE main directional + ambient + hemisphere */}
        <ambientLight intensity={1.2} color="#fff8f0" />
        
        {/* Main sunlight - OPTIMIZED shadow map size (1024 instead of 8192) */}
        <directionalLight
          ref={dirLightRef}
          position={[20, 25, 15]}
          intensity={showCabin ? 3.5 : 2.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={100}
          shadow-camera-left={-40}
          shadow-camera-right={40}
          shadow-camera-top={40}
          shadow-camera-bottom={-40}
          shadow-bias={-0.0001}
          shadow-normalBias={0.03}
          shadow-radius={2}
          color={showCabin ? "#ffe8d1" : "#ffffff"}
        />
        
        {/* Atmospheric hemisphere for natural outdoor lighting */}
        <hemisphereLight
  args={[
    showCabin ? "#c8e6ff" : "#ffffff",
    showCabin ? "#3d4f2f" : "#e8e8e8",
    showCabin ? 1.2 : 0.8
  ]}
/>


        {/* Ultra-smooth fog for atmospheric depth */}
        <fog attach="fog" args={['#1a2a1f', 15, 45]} />

        {/* Scene content */}
        {/* Ground plane - OPTIMIZED geometry (reduced segments) */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -2, 0]}
          receiveShadow
          frustumCulled={true}
        >
          <planeGeometry args={[60, 60, 32, 32]} />
          <meshStandardMaterial
            color="#3d5028"
            roughness={0.98}
            metalness={0}
            envMapIntensity={0.3}
          />
        </mesh>

        {/* Shadow catcher plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.99, 0]} receiveShadow frustumCulled={true}>
          <planeGeometry args={[40, 40]} />
          <shadowMaterial opacity={0.15} transparent />
        </mesh>

        {/* Conditionally render A-frame cabin with forest or photo cards */}
        {showCabin ? (
          <Suspense fallback={null}>
            <ForestEnvironment />
            <AFrameCabin />
          </Suspense>
        ) : (
          <Suspense fallback={null}>
            <MorphingElement />
          </Suspense>
        )}
        
        {/* Reception Desk - visible in hero (small), leisure (small), and booking (zoomed) */}
        {showReceptionDesk && (
          <Suspense fallback={null}>
            <ReceptionDesk />
          </Suspense>
        )}
        
        {/* Gallery Display - visible in hero (small), booking (small), and gallery (zoomed) */}
        {showGallery && (
          <Suspense fallback={null}>
            <GalleryDisplay />
          </Suspense>
        )}
        
        {/* Visit Display - visible in hero (small) and footer (zoomed) */}
        {showVisit && (
          <Suspense fallback={null}>
            <VisitDisplay />
          </Suspense>
        )}
      </group>
    </>
  );
};

export const Experience = () => {
  return (
    <Suspense fallback={null}>
      <ExperienceInner />
    </Suspense>
  );
};

export default Experience;
