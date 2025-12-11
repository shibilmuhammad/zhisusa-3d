"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, Suspense } from "react";
import { Group, Mesh, Color, TextureLoader } from "three";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { sceneSequence } from "@/animations/constants";
import { RoundedBox, useGLTF } from "@react-three/drei";

const easeInOutCubic = (t: number) => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const MorphingElement = () => {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const currentScene = useExperienceStore((state) => state.currentScene);
  const progress = useExperienceStore((state) => state.progress);

  const activeConfig = useMemo(
    () => sceneSequence.find((cfg) => cfg.key === currentScene) ?? sceneSequence[0],
    [currentScene]
  );

  const targetColor = useMemo(() => new Color(activeConfig.accentColor || "#92F0FF"), [activeConfig]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Ultra-smooth rotation based on scroll progress with easing
    const targetRotationY = progress * Math.PI * 2;
    const targetRotationX = Math.sin(progress * Math.PI) * 0.15;
    
    groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * delta * 2;
    groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * delta * 2;

    // Gentle breathing scale effect
    const pulse = 1 + Math.sin(Date.now() * 0.0008) * 0.02;
    const currentScale = groupRef.current.scale.x;
    const targetScale = pulse;
    groupRef.current.scale.setScalar(currentScale + (targetScale - currentScale) * delta * 3);
  });

  // 3D Model loader component
  const Model3D = ({ 
    url, 
    position = [0, 0, 0] as [number, number, number],
    rotation = [0, 0, 0] as [number, number, number],
    scale = 1 
  }) => {
    try {
      const { scene } = useGLTF(url);
      return (
        <primitive 
          object={scene.clone()} 
          position={position} 
          rotation={rotation} 
          scale={scale}
          castShadow
          receiveShadow
        />
      );
    } catch (error) {
      console.error("Error loading 3D model:", error);
      return null;
    }
  };

  // Photo card component - displays as a realistic photo frame with perfect liquid glass effect
  const PhotoCard = ({ 
    position = [0, 0, 0] as [number, number, number], 
    rotation = [0, 0, 0] as [number, number, number],
    scale = 1,
    imageUrl = "",
    aspectRatio = 1.5,
    title = ""
  }) => {
    const cardRef = useRef<Group>(null);
    const glassRef = useRef<Mesh>(null);
    
    // Create a vibrant gradient pattern based on the image URL hash
    const gradientColor = useMemo(() => {
      const hash = imageUrl.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
      const hue = Math.abs(hash) % 360;
      return `hsl(${hue}, 85%, 65%)`;
    }, [imageUrl]);

    // Ultra-smooth floating animation with multiple sine waves
    useFrame((state) => {
      if (!cardRef.current) return;
      const time = state.clock.getElapsedTime();
      
      // Gentle Y-axis float with offset based on position
      const floatY = Math.sin(time * 0.4 + position[0] * 2.5) * 0.06;
      const floatY2 = Math.sin(time * 0.6 + position[1] * 1.8) * 0.03;
      cardRef.current.position.y = floatY + floatY2;
      
      // Subtle rotation on Z axis
      const rotZ = Math.sin(time * 0.35 + position[1] * 2) * 0.015;
      cardRef.current.rotation.z = rotZ;
      
      // Micro X rotation for depth
      const rotX = Math.sin(time * 0.25 + position[0]) * 0.01;
      cardRef.current.rotation.x = rotX;

      // Animated glass shimmer
      if (glassRef.current && glassRef.current.material) {
        const material = glassRef.current.material as any;
        material.opacity = 0.15 + Math.sin(time * 0.8) * 0.05;
      }
    });

    return (
      <group ref={cardRef} position={position} rotation={rotation} scale={scale}>
        {/* Ultra-clear glass frame with perfect transmission */}
        <RoundedBox args={[aspectRatio, 1, 0.15]} radius={0.05} castShadow receiveShadow>
          <meshPhysicalMaterial 
            color="#ffffff"
            roughness={0.05}
            metalness={0.02}
            transparent
            opacity={0.18}
            transmission={0.95}
            thickness={0.8}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={2}
            ior={1.5}
            reflectivity={0.5}
          />
        </RoundedBox>
        
        {/* Inner shadow/depth effect */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[aspectRatio * 0.94, 0.94]} />
          <meshBasicMaterial 
            color="#000000"
            transparent
            opacity={0.08}
          />
        </mesh>
        
        {/* Photo content with enhanced colors */}
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[aspectRatio * 0.90, 0.90]} />
          <meshStandardMaterial 
            color={gradientColor}
            roughness={0.3}
            metalness={0.02}
            emissive={gradientColor}
            emissiveIntensity={0.15}
            toneMapped={false}
          >
            {imageUrl && (
              <primitive 
                attach="map" 
                object={new TextureLoader().load(imageUrl)} 
              />
            )}
          </meshStandardMaterial>
        </mesh>
        
        {/* Perfect liquid glass overlay with animated shimmer */}
        <mesh ref={glassRef} position={[0, 0, 0.085]}>
          <planeGeometry args={[aspectRatio * 0.90, 0.90]} />
          <meshPhysicalMaterial 
            color="#e8f4ff"
            roughness={0.01}
            metalness={0.05}
            transparent
            opacity={0.15}
            transmission={0.88}
            thickness={0.3}
            clearcoat={1}
            clearcoatRoughness={0.02}
            reflectivity={0.95}
            envMapIntensity={2.5}
            ior={1.45}
            sheen={0.5}
            sheenColor="#92F0FF"
          />
        </mesh>
        
        {/* Subtle edge highlight */}
        <mesh position={[0, 0, 0.095]}>
          <planeGeometry args={[aspectRatio * 0.94, 0.94]} />
          <meshBasicMaterial 
            color="#ffffff"
            transparent
            opacity={0.12}
            blending={2} // AdditiveBlending
          />
        </mesh>
        
        {/* Outer glow for depth */}
        <mesh position={[0, 0, 0.10]}>
          <planeGeometry args={[aspectRatio * 0.98, 0.98]} />
          <meshBasicMaterial 
            color="#92F0FF"
            transparent
            opacity={0.06}
            blending={2} // AdditiveBlending
          />
        </mesh>
      </group>
    );
  };

  // Render different photo displays based on current scene
  const renderGeometry = () => {
    switch (activeConfig.key) {
      case "hero":
        // Welcome - Nature & Mountain Views
        return (
          <group ref={meshRef as any}>
            <Suspense fallback={null}>
              {/* Main 3D scene - Low Poly Tree Scene */}
              <Model3D 
                url="/models/low_poly_tree_scene_free.glb"
                position={[0, -2, 0]}
                rotation={[0, 0, 0]}
                scale={0.8}
              />
            </Suspense>
            {/* Stunning nature welcome cards */}
            <PhotoCard 
              position={[-1.8, 0.8, 0.3]}
              rotation={[0.08, 0.28, -0.06]}
              scale={0.65}
              imageUrl="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=90"
              aspectRatio={1.4}
              title="Mountain Vista"
            />
            <PhotoCard 
              position={[1.7, -0.7, 0.25]}
              rotation={[-0.05, -0.25, 0.04]}
              scale={0.6}
              imageUrl="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&h=550&fit=crop&q=90"
              aspectRatio={1.3}
              title="Forest Path"
            />
          </group>
        );

      case "live":
        // Luxury Nature Accommodation - Cabins, Villas, Eco-Tents
        return (
          <group ref={meshRef as any}>
            {/* Main luxury cabin photo */}
            <PhotoCard 
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={1.5}
              imageUrl="https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=900&h=600&fit=crop&q=90"
              aspectRatio={1.7}
              title="Luxury Cabin Living"
            />
            {/* Cozy interior detail */}
            <PhotoCard 
              position={[-1.7, 0.9, 0.25]}
              rotation={[0, 0.2, -0.05]}
              scale={0.6}
              imageUrl="https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=700&h=600&fit=crop&q=90"
              aspectRatio={1.2}
              title="Cozy Interior"
            />
            {/* Eco-tent glamping */}
            <PhotoCard 
              position={[1.8, -0.8, 0.3]}
              rotation={[0, -0.3, 0.1]}
              scale={0.65}
              imageUrl="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=700&h=550&fit=crop&q=90"
              aspectRatio={1.3}
              title="Glamping Tent"
            />
          </group>
        );

      case "work":
        // Nature-Inspired Workspaces & Co-working Cabins
        return (
          <group ref={meshRef as any}>
            {/* Main workspace with nature view */}
            <PhotoCard 
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={1.5}
              imageUrl="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&h=600&fit=crop&q=90"
              aspectRatio={1.6}
              title="Work in Nature"
            />
            {/* Glass cabin workspace */}
            <PhotoCard 
              position={[-1.6, 0.7, 0.2]}
              rotation={[0.08, 0.25, -0.05]}
              scale={0.6}
              imageUrl="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=700&h=650&fit=crop&q=90"
              aspectRatio={1.1}
              title="Glass Cabin Office"
            />
            {/* Outdoor workspace */}
            <PhotoCard 
              position={[1.7, -0.75, 0.25]}
              rotation={[-0.06, -0.22, 0.04]}
              scale={0.58}
              imageUrl="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&h=600&fit=crop&q=90"
              aspectRatio={1.2}
              title="Outdoor Workspace"
            />
          </group>
        );

      case "leisure":
        // Leisure Activities - Lake, Campfire, Hiking, Yoga
        return (
          <group ref={meshRef as any}>
            {/* Main leisure - lakeside sunset */}
            <PhotoCard 
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={1.5}
              imageUrl="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=500&fit=crop&q=90"
              aspectRatio={1.9}
              title="Lakeside Serenity"
            />
            {/* Campfire gathering */}
            <PhotoCard 
              position={[-1.9, 0.85, 0.3]}
              rotation={[0.05, 0.28, -0.08]}
              scale={0.62}
              imageUrl="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=700&h=550&fit=crop&q=90"
              aspectRatio={1.3}
              title="Campfire Nights"
            />
            {/* Yoga in nature */}
            <PhotoCard 
              position={[1.85, -0.72, 0.28]}
              rotation={[-0.04, -0.26, 0.06]}
              scale={0.6}
              imageUrl="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&h=600&fit=crop&q=90"
              aspectRatio={1.2}
              title="Yoga Retreat"
            />
          </group>
        );

      case "booking":
        // Booking & Arrival - Welcome Experience
        return (
          <group ref={meshRef as any}>
            {/* Main arrival experience */}
            <PhotoCard 
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={1.4}
              imageUrl="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&h=650&fit=crop&q=90"
              aspectRatio={1.5}
              title="Your Arrival"
            />
            {/* Sunset welcome */}
            <PhotoCard 
              position={[-1.5, 0.75, 0.25]}
              rotation={[0, 0.2, -0.04]}
              scale={0.55}
              imageUrl="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=700&h=650&fit=crop&q=90"
              aspectRatio={1.1}
              title="Golden Hour"
            />
            {/* Path to cabin */}
            <PhotoCard 
              position={[1.6, -0.7, 0.22]}
              rotation={[0, -0.25, 0.05]}
              scale={0.58}
              imageUrl="https://images.unsplash.com/photo-1511497584788-876760111969?w=700&h=620&fit=crop&q=90"
              aspectRatio={1.15}
              title="Your Path"
            />
          </group>
        );

      case "gallery":
        // Gallery - Curated Moments & Experiences
        return (
          <group ref={meshRef as any}>
            {/* Center - sunrise over mountains */}
            <PhotoCard 
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={1.4}
              imageUrl="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=650&fit=crop&q=90"
              aspectRatio={1.4}
              title="Dawn Moments"
            />
            {/* Left - forest meditation */}
            <PhotoCard 
              position={[-1.6, 0.6, 0.15]}
              rotation={[0, 0.15, 0]}
              scale={0.7}
              imageUrl="https://images.unsplash.com/photo-1448375240586-882707db888b?w=700&h=700&fit=crop&q=90"
              aspectRatio={1.0}
              title="Forest Meditation"
            />
            {/* Right - starry night */}
            <PhotoCard 
              position={[1.5, 0.65, 0.18]}
              rotation={[0, -0.18, 0]}
              scale={0.68}
              imageUrl="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=700&h=750&fit=crop&q=90"
              aspectRatio={0.95}
              title="Starry Nights"
            />
            {/* Bottom - panoramic valley */}
            <PhotoCard 
              position={[0, -0.95, 0.2]}
              rotation={[0, 0, 0]}
              scale={0.62}
              imageUrl="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=580&fit=crop&q=90"
              aspectRatio={1.6}
              title="Valley Views"
            />
          </group>
        );

      case "footer":
        // Visit Us - Location & Journey
        return (
          <group ref={meshRef as any}>
            {/* Main - aerial valley view */}
            <PhotoCard 
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={1.5}
              imageUrl="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=550&fit=crop&q=90"
              aspectRatio={1.7}
              title="Find ZHISUSA"
            />
            {/* Mountain road journey */}
            <PhotoCard 
              position={[-1.7, 0.8, 0.25]}
              rotation={[0.06, 0.22, -0.04]}
              scale={0.6}
              imageUrl="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=700&h=600&fit=crop&q=90"
              aspectRatio={1.2}
              title="The Journey"
            />
            {/* Valley entrance */}
            <PhotoCard 
              position={[1.75, -0.75, 0.28]}
              rotation={[-0.04, -0.24, 0.05]}
              scale={0.62}
              imageUrl="https://images.unsplash.com/photo-1511497584788-876760111969?w=700&h=580&fit=crop&q=90"
              aspectRatio={1.25}
              title="Welcome Path"
            />
          </group>
        );

      default:
        return (
          <group ref={meshRef as any}>
            <PhotoCard 
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={1.5}
              imageUrl="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=600&fit=crop&q=90"
              aspectRatio={1.6}
              title="ZHISUSA"
            />
          </group>
        );
    }
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]} key={`morph-${activeConfig.key}`}>
      {renderGeometry()}
    </group>
  );
};
