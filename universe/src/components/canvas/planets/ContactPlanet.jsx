import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Contact Planet (Communication Station): Renders rotating high-gain satellite
 * dishes, structural beams, and a vertical laser signal beam pointing outwards.
 */
export default function ContactPlanet({ position, radius, color }) {
    const stationRef = useRef();

    useFrame((state, delta) => {
        if (stationRef.current) {
            stationRef.current.rotation.y += delta * 0.08;
        }
    });

    return (
        <group position={position}>
            {/* Base planetary station shell */}
            <mesh>
                <sphereGeometry args={[radius * 0.75, 16, 16]} />
                <meshStandardMaterial color="#0B0E1A" roughness={0.4} metalness={0.8} />
            </mesh>

            <group ref={stationRef}>
                {/* Central tower mast */}
                <mesh position={[0, radius * 0.5, 0]}>
                    <cylinderGeometry args={[0.15, 0.25, 2.0, 8]} />
                    <meshStandardMaterial color="#1B8C7B" metalness={0.9} />
                </mesh>

                {/* Transceiver Satellite Dish 1 (Facing +X) */}
                <group position={[radius * 0.7, 0.4, 0]} rotation={[0, 0, -Math.PI / 4]}>
                    <mesh>
                        <cylinderGeometry args={[0.06, 0.06, 0.6, 8]} />
                        <meshStandardMaterial color="#0B0E1A" metalness={0.9} />
                    </mesh>
                    <mesh position={[0, 0.3, 0]}>
                        <coneGeometry args={[0.6, 0.3, 16]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} metalness={0.7} />
                    </mesh>
                </group>

                {/* Transceiver Satellite Dish 2 (Facing -X) */}
                <group position={[-radius * 0.7, 0.4, 0]} rotation={[0, 0, Math.PI / 4]}>
                    <mesh>
                        <cylinderGeometry args={[0.06, 0.06, 0.6, 8]} />
                        <meshStandardMaterial color="#0B0E1A" metalness={0.8} />
                    </mesh>
                    <mesh position={[0, 0.3, 0]}>
                        <coneGeometry args={[0.6, 0.3, 16]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} metalness={0.7} />
                    </mesh>
                </group>
            </group>

            {/* Vertical upward transmitter signal beam */}
            <mesh position={[0, radius * 0.5 + 2.0, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 2.5, 8]} />
                <meshBasicMaterial color="#35F0D0" transparent opacity={0.75} />
            </mesh>

            {/* Blinking communication light peak */}
            <mesh position={[0, radius * 0.5 + 1.0, 0]}>
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshBasicMaterial color="#FF5C7A" />
            </mesh>

            <pointLight color={color} intensity={2.0} distance={8} position={[0, radius, 0]} />
        </group>
    );
}
