import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useUniverseStore } from '../../store/useUniverseStore';

/**
 * A single planet: rotating sphere, optional ring, a soft atmosphere glow,
 * a floating label, and a hover state. Clicking it (or its label) travels
 * the ship there via onSelect.
 */
export default function Planet({ planet, isActive, onSelect }) {
  const phase = useUniverseStore((s) => s.phase);
  const meshRef = useRef();
  const ringRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.08;
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.02;
  });

  const panelOpen = useUniverseStore((s) => s.panelOpen);

  return (
    <group position={planet.position}>
      <mesh
        ref={meshRef}
        visible={planet.id !== 'launchpad'}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(planet.id);
        }}
      >
        <sphereGeometry args={[planet.radius, 48, 48]} />
        <meshStandardMaterial
          color={planet.color}
          roughness={0.55}
          metalness={0.3}
          emissive={planet.color}
          emissiveIntensity={hovered || isActive ? 0.5 : 0.18}
        />
      </mesh>

      {/* Atmosphere glow shell */}
      {planet.id !== 'launchpad' && (
        <mesh scale={1.18}>
          <sphereGeometry args={[planet.radius, 32, 32]} />
          <meshBasicMaterial color={planet.color} transparent opacity={hovered ? 0.18 : 0.1} side={THREE.BackSide} />
        </mesh>
      )}

      {planet.hasRing && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.4, 0, 0]}>
          <ringGeometry args={[planet.radius * 1.5, planet.radius * 2.1, 64]} />
          <meshBasicMaterial color={planet.color} transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
      )}

      <pointLight color={planet.color} intensity={hovered ? 3 : 1.4} distance={planet.radius * 8} />

      {phase === 'journey' && !panelOpen && (
        <Html position={[0, planet.radius + 2.5, 0]} center distanceFactor={40} occlude={false}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(planet.id);
            }}
            className={`whitespace-nowrap px-3 py-1 rounded-full font-mono text-[10px] tracking-widest uppercase border transition-all
              ${isActive ? 'border-ion text-ion shadow-glow-ion' : 'border-white/20 text-white/70 hover:border-ion/60 hover:text-ion'}
              glass-panel`}
          >
            {planet.label}
          </button>
        </Html>
      )}
    </group>
  );
}
