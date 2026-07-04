import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Social Planet (Signal Array): A transmitter mast with a blinking warning beacon
 * sending pulsing concentric rings (social signals) out into space.
 */
export default function SocialPlanet({ position, radius, color }) {
    const signalRef = useRef();
    const ringRef = useRef();

    useFrame((state, delta) => {
        if (signalRef.current) {
            signalRef.current.rotation.y += delta * 0.12;
        }
        if (ringRef.current) {
            // Pulse scale from 1.0 to 2.2
            const s = 1.0 + (state.clock.getElapsedTime() * 1.5 % 1.5);
            ringRef.current.scale.set(s, s, s);
            // Fade out as it expands
            ringRef.current.material.opacity = THREE.MathUtils.lerp(0.8, 0, (s - 1.0) / 1.5);
        }
    });

    return (
        <group position={position}>
            {/* Small dark core planet */}
            <mesh>
                <sphereGeometry args={[radius * 0.7, 16, 16]} />
                <meshStandardMaterial color="#0B0E1A" roughness={0.4} metalness={0.7} />
            </mesh>

            {/* Signal transmitter array */}
            <group ref={signalRef}>
                {/* Lattice tower base */}
                <mesh position={[0, radius * 0.5, 0]}>
                    <cylinderGeometry args={[0.08, 0.22, 2.2, 8]} />
                    <meshStandardMaterial color={color} metalness={0.9} roughness={0.2} />
                </mesh>
                {/* Horizontal transmitter rails */}
                <mesh position={[0, radius * 0.5 + 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
                    <meshStandardMaterial color="#05060B" />
                </mesh>
                <mesh position={[0, radius * 0.5 - 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.05, 0.05, 1.6, 8]} />
                    <meshStandardMaterial color="#05060B" />
                </mesh>
            </group>

            {/* Pulsing signal wave ring */}
            <mesh ref={ringRef} position={[0, radius * 0.5 + 1.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.2, 0.04, 8, 36]} />
                <meshBasicMaterial color="#FF5C7A" transparent opacity={0.8} />
            </mesh>

            {/* Pulsing energy orb peak */}
            <mesh position={[0, radius * 0.5 + 1.1, 0]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshBasicMaterial color="#FF5C7A" />
            </mesh>

            <pointLight color={color} intensity={2.5} distance={10} position={[0, radius, 0]} />
        </group>
    );
}
