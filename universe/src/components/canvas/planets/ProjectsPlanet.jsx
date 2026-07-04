import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { projects } from '../../../data/portfolioData';
import { useUniverseStore } from '../../../store/useUniverseStore';

/**
 * Projects Planet: a small cyber-city ring where every building is one
 * project. Clicking a building opens the Project detail modal (handled
 * globally via the store).
 */
export default function ProjectsPlanet({ position, radius }) {
  const groupRef = useRef();
  const openProject = useUniverseStore((s) => s.openProject);
  const [hoveredId, setHoveredId] = useState(null);

  const buildings = useMemo(
    () =>
      projects.map((p, i) => {
        const angle = (i / projects.length) * Math.PI * 2;
        const r = radius + 3;
        const height = 1.6 + ((i * 37) % 10) / 5; // deterministic pseudo-random height
        return { ...p, angle, r, height };
      }),
    [radius]
  );

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.03;
  });

  const panelOpen = useUniverseStore((s) => s.panelOpen);

  return (
    <group position={position}>
      <group ref={groupRef}>
        {buildings.map((b) => {
          const x = Math.cos(b.angle) * b.r;
          const z = Math.sin(b.angle) * b.r;
          const hovered = hoveredId === b.id;
          return (
            <group key={b.id} position={[x, b.height / 2, z]}>
              <mesh
                onPointerOver={() => setHoveredId(b.id)}
                onPointerOut={() => setHoveredId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  openProject(b.id);
                }}
              >
                <boxGeometry args={[1, b.height, 1]} />
                <meshStandardMaterial
                  color={hovered ? '#FF5C7A' : '#2B3550'}
                  emissive="#FF5C7A"
                  emissiveIntensity={hovered ? 0.7 : 0.2}
                  metalness={0.6}
                  roughness={0.3}
                />
              </mesh>
              {!panelOpen && (
                <Html position={[0, b.height / 2 + 0.6, 0]} center distanceFactor={30}>
                  <div
                    className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded glass-panel whitespace-nowrap transition-colors ${hovered ? 'text-alert border-alert/60' : 'text-white/60'
                      }`}
                  >
                    {b.title}
                  </div>
                </Html>
              )}
            </group>
          );
        })}
      </group>
    </group>
  );
}
