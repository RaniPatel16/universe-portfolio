import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A procedurally-built ship (no external GLTF needed): a hull, wings,
 * a cockpit glow, and twin engine thrusters with a particle exhaust
 * trail that intensifies while traveling.
 */
export default function Spaceship({ traveling }) {
  const groupRef = useRef();
  const flameLeft = useRef();
  const flameRight = useRef();
  const particlesRef = useRef();

  const particleCount = 200;
  const particlePositions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 0.6;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
      arr[i * 3 + 2] = Math.random() * 6 + 1.5;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      // Idle hover bob + slight bank while traveling
      groupRef.current.position.y += Math.sin(t * 1.6) * 0.002;
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        traveling ? Math.sin(t * 2) * 0.05 : 0,
        0.05
      );
    }
    const flicker = 0.7 + Math.sin(t * 30) * 0.15 + (traveling ? 0.6 : 0);
    if (flameLeft.current) flameLeft.current.scale.set(1, flicker, 1);
    if (flameRight.current) flameRight.current.scale.set(1, flicker, 1);

    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      const speed = traveling ? 14 : 3;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 2] += delta * speed;
        if (positions[i * 3 + 2] > 8) positions[i * 3 + 2] = 1.2;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, Math.PI, 0]}>
      {/* Hull */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.9, 3.2, 8]} />
        <meshStandardMaterial color="#C7D6E5" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, 1.2]}>
        <cylinderGeometry args={[0.9, 0.7, 1.6, 8]} />
        <meshStandardMaterial color="#8FA3B8" metalness={0.85} roughness={0.3} />
      </mesh>

      {/* Cockpit glow */}
      <mesh position={[0, 0.3, -0.6]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#35F0D0" emissive="#35F0D0" emissiveIntensity={1.4} />
      </mesh>

      {/* Wings */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 1.4, -0.1, 1.4]} rotation={[0, 0, side * 0.25]}>
          <boxGeometry args={[1.6, 0.08, 1.4]} />
          <meshStandardMaterial color="#5D6E85" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}

      {/* Engine glow */}
      <mesh ref={flameLeft} position={[-0.55, 0, 2.1]}>
        <coneGeometry args={[0.22, 0.9, 12]} />
        <meshBasicMaterial color="#FFB454" transparent opacity={0.9} />
      </mesh>
      <mesh ref={flameRight} position={[0.55, 0, 2.1]}>
        <coneGeometry args={[0.22, 0.9, 12]} />
        <meshBasicMaterial color="#FFB454" transparent opacity={0.9} />
      </mesh>
      <pointLight position={[0, 0, 2.4]} color="#FFB454" intensity={traveling ? 4 : 1.5} distance={6} />

      {/* Exhaust particle trail */}
      <points ref={particlesRef} position={[0, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={particlePositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#35F0D0" size={0.06} transparent opacity={0.6} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}
