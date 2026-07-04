import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { about } from '../../../data/portfolioData';

/**
 * The Developer Planet: each timeline entry becomes a small glowing
 * node orbiting the planet, tracing the visitor's career-journey arc.
 */
export default function AboutPlanet({ position, radius }) {
  const orbitRef = useRef();

  useFrame((_, delta) => {
    if (orbitRef.current) orbitRef.current.rotation.y += delta * 0.06;
  });

  const nodes = about.timeline;

  return (
    <group position={position}>
      <group ref={orbitRef}>
        {nodes.map((node, i) => {
          const angle = (i / nodes.length) * Math.PI * 2;
          const r = radius + 4;
          return (
            <mesh key={node.year} position={[Math.cos(angle) * r, Math.sin(i) * 1.2, Math.sin(angle) * r]}>
              <icosahedronGeometry args={[0.4, 0]} />
              <meshStandardMaterial color="#7C5CFF" emissive="#7C5CFF" emissiveIntensity={0.6} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
