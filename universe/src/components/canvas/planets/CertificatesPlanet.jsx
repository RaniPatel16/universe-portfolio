import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Certificates Planet (The Museum): Renders a futuristic glass/wireframe
 * dome housing floating glowing certificates and plaques of achievements.
 */
export default function CertificatesPlanet({ position, radius, color }) {
    const domeRef = useRef();

    useFrame((state, delta) => {
        if (domeRef.current) {
            domeRef.current.rotation.y += delta * 0.1;
        }
    });

    const plaqueCount = 4;

    return (
        <group position={position}>
            {/* Geodesic holographic museum dome */}
            <mesh ref={domeRef}>
                <sphereGeometry args={[radius + 1.8, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.2}
                    metalness={0.9}
                    wireframe
                    transparent
                    opacity={0.4}
                />
            </mesh>

            {/* Floating Certificate Displays inside */}
            {Array.from({ length: plaqueCount }).map((_, i) => {
                const angle = (i / plaqueCount) * Math.PI * 2;
                const dist = radius - 0.4;
                const x = Math.cos(angle) * dist;
                const z = Math.sin(angle) * dist;
                const y = 0.5 + Math.sin(i * 2) * 0.5;

                return (
                    <group key={i} position={[x, y, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
                        {/* Museum pedestal base */}
                        <mesh position={[0, -y, 0]}>
                            <cylinderGeometry args={[0.2, 0.3, y * 2, 8]} />
                            <meshStandardMaterial color="#0B0E1A" roughness={0.5} metalness={0.7} />
                        </mesh>

                        {/* Glowing certificate frame */}
                        <mesh position={[0, 0.4, 0]} rotation={[-0.2, 0, 0]}>
                            <boxGeometry args={[1.2, 0.8, 0.08]} />
                            <meshStandardMaterial
                                color="#0B0E1A"
                                roughness={0.1}
                                metalness={0.8}
                                emissive={color}
                                emissiveIntensity={0.3}
                            />
                        </mesh>

                        {/* Glowing credential screen */}
                        <mesh position={[0, 0.4, 0.045]} rotation={[-0.2, 0, 0]}>
                            <boxGeometry args={[1.1, 0.7, 0.02]} />
                            <meshStandardMaterial
                                color="#EAF6FF"
                                emissive={color}
                                emissiveIntensity={0.6}
                                transparent
                                opacity={0.85}
                            />
                        </mesh>
                    </group>
                );
            })}

            {/* Center museum light beacon */}
            <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.4, 8]} />
                <meshStandardMaterial color="#0B0E1A" />
            </mesh>
            <pointLight color={color} intensity={2.5} distance={10} position={[0, 0.5, 0]} />
        </group>
    );
}
