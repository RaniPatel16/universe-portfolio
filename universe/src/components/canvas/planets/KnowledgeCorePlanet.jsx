import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useUniverseStore } from '../../../store/useUniverseStore';
import { certificates } from '../../../data/portfolioData';

export default function KnowledgeCorePlanet({ position, radius, color }) {
    const planetRef = useRef();
    const domeRef = useRef();
    const ring1Ref = useRef();
    const ring2Ref = useRef();
    const scanBeamRef = useRef();

    const activePlanetId = useUniverseStore((s) => s.activePlanetId);
    const focusedCertificateId = useUniverseStore((s) => s.focusedCertificateId);
    const setFocusedCertificate = useUniverseStore((s) => s.setFocusedCertificate);
    const exploreCertificate = useUniverseStore((s) => s.exploreCertificate);

    const certificatesScanning = useUniverseStore((s) => s.certificatesScanning);
    const certificatesScanned = useUniverseStore((s) => s.certificatesScanned);
    const certificatesExplored = useUniverseStore((s) => s.certificatesExplored);

    // Check if all certificates have been explored
    const completed = certificatesExplored.length >= certificates.length && certificates.length > 0;

    const [hoveredId, setHoveredId] = useState(null);

    // State to track rising animation of Master Golden Crystal
    const masterCrystalRef = useRef();

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();

        // Slow planetary rotations
        if (planetRef.current) {
            planetRef.current.rotation.y += delta * 0.05;
        }

        // Rotate energy dome
        if (domeRef.current) {
            domeRef.current.rotation.y -= delta * 0.02;
            domeRef.current.rotation.x += delta * 0.01;
        }

        // Holographic rings rotation speed increases when completed
        const ringSpeedMult = completed ? 3.5 : 1.0;
        if (ring1Ref.current) {
            ring1Ref.current.rotation.z += delta * 0.12 * ringSpeedMult;
            ring1Ref.current.rotation.x = Math.PI / 3 + Math.sin(time * 0.2) * 0.05;
        }
        if (ring2Ref.current) {
            ring2Ref.current.rotation.z -= delta * 0.08 * ringSpeedMult;
            ring2Ref.current.rotation.y = Math.PI / 4 + Math.cos(time * 0.2) * 0.05;
        }

        // Scanning cylinder animation
        if (certificatesScanning && scanBeamRef.current) {
            const beamCycle = Math.sin(time * 5.0) * (radius * 1.25);
            scanBeamRef.current.position.y = beamCycle;
            scanBeamRef.current.scale.x = 1.1 + Math.sin(time * 10) * 0.05;
            scanBeamRef.current.scale.z = 1.1 + Math.sin(time * 10) * 0.05;
        }

        // Master Crystal emergence
        if (completed && masterCrystalRef.current) {
            // Rise to top center
            const targetY = radius * 1.4;
            const currentY = masterCrystalRef.current.position.y;
            masterCrystalRef.current.position.y = THREE.MathUtils.lerp(currentY, targetY, delta * 2.0);
            masterCrystalRef.current.rotation.y += delta * 1.5;
            masterCrystalRef.current.scale.setScalar(1.2 + Math.sin(time * 3) * 0.15);
        }
    });



    const orbitRadius = radius * 1.6;

    return (
        <group position={position}>
            {/* 3D Planet Shell base (Visual styling only; click handles via crystals/parent helper) */}
            <mesh ref={planetRef}>
                <sphereGeometry args={[radius, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.8}
                    metalness={0.9}
                    emissive="#2A1B60"
                    emissiveIntensity={0.5}
                    wireframe={true}
                />
            </mesh>

            {/* Glowing Energy Dome protected archives */}
            <mesh ref={domeRef}>
                <sphereGeometry args={[radius * 1.25, 32, 32]} />
                <meshBasicMaterial
                    color={completed ? '#FFD700' : '#35F0D0'}
                    transparent
                    opacity={completed ? 0.22 : 0.09}
                    wireframe={true}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* Scanning Laser Beam Ring / Cylinder */}
            {certificatesScanning && (
                <mesh ref={scanBeamRef}>
                    <cylinderGeometry args={[radius * 1.26, radius * 1.26, 0.15, 32, 1, true]} />
                    <meshBasicMaterial
                        color="#35F0D0"
                        transparent
                        opacity={0.65}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            )}

            {/* Holographic rings */}
            <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]}>
                <ringGeometry args={[radius * 1.35, radius * 1.38, 64]} />
                <meshBasicMaterial color={completed ? '#FFD700' : '#7C5CFF'} transparent opacity={0.4} side={THREE.DoubleSide} />
            </mesh>
            <mesh ref={ring2Ref} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                <ringGeometry args={[radius * 1.45, radius * 1.47, 64]} />
                <meshBasicMaterial color={completed ? '#FFD700' : '#35F0D0'} transparent opacity={0.35} side={THREE.DoubleSide} />
            </mesh>

            {/* Golden Master Knowledge Crystal (Emerges only upon completion) */}
            {completed && (
                <mesh
                    ref={masterCrystalRef}
                    position={[0, -radius, 0]}
                >
                    <octahedronGeometry args={[0.55, 0]} />
                    <meshStandardMaterial
                        color="#FFD700"
                        emissive="#FFB454"
                        emissiveIntensity={1.5}
                        roughness={0.1}
                        metalness={1.0}
                    />
                    <pointLight color="#FFD700" intensity={2.5} distance={15} />
                </mesh>
            )}

            {/* Orbiting helper drones / data cubes */}
            {certificatesScanned && Array.from({ length: 6 }).map((_, i) => {
                const offsetAngle = (i / 6) * Math.PI * 2;
                return (
                    <DroneElement
                        key={`drone-${i}`}
                        orbitRadius={radius * 1.9}
                        speed={0.18}
                        offsetAngle={offsetAngle}
                        heightOffset={Math.sin(i) * 1.5}
                    />
                );
            })}

            {/* Orbiting Knowledge Crystals (Render only after scanning is complete) */}
            {certificatesScanned && certificates.map((cert, index) => {
                const initialAngle = (index / certificates.length) * Math.PI * 2;
                const crystalColor = completed ? '#FFD700' : cert.color;
                const isHovered = hoveredId === cert.id;
                const isFocused = focusedCertificateId === cert.id;

                return (
                    <CrystalElement
                        key={cert.id}
                        index={index}
                        cert={cert}
                        initialAngle={initialAngle}
                        orbitRadius={orbitRadius}
                        crystalColor={crystalColor}
                        isHovered={isHovered}
                        isFocused={isFocused}
                        centerPosition={position}
                        onHover={setHoveredId}
                        onClick={() => {
                            // Smoothly transition camera focal points
                            exploreCertificate(cert.id);
                        }}
                    />
                );
            })}
        </group>
    );
}

