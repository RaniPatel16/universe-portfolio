import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * A light-weight orbiting-shard decoration used by every planet that
 * hasn't been fully built out yet. Swap this out for a dedicated
 * <XPlanet /> component (see AboutPlanet / SkillsPlanet / ProjectsPlanet
 * for the pattern) as you flesh out each section.
 */
export default function PlaceholderPlanet({ position, radius, color }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.08;
  });

  return (
    <group position={position}>
      <group ref={ref}>
        {[0, 1, 2].map((i) => {
          const angle = (i / 3) * Math.PI * 2;
          const r = radius + 3;
          return (
            <mesh key={i} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}>
              <tetrahedronGeometry args={[0.5, 0]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
