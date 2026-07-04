import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Hackathons Planet (The Arena): A large cyber-arena style ring (torus topology)
 * with structural struts and rotating digital battle logs.
 */
export default function HackathonsPlanet({ position, radius, color }) {
    const rotationRef = useRef();

    useFrame((state, delta) => {
        if (rotationRef.current) {
            rotationRef.current.rotation.y += delta * 0.12;
            rotationRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
        }
    });

    const nodeCount = 5;

    return (
        <group position={position}>
            {/* Outer Floating Arena Rings */}
            <group ref={rotationRef}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[radius + 2.5, 0.15, 8, 48]} />
                    <meshStandardMaterial color="#0B0E1A" emissive={color} emissiveIntensity={0.25} />
                </mesh>

                {/* Diagonal Truss Struts connecting the arena */}
                {Array.from({ length: nodeCount }).map((_, i) => {
                    const angle = (i / nodeCount) * Math.PI * 2;
                    const r = radius + 2.5;
                    const x = Math.cos(angle) * r;
                    const z = Math.sin(angle) * r;

                    return (
                        <group key={i} position={[x, 0, z]} rotation={[0, -angle, 0.45]}>
                            {/* Strut cylinder */}
                            <mesh>
                                <cylinderGeometry args={[0.08, 0.08, 2.2, 8]} />
                                <meshStandardMaterial color={color} metalness={0.8} roughness={0.3} />
                            </mesh>

                            {/* Floating Arena data crystal */}
                            <mesh position={[0, 1.2, 0]} rotation={[0, state.clock.getElapsedTime(), 0]}>
                                <dodecahedronGeometry args={[0.35, 0]} />
                                <meshStandardMaterial
                                    color="#FFB454"
                                    emissive="#FFB454"
                                    emissiveIntensity={0.8}
                                    transparent
                                    opacity={0.85}
                                />
                            </mesh>
                        </group>
                    );
                })}
            </group>

            {/* Planetary Atmosphere shell */}
            <mesh scale={0.9}>
                <sphereGeometry args={[radius, 32, 32]} />
                <meshStandardMaterial color={color} transparent opacity={0.15} wireframe />
            </mesh>
        </group>
    );
}