// Subcomponent: Orbiting Helper Drone / Data Cube
function DroneElement({ orbitRadius, speed, offsetAngle, heightOffset }) {
    const meshRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const currentAngle = offsetAngle + time * speed;

        if (meshRef.current) {
            meshRef.current.position.x = Math.cos(currentAngle) * orbitRadius;
            meshRef.current.position.z = Math.sin(currentAngle) * orbitRadius;
            meshRef.current.position.y = heightOffset + Math.sin(time * 1.2 + offsetAngle) * 0.4;
            meshRef.current.rotation.y += 0.02;
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[0.15, 0.15, 0.15]} />
            <meshBasicMaterial color="#35F0D0" transparent opacity={0.6} wireframe />
        </mesh>
    );
}

// Subcomponent: Orbiting Knowledge Crystal
function CrystalElement({
    index,
    cert,
    initialAngle,
    orbitRadius,
    crystalColor,
    isHovered,
    isFocused,
    centerPosition,
    onHover,
    onClick
}) {
    const crystalGroupRef = useRef();
    const setFocusedCertificate = useUniverseStore((s) => s.setFocusedCertificate);
    const focusedCertificatePosition = useUniverseStore((s) => s.focusedCertificatePosition);

    // Sync 3D position to Zustand store state exactly once when selected (e.g. from orbit click or sidebar click)
    useEffect(() => {
        if (isFocused && !focusedCertificatePosition) {
            if (crystalGroupRef.current) {
                const localPos = crystalGroupRef.current.position;
                const worldX = centerPosition[0] + localPos.x;
                const worldY = centerPosition[1] + localPos.y;
                const worldZ = centerPosition[2] + localPos.z;
                // Run as a microtask/setTimeout to prevent React update-during-render warning
                const timer = setTimeout(() => {
                    setFocusedCertificate(cert.id, [worldX, worldY, worldZ]);
                }, 10);
                return () => clearTimeout(timer);
            }
        }
    }, [isFocused, focusedCertificatePosition, cert.id, centerPosition, setFocusedCertificate]);

    useFrame((state) => {
        // Freeze crystal completely during focused inspection to allow precise camera lookAt alignment
        if (isFocused) {
            if (crystalGroupRef.current) {
                crystalGroupRef.current.rotation.y += 0.005;
            }
            return;
        }

        const time = state.clock.getElapsedTime();
        const currentAngle = initialAngle + time * 0.085;

        if (crystalGroupRef.current) {
            const x = Math.cos(currentAngle) * orbitRadius;
            const z = Math.sin(currentAngle) * orbitRadius;
            const y = Math.sin(time + index) * 0.25 + index * 0.12;

            crystalGroupRef.current.position.set(x, y, z);
            crystalGroupRef.current.rotation.y += 0.015;
        }
    });

    const handleSelect = (e) => {
        e.stopPropagation();

        if (crystalGroupRef.current) {
            const localPos = crystalGroupRef.current.position;
            const worldX = centerPosition[0] + localPos.x;
            const worldY = centerPosition[1] + localPos.y;
            const worldZ = centerPosition[2] + localPos.z;
            setFocusedCertificate(cert.id, [worldX, worldY, worldZ]);
        }

        onClick();
    };

    // Holographic sizing
    const scaleScalar = isFocused ? 1.6 : isHovered ? 1.3 : 1.0;

    return (
        <group ref={crystalGroupRef}>
            <mesh
                onPointerOver={(e) => {
                    e.stopPropagation();
                    onHover(cert.id);
                    useUniverseStore.getState().triggerInteractionSpeech('hover_interactive', 'Interactive object detected.');
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    onHover(null);
                }}
                onClick={handleSelect}
                scale={scaleScalar}
            >
                <octahedronGeometry args={[0.3, 0]} />
                <meshStandardMaterial
                    color={crystalColor}
                    emissive={crystalColor}
                    emissiveIntensity={isFocused ? 1.8 : isHovered ? 1.2 : 0.4}
                    roughness={0.15}
                    metalness={0.9}
                />
            </mesh>

            {/* Halo energy ring underneath focused crystal */}
            {isFocused && (
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.45, 0.48, 32]} />
                    <meshBasicMaterial color={crystalColor} transparent opacity={0.85} side={THREE.DoubleSide} />
                </mesh>
            )}

            <pointLight color={crystalColor} intensity={isFocused ? 2.5 : isHovered ? 1.5 : 0.3} distance={4} />
        </group>
    );
}
