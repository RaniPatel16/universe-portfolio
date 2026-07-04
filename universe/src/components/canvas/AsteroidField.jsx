import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A belt of tumbling asteroids plus a couple of comets streaking past.
 * Purely decorative; scattered along the flight corridor between planets.
 */
export default function AsteroidField({ center = [0, 0, 0], count = 24, spread = 30 }) {
  const groupRef = useRef();

  const rocks = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        position: [
          center[0] + (Math.random() - 0.5) * spread,
          center[1] + (Math.random() - 0.5) * spread * 0.4,
          center[2] + (Math.random() - 0.5) * spread,
        ],
        scale: 0.2 + Math.random() * 0.6,
        speed: 0.2 + Math.random() * 0.5,
        axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
      })),
    [center, count, spread]
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((mesh, i) => {
      const r = rocks[i];
      mesh.rotateOnAxis(r.axis, delta * r.speed);
    });
  });

  return (
    <group ref={groupRef}>
      {rocks.map((r, i) => (
        <mesh key={i} position={r.position} scale={r.scale}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#6B7280" roughness={0.9} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}
