"use client";

export const OutdoorWorkspace = () => {
  return (
    <group position={[-5, 0, -3]}>
      {/* Wooden deck platform underneath table - grounded - realistic wood */}
      <mesh position={[0, 0.08, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.5, 0.15, 2.2, 8, 4, 8]} />
        <meshStandardMaterial
          color="#8a6f52"
          roughness={0.96}
          metalness={0}
          envMapIntensity={0.4}
        />
      </mesh>
      
      {/* Deck support beams */}
      <mesh position={[-1.1, -0.15, 0]} castShadow>
        <boxGeometry args={[0.15, 0.3, 2.2]} />
        <meshStandardMaterial color="#5a4332" roughness={0.98} />
      </mesh>
      <mesh position={[1.1, -0.15, 0]} castShadow>
        <boxGeometry args={[0.15, 0.3, 2.2]} />
        <meshStandardMaterial color="#5a4332" roughness={0.98} />
      </mesh>
      
      {/* Deck planks texture */}
      <mesh position={[-0.6, 0.09, 0]} castShadow>
        <boxGeometry args={[0.03, 0.02, 2.2]} />
        <meshStandardMaterial color="#6a5342" roughness={1} />
      </mesh>
      <mesh position={[0, 0.09, 0]} castShadow>
        <boxGeometry args={[0.03, 0.02, 2.2]} />
        <meshStandardMaterial color="#6a5342" roughness={1} />
      </mesh>
      <mesh position={[0.6, 0.09, 0]} castShadow>
        <boxGeometry args={[0.03, 0.02, 2.2]} />
        <meshStandardMaterial color="#6a5342" roughness={1} />
      </mesh>
      
      {/* Grass patch underneath deck */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow>
        <circleGeometry args={[1.8, 32]} />
        <meshStandardMaterial
          color="#3d5028"
          roughness={0.98}
          metalness={0}
        />
      </mesh>

      {/* Wooden table - now properly on deck */}
      <group position={[0, 0.15, 0]}>
        {/* Table top with wood grain - realistic detail */}
        <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.06, 0.85, 8, 2, 8]} />
          <meshStandardMaterial
            color="#7a5f3d"
            roughness={0.8}
            metalness={0.05}
            envMapIntensity={0.5}
          />
        </mesh>
        
        {/* Wood grain lines */}
        <mesh position={[-0.4, 0.96, 0]} castShadow>
          <boxGeometry args={[0.03, 0.01, 0.85]} />
          <meshStandardMaterial color="#5a3f2d" roughness={0.9} />
        </mesh>
        <mesh position={[0.2, 0.96, 0]} castShadow>
          <boxGeometry args={[0.03, 0.01, 0.85]} />
          <meshStandardMaterial color="#5a3f2d" roughness={0.9} />
        </mesh>

        {/* Table legs with realistic proportions - higher detail */}
        <mesh position={[-0.55, 0.48, -0.38]} castShadow receiveShadow>
          <cylinderGeometry args={[0.035, 0.04, 0.95, 16]} />
          <meshStandardMaterial color="#5a3f2d" roughness={0.88} envMapIntensity={0.4} />
        </mesh>
        <mesh position={[0.55, 0.48, -0.38]} castShadow receiveShadow>
          <cylinderGeometry args={[0.035, 0.04, 0.95, 16]} />
          <meshStandardMaterial color="#5a3f2d" roughness={0.88} envMapIntensity={0.4} />
        </mesh>
        <mesh position={[-0.55, 0.48, 0.38]} castShadow receiveShadow>
          <cylinderGeometry args={[0.035, 0.04, 0.95, 16]} />
          <meshStandardMaterial color="#5a3f2d" roughness={0.88} envMapIntensity={0.4} />
        </mesh>
        <mesh position={[0.55, 0.48, 0.38]} castShadow receiveShadow>
          <cylinderGeometry args={[0.035, 0.04, 0.95, 16]} />
          <meshStandardMaterial color="#5a3f2d" roughness={0.88} envMapIntensity={0.4} />
        </mesh>
        
        {/* Cross support beams under table */}
        <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.1, 0.04, 0.04]} />
          <meshStandardMaterial color="#5a3f2d" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.3, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[0.7, 0.04, 0.04]} />
          <meshStandardMaterial color="#5a3f2d" roughness={0.9} />
        </mesh>
      </group>

      {/* Comfortable wooden chair - grounded on deck */}
      <group position={[0, 0.15, -0.5]} rotation={[0, 0, 0]}>
        {/* Cushioned seat */}
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.52, 0.08, 0.52]} />
          <meshStandardMaterial 
            color="#7a5f3d" 
            roughness={0.75}
            metalness={0.05}
            envMapIntensity={0.4}
          />
        </mesh>
        
        {/* Seat cushion */}
        <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.48, 0.06, 0.48]} />
          <meshStandardMaterial 
            color="#c4a57b" 
            roughness={0.9}
            metalness={0}
          />
        </mesh>

        {/* Backrest with cushion */}
        <mesh position={[0, 0.98, -0.23]} castShadow receiveShadow>
          <boxGeometry args={[0.52, 0.65, 0.06]} />
          <meshStandardMaterial 
            color="#7a5f3d" 
            roughness={0.75}
            envMapIntensity={0.4}
          />
        </mesh>
        
        {/* Backrest cushion */}
        <mesh position={[0, 0.98, -0.2]} castShadow receiveShadow>
          <boxGeometry args={[0.48, 0.58, 0.04]} />
          <meshStandardMaterial 
            color="#c4a57b" 
            roughness={0.9}
          />
        </mesh>

        {/* Chair legs - realistic */}
        <mesh position={[-0.22, 0.3, -0.22]} castShadow receiveShadow>
          <cylinderGeometry args={[0.025, 0.03, 0.6, 12]} />
          <meshStandardMaterial color="#5a3f2d" roughness={0.85} envMapIntensity={0.3} />
        </mesh>
        <mesh position={[0.22, 0.3, -0.22]} castShadow receiveShadow>
          <cylinderGeometry args={[0.025, 0.03, 0.6, 12]} />
          <meshStandardMaterial color="#5a3f2d" roughness={0.85} envMapIntensity={0.3} />
        </mesh>
        <mesh position={[-0.22, 0.3, 0.22]} castShadow receiveShadow>
          <cylinderGeometry args={[0.025, 0.03, 0.6, 12]} />
          <meshStandardMaterial color="#5a3f2d" roughness={0.85} envMapIntensity={0.3} />
        </mesh>
        <mesh position={[0.22, 0.3, 0.22]} castShadow receiveShadow>
          <cylinderGeometry args={[0.025, 0.03, 0.6, 12]} />
          <meshStandardMaterial color="#5a3f2d" roughness={0.85} envMapIntensity={0.3} />
        </mesh>
        
        {/* Chair support bars */}
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.02, 0.02]} />
          <meshStandardMaterial color="#5a3f2d" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[0.4, 0.02, 0.02]} />
          <meshStandardMaterial color="#5a3f2d" roughness={0.9} />
        </mesh>
      </group>

      {/* Laptop on table */}
      <group position={[0, 1, 0]}>
        {/* Laptop base (keyboard part) */}
        <mesh position={[0, 0.01, 0.1]} receiveShadow>
          <boxGeometry args={[0.4, 0.02, 0.28]} />
          <meshStandardMaterial
            color="#2c3e50"
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>

        {/* Laptop screen */}
        <mesh position={[0, 0.15, -0.02]} rotation={[-Math.PI * 0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.25, 0.02]} />
          <meshStandardMaterial
            color="#1a1a1a"
            roughness={0.2}
            metalness={0.7}
          />
        </mesh>

        {/* Screen display (glowing blue) */}
        <mesh position={[0, 0.15, -0.01]} rotation={[-Math.PI * 0.15, 0, 0]}>
          <planeGeometry args={[0.35, 0.22]} />
          <meshStandardMaterial
            color="#4a90e2"
            emissive="#4a90e2"
            emissiveIntensity={0.5}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Coffee mug */}
      <group position={[0.35, 1, 0.2]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.04, 0.035, 0.08, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
        {/* Handle */}
        <mesh position={[0.045, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.025, 0.008, 8, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
      </group>

      {/* Person sitting and working */}
      <group position={[0, 0.6, -0.5]}>
        {/* Body (torso) */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.35, 0.5, 0.2]} />
          <meshStandardMaterial
            color="#3498db"
            roughness={0.8}
            metalness={0}
          />
        </mesh>

        {/* Head */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color="#d4a574"
            roughness={0.9}
            metalness={0}
          />
        </mesh>

        {/* Left arm (on table) */}
        <mesh position={[-0.18, 0.35, 0.25]} rotation={[Math.PI / 3, 0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.35]} />
          <meshStandardMaterial color="#3498db" roughness={0.8} />
        </mesh>

        {/* Right arm (on table) */}
        <mesh position={[0.18, 0.35, 0.25]} rotation={[Math.PI / 3, 0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.35]} />
          <meshStandardMaterial color="#3498db" roughness={0.8} />
        </mesh>

        {/* Legs (seated position) */}
        <mesh position={[-0.1, 0.1, -0.05]} rotation={[Math.PI / 2.5, 0, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.4]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.9} />
        </mesh>
        <mesh position={[0.1, 0.1, -0.05]} rotation={[Math.PI / 2.5, 0, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.4]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.9} />
        </mesh>
      </group>

      {/* Small potted plant on table for atmosphere */}
      <group position={[-0.45, 1, -0.25]}>
        {/* Pot */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.04, 0.08, 12]} />
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </mesh>
        {/* Plant leaves */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#2d5016" roughness={0.9} />
        </mesh>
      </group>

      {/* Notebook/papers */}
      <mesh position={[0.3, 1.17, -0.15]} rotation={[-Math.PI / 2, 0, Math.PI / 6]} receiveShadow>
        <planeGeometry args={[0.15, 0.2]} />
        <meshStandardMaterial
          color="#f5f5f5"
          roughness={0.9}
          metalness={0}
        />
      </mesh>
      
      {/* Decorative standing lamp next to workspace for ambience */}
      <group position={[-0.9, 0.15, 0.8]}>
        {/* Lamp base */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.18, 0.05, 16]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.5} metalness={0.7} />
        </mesh>
        
        {/* Lamp pole */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.8, 12]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.8} />
        </mesh>
        
        {/* Lamp shade */}
        <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
          <coneGeometry args={[0.25, 0.35, 16]} />
          <meshStandardMaterial 
            color="#e8dcc8" 
            roughness={0.8}
            metalness={0}
            emissive="#fff4e0"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Light bulb glow */}
        <pointLight
          position={[0, 1.6, 0]}
          intensity={0.8}
          distance={4}
          color="#fff4e0"
          castShadow
        />
      </group>
      
      {/* Beautiful flower pots around deck for atmosphere */}
      {/* Flower pot 1 - front left corner */}
      <group position={[-1.1, 0.15, 1]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.2, 12]} />
          <meshStandardMaterial color="#8B4513" roughness={0.85} />
        </mesh>
        {/* Pink flowers */}
        <mesh position={[0, 0.18, 0]} castShadow>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial 
            color="#ff6b9d" 
            roughness={0.8}
            emissive="#ff6b9d"
            emissiveIntensity={0.2}
          />
        </mesh>
        <mesh position={[0.05, 0.22, 0.03]} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#ffb3d9" roughness={0.8} />
        </mesh>
        <mesh position={[-0.04, 0.2, -0.03]} castShadow>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#ff8bb3" roughness={0.8} />
        </mesh>
        {/* Green leaves */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#2d5016" roughness={0.9} />
        </mesh>
      </group>
      
      {/* Flower pot 2 - front right corner */}
      <group position={[1.1, 0.15, 1]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.2, 12]} />
          <meshStandardMaterial color="#8B4513" roughness={0.85} />
        </mesh>
        {/* Yellow flowers */}
        <mesh position={[0, 0.18, 0]} castShadow>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial 
            color="#ffd700" 
            roughness={0.8}
            emissive="#ffd700"
            emissiveIntensity={0.2}
          />
        </mesh>
        <mesh position={[0.05, 0.22, 0.03]} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#ffeb3b" roughness={0.8} />
        </mesh>
        <mesh position={[-0.04, 0.2, -0.03]} castShadow>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#ffea00" roughness={0.8} />
        </mesh>
        {/* Green leaves */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#2d5016" roughness={0.9} />
        </mesh>
      </group>
      
      {/* Flower pot 3 - back right */}
      <group position={[1.1, 0.15, -0.9]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.2, 12]} />
          <meshStandardMaterial color="#8B4513" roughness={0.85} />
        </mesh>
        {/* Lavender/purple flowers */}
        <mesh position={[0, 0.18, 0]} castShadow>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial 
            color="#a78bfa" 
            roughness={0.8}
            emissive="#a78bfa"
            emissiveIntensity={0.2}
          />
        </mesh>
        <mesh position={[0.05, 0.22, 0.03]} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#c4b5fd" roughness={0.8} />
        </mesh>
        {/* Green leaves */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#2d5016" roughness={0.9} />
        </mesh>
      </group>
      
      {/* Stone path leading to workspace */}
      <mesh position={[0, -0.28, 1.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.22, 12]} />
        <meshStandardMaterial color="#6b6b6b" roughness={0.95} />
      </mesh>
      <mesh position={[-0.3, -0.28, 1.7]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.2, 12]} />
        <meshStandardMaterial color="#5b5b5b" roughness={0.95} />
      </mesh>
      <mesh position={[0.3, -0.28, 1.7]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.18, 12]} />
        <meshStandardMaterial color="#777777" roughness={0.95} />
      </mesh>
      
      {/* Small decorative lantern on table */}
      <group position={[-0.5, 1.17, -0.2]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.08, 8]} />
          <meshStandardMaterial 
            color="#2a2a2a" 
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
        {/* Lantern glow */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial 
            color="#ffd700" 
            emissive="#ffd700"
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>
      
      {/* Water bottle on table for realism */}
      <group position={[0.45, 1.17, 0.25]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.15, 16]} />
          <meshPhysicalMaterial 
            color="#e0f7fa"
            transmission={0.9}
            thickness={0.5}
            roughness={0.1}
            metalness={0}
            transparent
            opacity={0.3}
          />
        </mesh>
        {/* Bottle cap */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.032, 0.032, 0.02, 16]} />
          <meshStandardMaterial color="#0277bd" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>
      
      {/* Wooden deck railing for atmosphere */}
      {/* Front railing post */}
      <mesh position={[-1.2, 0.5, 1.1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.04, 0.04, 1, 12]} />
        <meshStandardMaterial color="#5a4332" roughness={0.9} envMapIntensity={0.3} />
      </mesh>
      <mesh position={[1.2, 0.5, 1.1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.04, 0.04, 1, 12]} />
        <meshStandardMaterial color="#5a4332" roughness={0.9} envMapIntensity={0.3} />
      </mesh>
      {/* Front rail */}
      <mesh position={[0, 0.9, 1.1]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.06, 0.06]} />
        <meshStandardMaterial color="#5a4332" roughness={0.9} envMapIntensity={0.3} />
      </mesh>
      
    </group>
  );
};

