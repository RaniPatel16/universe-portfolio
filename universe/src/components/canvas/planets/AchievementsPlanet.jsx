import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Achievements Planet (Trophy City): Gleaming gold-colored towers and
 * spires that rotate on the planet's surface like a micro-metropolis.
 */
export default function AchievementsPlanet({ position, radius, color }) {
    const cityRef = useRef();

    useFrame((state, delta) => {
        if (cityRef.current) {
            cityRef.current.rotation.y += delta * 0.08;
        }
    });

    const towerCount = 6;

    return (
        <group position={position}>
            {/* Planetary core platform */}
            <mesh>
                <sphereGeometry args={[radius * 0.9, 16, 16]} />
                <meshStandardMaterial color="#0B0E1A" roughness={0.5} metalness={0.7} />
            </mesh>

            {/* Trophy City buildings */}
            <group ref={cityRef}>
                {Array.from({ length: towerCount }).map((_, i) => {
                    const angle = (i / towerCount) * Math.PI * 2;
                    const dist = radius - 0.2;
                    const x = Math.cos(angle) * dist;
                    const z = Math.sin(angle) * dist;
                    const height = 1.8 + (i % 3) * 0.8;

                    return (
                        <group key={i} position={[x, height / 2, z]} rotation={[0, -angle, 0]}>
                            {/* Golden tower spire */}
                            <mesh>
                                <cylinderGeometry args={[0.15, 0.3, height, 8]} />
                                <meshStandardMaterial
                                    color="#FFD700"
                                    emissive="#FFD700"
                                    emissiveIntensity={0.2}
                                    roughness={0.15}
                                    metalness={0.9}
                                />
                            </mesh>
                            {/* Beacon light on top of the spire */}
                            <mesh position={[0, height / 2 + 0.1, 0]}>
                                <sphereGeometry args={[0.08, 8, 8]} />
                                <meshBasicMaterial color="#EAF6FF" />
                            </mesh>
                        </group>
                    );
                })}
            </group>

            {/* Main central Trophy structure pointing upwards on the north pole */}
            <group position={[0, radius * 0.9 + 0.8, 0]}>
                <mesh>
                    <coneGeometry args={[0.45, 1.4, 8]} />
                    <meshStandardMaterial
                        color="#FFD700"
                        emissive="#FFB454"
                        emissiveIntensity={0.4}
                        roughness={0.1}
                        metalness={0.95}
                    />
                </mesh>
                {/* Floating Halo Ring above the trophy */}
                <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 2.5, 0, 0]}>
                    <torusGeometry args={[0.6, 0.05, 8, 24]} />
                    <meshBasicMaterial color="#FFB454" />
                </mesh>
            </group>

            <pointLight color="#FFB454" intensity={2.2} distance={10} position={[0, radius + 1, 0]} />
        </group>
    );
}
