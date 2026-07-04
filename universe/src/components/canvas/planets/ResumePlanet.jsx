import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Resume Planet (The Archive): Renders a giant glowing holographic
 * document board representing the user's resume, surrounded by data orbits.
 */
export default function ResumePlanet({ position, radius, color }) {
    const boardRef = useRef();

    useFrame((state, delta) => {
        if (boardRef.current) {
            boardRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.2;
            boardRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.15;
        }
    });

    const lineCount = 6;

    return (
        <group position={position}>
            {/* Background core grid sphere */}
            <mesh>
                <sphereGeometry args={[radius * 0.7, 16, 16]} />
                <meshStandardMaterial color="#0B0E1A" roughness={0.6} metalness={0.6} wireframe />
            </mesh>

            {/* Holographic Document panel */}
            <group ref={boardRef}>
                {/* Hologram Board Frame */}
                <mesh position={[0, 0.4, 0]}>
                    <boxGeometry args={[2.5, 3.4, 0.08]} />
                    <meshStandardMaterial
                        color="#05060B"
                        roughness={0.1}
                        metalness={0.9}
                        emissive={color}
                        emissiveIntensity={0.25}
                    />
                </mesh>

                {/* Hologram Screen */}
                <mesh position={[0, 0.4, 0.05]}>
                    <boxGeometry args={[2.3, 3.2, 0.02]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={0.4}
                        transparent
                        opacity={0.65}
                    />
                </mesh>

                {/* Text lines represented by neon horizontal boxes */}
                {Array.from({ length: lineCount }).map((_, i) => {
                    const y = 1.1 - i * 0.45;
                    const length = i === 0 ? 1.2 : i % 2 === 0 ? 1.8 : 1.5;
                    const xOffset = i === 0 ? -0.4 : 0;
                    return (
                        <mesh key={i} position={[xOffset, y, 0.065]}>
                            <boxGeometry args={[length, 0.08, 0.02]} />
                            <meshBasicMaterial color="#EAF6FF" />
                        </mesh>
                    );
                })}
            </group>

            {/* Glowing boundary circle */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[radius + 1.2, 0.06, 8, 36]} />
                <meshBasicMaterial color={color} transparent opacity={0.4} />
            </mesh>
        </group>
    );
}
