import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Figma Design Planet: Renders floating 3D design frames and color plates
 * rotating around the planet core.
 */
export default function FigmaPlanet({ position, radius, color }) {
    const rotationRef = useRef();

    useFrame((state, delta) => {
        if (rotationRef.current) {
            rotationRef.current.rotation.y += delta * 0.15;
        }
    });

    const boardCount = 5;

    return (
        <group position={position}>
            {/* Outer spinning orbit gallery */}
            <group ref={rotationRef}>
                {Array.from({ length: boardCount }).map((_, i) => {
                    const angle = (i / boardCount) * Math.PI * 2;
                    const r = radius + 2.8;
                    const x = Math.cos(angle) * r;
                    const z = Math.sin(angle) * r;
                    const y = Math.sin(i * 1.5) * 1.5;

                    const panelColor = i % 2 === 0 ? '#35F0D0' : '#FF5C7A';

                    return (
                        <group key={i} position={[x, y, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
                            {/* Board frame boundary */}
                            <mesh>
                                <boxGeometry args={[1.6, 1.0, 0.05]} />
                                <meshStandardMaterial
                                    color="#0B0E1A"
                                    roughness={0.2}
                                    metalness={0.8}
                                    emissive={panelColor}
                                    emissiveIntensity={0.2}
                                />
                            </mesh>
                            {/* Inner glowing screen design layout */}
                            <mesh position={[0, 0, 0.035]}>
                                <boxGeometry args={[1.5, 0.9, 0.02]} />
                                <meshStandardMaterial
                                    color={panelColor}
                                    emissive={panelColor}
                                    emissiveIntensity={0.5}
                                    transparent
                                    opacity={0.7}
                                />
                            </mesh>
                            {/* Small structural wireframe shapes */}
                            <mesh position={[-0.4, 0.2, 0.05]}>
                                <sphereGeometry args={[0.1, 16, 16]} />
                                <meshBasicMaterial color="#EAF6FF" />
                            </mesh>
                            <mesh position={[0.3, -0.2, 0.05]}>
                                <boxGeometry args={[0.3, 0.15, 0.02]} />
                                <meshBasicMaterial color="#EAF6FF" />
                            </mesh>
                        </group>
                    );
                })}
            </group>

            {/* Planetary grid ring */}
            <mesh rotation={[Math.PI / 2.2, 0, 0]}>
                <torusGeometry args={[radius + 1.2, 0.08, 8, 48]} />
                <meshBasicMaterial color={color} transparent opacity={0.3} />
            </mesh>
        </group>
    );
}
