import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural 3D Space Station (Mission Control Hub) at the Launch Pad.
 * Replaces the simple placeholder orbits with rich structural details:
 * reactor columns, torus docking bays, radial spoke trusses, solar array grids,
 * vertical sensor masts, and revolving security cargo drones.
 */
export default function LaunchPadPlanet({ position, radius }) {
  const stationRef = useRef();
  const ringRef = useRef();
  const droneRef = useRef();

  useFrame((state, delta) => {
    // Rotate inner docking torus ring slightly
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.12;
    }
    // Rotate entire space station core slowly
    if (stationRef.current) {
      stationRef.current.rotation.y += delta * 0.04;
      stationRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.03;
    }
    // Command-controlled cargo drone orbiting the layout core
    if (droneRef.current) {
      const time = state.clock.getElapsedTime() * 1.2;
      const orbitDistance = radius + 3.8;
      droneRef.current.position.set(
        Math.cos(time) * orbitDistance,
        Math.sin(time * 0.6) * 1.5,
        Math.sin(time) * orbitDistance
      );
      droneRef.current.rotation.y += delta * 1.5;
    }
  });

  const spokeCount = 6;

  return (
    <group position={position} ref={stationRef}>
      {/* Central Reactor Support Core Column */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 5.0, 24]} />
        <meshStandardMaterial
          color="#0B0E1A"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Glowing Energy core inside column */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.15, 1.15, 4.8, 16]} />
        <meshStandardMaterial
          color="#35F0D0"
          emissive="#35F0D0"
          emissiveIntensity={1.8}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Top and Bottom Station Shielding Plates */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[1.8, 1.4, 0.4, 16]} />
        <meshStandardMaterial color="#0B0E1A" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, -2.5, 0]}>
        <cylinderGeometry args={[1.4, 1.8, 0.4, 16]} />
        <meshStandardMaterial color="#0B0E1A" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Main Docking Torus Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius + 2.0, 0.35, 16, 64]} />
        <meshStandardMaterial
          color="#05060B"
          emissive="#7C5CFF"
          emissiveIntensity={0.25}
          roughness={0.4}
          metalness={0.7}
        />
      </mesh>

      {/* Spoke Trusses connecting docking ring to core */}
      {Array.from({ length: spokeCount }).map((_, i) => {
        const angle = (i / spokeCount) * Math.PI * 2;
        const length = radius + 2.0;
        return (
          <group key={i} rotation={[0, angle, 0]}>
            <mesh position={[length / 2, 0, 0]}>
              <boxGeometry args={[length, 0.12, 0.12]} />
              <meshStandardMaterial color="#1B8C7B" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Small flashing signal lights along the spokes */}
            <mesh position={[length - 0.5, 0.15, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial color="#35F0D0" />
            </mesh>
          </group>
        );
      })}

      {/* Solar Panel Wings (Right support) */}
      <group position={[3.8, 1.2, 0]} rotation={[0, 0, 0.1]}>
        <mesh position={[-0.8, 0, 0]}>
          <boxGeometry args={[1.6, 0.12, 0.12]} />
          <meshStandardMaterial color="#35F0D0" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 0.04, 3.2]} />
          <meshStandardMaterial
            color="#FFB454"
            emissive="#FFB454"
            emissiveIntensity={0.25}
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>
        {/* Segmented panel grids */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[1.52, 0.02, 0.04]} />
          <meshBasicMaterial color="#0B0E1A" />
        </mesh>
        <mesh position={[0, 0.04, 0.8]}>
          <boxGeometry args={[1.52, 0.02, 0.04]} />
          <meshBasicMaterial color="#0B0E1A" />
        </mesh>
        <mesh position={[0, 0.04, -0.8]}>
          <boxGeometry args={[1.52, 0.02, 0.04]} />
          <meshBasicMaterial color="#0B0E1A" />
        </mesh>
      </group>

      {/* Solar Panel Wings (Left support) */}
      <group position={[-3.8, 1.2, 0]} rotation={[0, 0, -0.1]}>
        <mesh position={[0.8, 0, 0]}>
          <boxGeometry args={[1.6, 0.12, 0.12]} />
          <meshStandardMaterial color="#35F0D0" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 0.04, 3.2]} />
          <meshStandardMaterial
            color="#FFB454"
            emissive="#FFB454"
            emissiveIntensity={0.25}
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>
        {/* Segmented panel grids */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[1.52, 0.02, 0.04]} />
          <meshBasicMaterial color="#0B0E1A" />
        </mesh>
        <mesh position={[0, 0.04, 0.8]}>
          <boxGeometry args={[1.52, 0.02, 0.04]} />
          <meshBasicMaterial color="#0B0E1A" />
        </mesh>
        <mesh position={[0, 0.04, -0.8]}>
          <boxGeometry args={[1.52, 0.02, 0.04]} />
          <meshBasicMaterial color="#0B0E1A" />
        </mesh>
      </group>

      {/* Vertical Sensor Antennas & Blinking Beacons */}
      <mesh position={[0, 3.3, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.6, 8]} />
        <meshStandardMaterial color="#EAF6FF" metalness={0.9} />
      </mesh>
      {/* Pulsing Beacon Light */}
      <mesh position={[0, 4.1, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#FF5C7A" />
      </mesh>

      {/* Orbiting Security Cargo Drone */}
      <mesh ref={droneRef}>
        <boxGeometry args={[0.4, 0.22, 0.4]} />
        <meshStandardMaterial color="#7C5CFF" emissive="#35F0D0" emissiveIntensity={0.6} metalness={0.8} />
        {/* Cone thrust tail */}
        <group position={[0, 0, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <coneGeometry args={[0.1, 0.3, 8]} />
            <meshBasicMaterial color="#35F0D0" transparent opacity={0.5} />
          </mesh>
        </group>
      </mesh>

      {/* Core lights on the Space Station */}
      <pointLight color="#35F0D0" intensity={2.8} distance={12} decay={1.5} />
      <pointLight color="#7C5CFF" intensity={1.5} distance={8} decay={1.0} position={[0, -1.8, 0]} />
    </group>
  );
}
