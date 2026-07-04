import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural 3D Flying Rockets component. Renders multiple space vessels
 * cruising and launching across the 3D canvas on different orbital path classes,
 * featuring flickering core thruster tail flames.
 */
export default function FlyingRockets({ count = 8 }) {
    return (
        <group>
            {Array.from({ length: count }).map((_, i) => (
                <RocketMesh key={i} index={i} />
            ))}
        </group>
    );
}

function RocketMesh({ index }) {
    const meshRef = useRef();
    const thrusterRef = useRef();

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        // Each ship has its own offset speed
        const speed = 0.35 + index * 0.1;
        const time = state.clock.getElapsedTime() * speed + index * 55;

        if (index % 3 === 0) {
            // 1. Orbital patrol paths around the space station hub
            const radiusX = 22 + index * 3.5;
            const radiusZ = 16 + index * 4.5;
            const x = Math.cos(time * 0.2) * radiusX;
            const z = Math.sin(time * 0.2) * radiusZ;
            const y = Math.sin(time * 0.4) * 4 - 3;
            meshRef.current.position.set(x, y, z);

            // Point in trajectory direction
            const dx = -Math.sin(time * 0.2) * radiusX;
            const dz = Math.cos(time * 0.2) * radiusZ;
            const angle = Math.atan2(dx, dz);
            meshRef.current.rotation.set(0, angle + Math.PI, Math.sin(time * 0.4) * 0.06);

        } else if (index % 3 === 1) {
            // 2. Warp corridors flying from deep space straight forward
            const zStart = -240;
            const zEnd = 60;
            const range = zEnd - zStart;
            const progress = ((time * 16) % range) / range;
            const z = zStart + progress * range;
            const x = -35 + (index * 12) + Math.cos(time * 0.5) * 5;
            const y = -12 + Math.sin(time * 0.7) * 4;
            meshRef.current.position.set(x, y, z);

            // Pitch slightly up/down based on oscillator derivative
            const dx = -Math.sin(time * 0.5) * 5 * 0.5;
            const dz = 16;
            const angle = Math.atan2(dx, dz);
            meshRef.current.rotation.set(0, angle, 0);

        } else {
            // 3. Vertical launch paths ascending from sector base decks
            const yStart = -45;
            const yEnd = 80;
            const range = yEnd - yStart;
            const progress = ((time * 10) % range) / range;
            const y = yStart + progress * range;
            const x = Math.cos(time * 0.8) * 8 + (index * 6) - 15;
            const z = Math.sin(time * 0.8) * 8 - 70;
            meshRef.current.position.set(x, y, z);

            // Point straight up
            meshRef.current.rotation.set(-Math.PI / 2, 0, time * 0.8);
        }

        // High frequency thruster flame shimmer
        if (thrusterRef.current) {
            thrusterRef.current.scale.setScalar(0.85 + Math.random() * 0.35);
        }
    });

    const bodyColor = index % 2 === 0 ? '#1B8C7B' : '#7C5CFF';
    const wingColor = '#05060B';

    return (
        <group ref={meshRef}>
            {/* Sleek Central Vessel Core */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.07, 0.22, 1.3, 8]} />
                <meshStandardMaterial color={bodyColor} roughness={0.4} metalness={0.8} />
            </mesh>

            {/* Nose cone assembly */}
            <mesh position={[0, 0, 0.65]} rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.07, 0.3, 8]} />
                <meshStandardMaterial color="#35F0D0" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Exhaust cylinder ring */}
            <mesh position={[0, 0, -0.65]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.15, 0.11, 0.1, 8]} />
                <meshStandardMaterial color="#0b0e1a" metalness={0.9} />
            </mesh>

            {/* Dynamic fire engine thruster tail */}
            <mesh ref={thrusterRef} position={[0, 0, -0.95]} rotation={[-Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.12, 0.6, 8]} />
                <meshBasicMaterial color="#FFB454" transparent opacity={0.9} />
            </mesh>

            {/* Jet Delta stabilizer wings */}
            <mesh position={[0.26, 0, -0.28]}>
                <boxGeometry args={[0.35, 0.02, 0.45]} />
                <meshStandardMaterial color={wingColor} roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[-0.26, 0, -0.28]}>
                <boxGeometry args={[0.35, 0.02, 0.45]} />
                <meshStandardMaterial color={wingColor} roughness={0.3} metalness={0.8} />
            </mesh>

            {/* Vertical cockpit fin */}
            <mesh position={[0, 0.18, -0.28]}>
                <boxGeometry args={[0.02, 0.35, 0.35]} />
                <meshStandardMaterial color="#35F0D0" metalness={0.9} roughness={0.3} />
            </mesh>
        </group>
    );
}
