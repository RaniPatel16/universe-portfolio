import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useUniverseStore } from '../../../store/useUniverseStore';
import { hackathons } from '../../../data/portfolioData';

export default function HackathonArenaPlanet({ position, radius, color }) {
    const planetRef = useRef();
    const stadiumRef = useRef();
    const ringGroupRef = useRef();
    const particlesRef = useRef();

    const hackathonsScanning = useUniverseStore((s) => s.hackathonsScanning);
    const hackathonsScanned = useUniverseStore((s) => s.hackathonsScanned);
    const hackathonsExplored = useUniverseStore((s) => s.hackathonsExplored);
    const focusedBoothId = useUniverseStore((s) => s.focusedBoothId);
    const setFocusedBooth = useUniverseStore((s) => s.setFocusedBooth);
    const exploreBooth = useUniverseStore((s) => s.exploreBooth);

    const activeTabId = useUniverseStore((s) => s.activeTabId);
    const setActiveTab = useUniverseStore((s) => s.setActiveTab);

    const [hoveredBoothId, setHoveredBoothId] = useState(null);

    // Check if all booths are explored
    const completed = hackathonsExplored.length >= hackathons.length && hackathons.length > 0;

    // Particle positions
    const particlesCount = 80;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = radius * 1.3 + Math.random() * 4.0;
        const h = (Math.random() - 0.5) * 5.0;
        positions[i * 3] = Math.cos(angle) * r;
        positions[i * 3 + 1] = h;
        positions[i * 3 + 2] = Math.sin(angle) * r;
    }

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();

        // Planet rotation
        if (planetRef.current) {
            planetRef.current.rotation.y += delta * 0.04;
        }

        // Rings rotating in opposite directions
        if (ringGroupRef.current) {
            ringGroupRef.current.children[0].rotation.z += delta * 0.15;
            ringGroupRef.current.children[1].rotation.z -= delta * 0.1;
            ringGroupRef.current.children[2].rotation.y += delta * 0.12;
        }

        // Float particles
        if (particlesRef.current) {
            particlesRef.current.rotation.y += delta * 0.02;
        }

        // Scan beam animation
        const scanBeam = stadiumRef.current?.getObjectByName('scanBeam');
        if (scanBeam) {
            if (hackathonsScanning) {
                scanBeam.visible = true;
                scanBeam.position.y = Math.sin(time * 6.0) * 1.5;
                scanBeam.scale.setScalar(1.0 + Math.sin(time * 12.0) * 0.05);
            } else {
                scanBeam.visible = false;
            }
        }
    });

    return (
        <group position={position}>
            {/* 3D Planet Base Shell */}
            <mesh ref={planetRef}>
                <sphereGeometry args={[radius, 32, 32]} />
                <meshStandardMaterial
                    color="#0c0e18"
                    roughness={0.75}
                    metalness={0.9}
                    emissive="#11132a"
                    emissiveIntensity={0.6}
                    wireframe
                />
            </mesh>

            {/* Floating Arena Particles */}
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[positions, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.12}
                    color={completed ? '#FFD700' : '#00FA9A'}
                    transparent
                    opacity={0.7}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Stadium Structure (Grid, Shields, Scan beams) */}
            <group ref={stadiumRef}>
                {/* Stadium Floor Ring */}
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                    <ringGeometry args={[radius * 1.05, radius * 1.7, 64]} />
                    <meshStandardMaterial
                        color="#14172f"
                        roughness={0.4}
                        metalness={0.8}
                        transparent
                        opacity={0.85}
                        side={THREE.DoubleSide}
                    />
                </mesh>

                {/* Outer Laser Shield Rim */}
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
                    <ringGeometry args={[radius * 1.7, radius * 1.73, 64]} />
                    <meshBasicMaterial
                        color={completed ? '#FFD700' : '#00FFFF'}
                        transparent
                        opacity={0.4}
                        side={THREE.DoubleSide}
                    />
                </mesh>

                {/* Cylinder Grid Shield */}
                <mesh position={[0, radius * 0.5, 0]}>
                    <cylinderGeometry args={[radius * 1.72, radius * 1.72, radius * 1.0, 32, 2, true]} />
                    <meshBasicMaterial
                        color={completed ? '#FFD700' : '#7C5CFF'}
                        transparent
                        opacity={0.06}
                        wireframe
                        side={THREE.DoubleSide}
                        depthWrite={false}
                    />
                </mesh>

                {/* Scan Laser Ring */}
                <mesh name="scanBeam" rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                    <ringGeometry args={[radius * 1.05, radius * 1.7, 32]} />
                    <meshBasicMaterial
                        color="#00FA9A"
                        transparent
                        opacity={0.4}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>

                {/* 4 Energy Pillars around the outer edge */}
                {[0, 1, 2, 3].map((i) => {
                    const angle = (i / 4) * Math.PI * 2;
                    const px = Math.cos(angle) * (radius * 1.68);
                    const pz = Math.sin(angle) * (radius * 1.68);
                    return (
                        <group key={`tower-${i}`} position={[px, 1.5, pz]}>
                            {/* Pillar Core */}
                            <mesh>
                                <cylinderGeometry args={[0.08, 0.08, 3.0, 8]} />
                                <meshStandardMaterial color="#222b45" metalness={0.9} roughness={0.1} />
                            </mesh>
                            {/* Blinking Top Jewel */}
                            <mesh position={[0, 1.55, 0]}>
                                <sphereGeometry args={[0.15, 8, 8]} />
                                <meshBasicMaterial color={completed ? '#FFD700' : '#00FFFF'} />
                            </mesh>
                            <pointLight color={completed ? '#FFD700' : '#00FFFF'} intensity={1.5} distance={6} />
                            {/* Volumetric Beacon Cylinder */}
                            <mesh position={[0, 4.0, 0]}>
                                <cylinderGeometry args={[0.02, 0.25, 5.0, 8, 1, true]} />
                                <meshBasicMaterial
                                    color={completed ? '#FFD700' : '#00FFFF'}
                                    transparent
                                    opacity={0.12}
                                    blending={THREE.AdditiveBlending}
                                    side={THREE.DoubleSide}
                                    depthWrite={false}
                                />
                            </mesh>
                        </group>
                    );
                })}
            </group>

            {/* Dynamic Concentric Hologram Rings (Rotate around core) */}
            <group ref={ringGroupRef}>
                <mesh rotation={[Math.PI / 4, 0, 0]}>
                    <ringGeometry args={[radius * 1.75, radius * 1.77, 64]} />
                    <meshBasicMaterial color={completed ? '#FFD700' : '#FF1493'} transparent opacity={0.3} side={THREE.DoubleSide} />
                </mesh>
                <mesh rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
                    <ringGeometry args={[radius * 1.81, radius * 1.83, 64]} />
                    <meshBasicMaterial color={completed ? '#FFD700' : '#00FA9A'} transparent opacity={0.25} side={THREE.DoubleSide} />
                </mesh>
                <mesh rotation={[Math.PI / 2, -Math.PI / 6, 0]}>
                    <ringGeometry args={[radius * 1.9, radius * 1.92, 64]} />
                    <meshBasicMaterial color={completed ? '#FFD700' : '#1E90FF'} transparent opacity={0.2} side={THREE.DoubleSide} />
                </mesh>
            </group>

            {/* Orbiting Maintenance Drones & Satellite */}
            {hackathonsScanned && (
                <>
                    <DroneElement index={0} radius={radius * 2.1} speed={0.14} offset={0} height={1.2} />
                    <DroneElement index={1} radius={radius * 2.3} speed={-0.18} offset={Math.PI / 2} height={-1.5} />
                    <DroneElement index={2} radius={radius * 2.0} speed={0.22} offset={Math.PI} height={0.5} />
                    <SatelliteElement radius={radius * 2.5} speed={0.08} />
                </>
            )}

            {/* Central Holographic Trophy & Interactive Tab Buttons */}
            {hackathonsScanned && (
                <group position={[0, 2.5, 0]}>
                    <CentralTrophy completed={completed} />

                    {/* Floating interactive Tab buttons orbiting the trophy */}
                    {[
                        { id: 'demo', label: '🎥 Demo', angle: 0 },
                        { id: 'trailer', label: '📽 Trailer', angle: Math.PI / 2 },
                        { id: 'architecture', label: '📊 Schema', angle: Math.PI },
                        { id: 'slides', label: '📄 Slides', angle: (Math.PI * 3) / 2 },
                    ].map((tab) => {
                        const tx = Math.cos(tab.angle) * 1.8;
                        const tz = Math.sin(tab.angle) * 1.8;
                        const isActive = activeTabId === tab.id;

                        return (
                            <group key={tab.id} position={[tx, 0.4, tz]}>
                                <mesh
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveTab(tab.id);
                                    }}
                                >
                                    <boxGeometry args={[0.65, 0.25, 0.08]} />
                                    <meshStandardMaterial
                                        color={isActive ? '#00FA9A' : '#1e293b'}
                                        emissive={isActive ? '#00FA9A' : '#0c1020'}
                                        emissiveIntensity={isActive ? 1.5 : 0.2}
                                        roughness={0.2}
                                        metalness={0.8}
                                    />
                                </mesh>
                                <Html center distanceFactor={20} position={[0, 0, 0.06]} style={{ zIndex: 10 }}>
                                    <button
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`font-mono text-[7px] uppercase tracking-wider px-2 py-0.5 select-none pointer-events-auto rounded bg-void/90 border transition-all ${isActive
                                            ? 'text-neon border-neon shadow-neon'
                                            : 'text-white/50 border-white/10 hover:text-white/80 hover:border-white/30'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                </Html>
                            </group>
                        );
                    })}
                </group>
            )}

            {/* Radial Hackathon Booths Sited at their defined coordinates */}
            {hackathonsScanned &&
                hackathons.map((b) => {
                    const isHovered = hoveredBoothId === b.id;
                    const isFocused = focusedBoothId === b.id;
                    const explored = hackathonsExplored.includes(b.id);
                    const colorToUse = completed ? '#FFD700' : b.color;

                    return (
                        <BoothElement
                            key={b.id}
                            booth={b}
                            color={colorToUse}
                            isHovered={isHovered}
                            isFocused={isFocused}
                            explored={explored}
                            centerPosition={position}
                            onHover={setHoveredBoothId}
                            onClick={() => {
                                exploreBooth(b.id);
                            }}
                        />
                    );
                })}
        </group>
    );
}

// Subcomponent: Orbiting Drone
function DroneElement({ index, radius, speed, offset, height }) {
    const ref = useRef();
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const angle = offset + time * speed;
        if (ref.current) {
            ref.current.position.x = Math.cos(angle) * radius;
            ref.current.position.z = Math.sin(angle) * radius;
            ref.current.position.y = height + Math.sin(time * 1.5 + index) * 0.4;
            ref.current.rotation.y += 0.03;
            ref.current.rotation.z += 0.01;
        }
    });

    return (
        <group ref={ref}>
            <mesh>
                <octahedronGeometry args={[0.16, 0]} />
                <meshBasicMaterial color="#00FFFF" wireframe />
            </mesh>
            <mesh position={[0, -0.15, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.4]} />
                <meshBasicMaterial color="#00FFFF" transparent opacity={0.6} />
            </mesh>
            <pointLight color="#00FFFF" intensity={0.8} distance={3} />
        </group>
    );
}

// Subcomponent: Orbiting Transmission Satellite
function SatelliteElement({ radius, speed }) {
    const ref = useRef();
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const angle = time * speed;
        if (ref.current) {
            ref.current.position.x = Math.cos(angle) * radius;
            ref.current.position.z = Math.sin(angle) * radius;
            ref.current.position.y = 2.0 + Math.sin(time * 0.5) * 0.8;
            ref.current.rotation.y += 0.01;
            ref.current.rotation.x = Math.sin(time * 0.2) * 0.2;
        }
    });

    return (
        <group ref={ref}>
            {/* Central Satellite Dish sphere */}
            <mesh>
                <sphereGeometry args={[0.25, 8, 8]} />
                <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Left solar panel wing */}
            <mesh position={[-0.45, 0, 0]}>
                <boxGeometry args={[0.3, 0.15, 0.02]} />
                <meshStandardMaterial color="#0f766e" emissive="#0d9488" emissiveIntensity={0.3} />
            </mesh>
            {/* Right solar panel wing */}
            <mesh position={[0.45, 0, 0]}>
                <boxGeometry args={[0.3, 0.15, 0.02]} />
                <meshStandardMaterial color="#0f766e" emissive="#0d9488" emissiveIntensity={0.3} />
            </mesh>
            {/* Volumetric communications signal cone */}
            <mesh position={[0, -0.6, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.2, 0.8, 8, 1, true]} />
                <meshBasicMaterial color="#00FF88" transparent opacity={0.25} side={THREE.DoubleSide} wireframe />
            </mesh>
        </group>
    );
}

// Subcomponent: Central Trophy
function CentralTrophy({ completed }) {
    const ref = useRef();
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (ref.current) {
            ref.current.rotation.y = time * 0.95;
            ref.current.position.y = Math.sin(time * 1.5) * 0.15;
        }
    });

    const trophyColor = completed ? '#FFD700' : '#38bdf8';
    const emissiveColor = completed ? '#FFA500' : '#0369a1';

    return (
        <group ref={ref}>
            {/* Base */}
            <mesh position={[0, -0.3, 0]}>
                <cylinderGeometry args={[0.3, 0.35, 0.15, 16]} />
                <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
            </mesh>
            {/* Body cup */}
            <mesh position={[0, 0.05, 0]}>
                <cylinderGeometry args={[0.24, 0.06, 0.5, 16]} />
                <meshStandardMaterial
                    color={trophyColor}
                    emissive={emissiveColor}
                    emissiveIntensity={1.2}
                    roughness={0.1}
                    metalness={1.0}
                />
            </mesh>
            {/* Handles */}
            <mesh position={[-0.26, 0.1, 0]}>
                <torusGeometry args={[0.13, 0.03, 8, 24]} />
                <meshStandardMaterial color={trophyColor} metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0.26, 0.1, 0]}>
                <torusGeometry args={[0.13, 0.03, 8, 24]} />
                <meshStandardMaterial color={trophyColor} metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Top crown jewel */}
            <mesh position={[0, 0.42, 0]}>
                <octahedronGeometry args={[0.14]} />
                <meshBasicMaterial color={completed ? '#FFD700' : '#00FA9A'} />
            </mesh>
            <pointLight color={trophyColor} intensity={2.0} distance={8} />
        </group>
    );
}

// Subcomponent: Radial Booth Element
function BoothElement({
    booth,
    color,
    isHovered,
    isFocused,
    explored,
    centerPosition,
    onHover,
    onClick,
}) {
    const boothGroupRef = useRef();

    const setFocusedBooth = useUniverseStore((s) => s.setFocusedBooth);
    const focusedBoothPosition = useUniverseStore((s) => s.focusedBoothPosition);
    const activePhotoId = useUniverseStore((s) => s.activePhotoId);
    const setActivePhoto = useUniverseStore((s) => s.setActivePhoto);

    // Sync position of focused booth to Zustand store so CameraRig can lock in
    useEffect(() => {
        if (isFocused && !focusedBoothPosition) {
            if (boothGroupRef.current) {
                const localPos = boothGroupRef.current.position;
                const worldX = centerPosition[0] + localPos.x;
                const worldY = centerPosition[1] + localPos.y;
                const worldZ = centerPosition[2] + localPos.z;

                // Run in timeout to prevent Zustand dispatch loop warnings
                const timer = setTimeout(() => {
                    setFocusedBooth(booth.id, [worldX, worldY, worldZ]);
                }, 10);
                return () => clearTimeout(timer);
            }
        }
    }, [isFocused, focusedBoothPosition, booth.id, centerPosition, setFocusedBooth]);

    const handleSelect = (e) => {
        e.stopPropagation();
        if (boothGroupRef.current) {
            const localPos = boothGroupRef.current.position;
            const worldX = centerPosition[0] + localPos.x;
            const worldY = centerPosition[1] + localPos.y;
            const worldZ = centerPosition[2] + localPos.z;
            setFocusedBooth(booth.id, [worldX, worldY, worldZ]);
        }
        onClick();
    };

    useFrame((state) => {
        // Bob columns and rotate top hologram if not focused to save calculations
        if (boothGroupRef.current && !isFocused) {
            const time = state.clock.getElapsedTime();
            const bob = Math.sin(time * 2.0 + booth.id.charCodeAt(5)) * 0.05;
            boothGroupRef.current.position.y = booth.position[1] + bob;
        }
    });

    const displayScale = isFocused ? 1.05 : isHovered ? 1.05 : 1.0;

    return (
        <group ref={boothGroupRef} position={booth.position} scale={displayScale}>
            {/* Booth Kiosk Base Pillar */}
            <mesh
                onPointerOver={(e) => {
                    e.stopPropagation();
                    onHover(booth.id);
                    useUniverseStore.getState().triggerInteractionSpeech('hover_interactive', 'Interactive object detected.');
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    onHover(null);
                }}
                onClick={handleSelect}
            >
                <boxGeometry args={[1.6, 0.8, 1.6]} />
                <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Glowing Neon Stand frame */}
            <mesh position={[0, 0.45, 0]}>
                <boxGeometry args={[1.62, 0.1, 1.62]} />
                <meshBasicMaterial color={color} />
            </mesh>

            {/* Floating holographic billboard header */}
            <group position={[0, 1.4, 0]}>
                {/* Hologram Banner Screen */}
                <mesh>
                    <boxGeometry args={[1.5, 0.5, 0.05]} />
                    <meshBasicMaterial color={color} transparent opacity={0.15} wireframe />
                </mesh>
                {/* Border Glow */}
                <mesh position={[0, 0.25, 0]}>
                    <boxGeometry args={[1.52, 0.02, 0.07]} />
                    <meshBasicMaterial color={color} />
                </mesh>
                <mesh position={[0, -0.25, 0]}>
                    <boxGeometry args={[1.52, 0.02, 0.07]} />
                    <meshBasicMaterial color={color} />
                </mesh>
            </group>

            {/* Main light projector */}
            <pointLight color={color} intensity={isFocused ? 2.5 : isHovered ? 1.5 : 0.6} distance={6} />
            {/* Upward Volumetric Projection light cone */}
            <mesh position={[0, 1.0, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.3, 0.8, 1.2, 16, 1, true]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={isFocused ? 0.2 : isHovered ? 0.15 : 0.06}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* Name board HTML tag (hide when zoomed in to clean space) */}
            {!isFocused && (
                <Html position={[0, 1.9, 0]} center distanceFactor={22} style={{ zIndex: 10 }}>
                    <div
                        onClick={handleSelect}
                        className={`font-mono text-[7px] cursor-pointer uppercase tracking-wider px-1.5 py-0.5 rounded bg-void/90 backdrop-blur-sm whitespace-nowrap transition-colors flex items-center gap-1.5 border ${isHovered
                            ? 'text-alert border-alert bg-alert/10'
                            : explored
                                ? 'text-neon border-neon bg-neon/5'
                                : 'text-white/60 border-white/10'
                            }`}
                    >
                        <span
                            className={`w-1 h-1 rounded-full ${explored ? 'bg-neon animate-pulse' : 'bg-white/40'
                                }`}
                        />
                        {booth.name}
                    </div>
                </Html>
            )}

            {/* Explored Indicator Star (Show golden rings when completed) */}
            {explored && !isFocused && (
                <mesh position={[0, 0.6, 0]}>
                    <torusGeometry args={[0.2, 0.02, 8, 24]} />
                    <meshBasicMaterial color="#FFD700" />
                </mesh>
            )}

            {/* Mission Gallery Photo Frames (Visible only when Booth is focused) */}
            {isFocused && (
                <MissionGalleryFrames
                    photos={booth.photos}
                    boothWorldPosition={[
                        centerPosition[0] + booth.position[0],
                        centerPosition[1] + booth.position[1],
                        centerPosition[2] + booth.position[2],
                    ]}
                    boothColor={color}
                    activePhotoId={activePhotoId}
                    onSelectPhoto={(photoId, worldPos) => {
                        setActivePhoto(photoId, worldPos);
                    }}
                />
            )}
        </group>
    );
}

// Subcomponent: Mission Gallery floating photo frames
function MissionGalleryFrames({
    photos,
    boothWorldPosition,
    boothColor,
    activePhotoId,
    onSelectPhoto,
}) {
    const groupRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (groupRef.current) {
            // Slow rotation of the gallery halo
            groupRef.current.rotation.y = time * 0.08;
        }
    });

    return (
        <group ref={groupRef}>
            {photos.map((p, index) => {
                // Arrange 11 photos in a circle above the booth
                const angle = (index / photos.length) * Math.PI * 2;
                const radius = 2.4;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                // Bob heights individually for a floating effect
                const y = 2.5 + Math.sin(index * 1.5) * 0.2;

                const isPhotoActive = activePhotoId === p.id;
                const frameColor = isPhotoActive ? '#00FA9A' : boothColor;

                return (
                    <GalleryFrameItem
                        key={p.id}
                        photo={p}
                        position={[x, y, z]}
                        boothWorldPosition={boothWorldPosition}
                        frameColor={frameColor}
                        isPhotoActive={isPhotoActive}
                        onSelect={(worldPos) => {
                            onSelectPhoto(p.id, worldPos);
                        }}
                    />
                );
            })}
        </group>
    );
}

// Subcomponent: Single Floating Photo Frame Item
function GalleryFrameItem({ photo, position, boothWorldPosition, frameColor, isPhotoActive, onSelect }) {
    const ref = useRef();
    const setFocusedPhotoPosition = useUniverseStore((s) => s.setActivePhoto);

    const handleFrameClick = (e) => {
        e.stopPropagation();
        // Calculate global coordinates of this frame
        if (ref.current) {
            const parentRotY = ref.current.parent.rotation.y;
            // Coordinates after group rotation
            const localX = Math.cos(parentRotY) * position[0] - Math.sin(parentRotY) * position[2];
            const localZ = Math.sin(parentRotY) * position[0] + Math.cos(parentRotY) * position[2];

            const worldX = boothWorldPosition[0] + localX;
            const worldY = boothWorldPosition[1] + position[1];
            const worldZ = boothWorldPosition[2] + localZ;

            onSelect([worldX, worldY, worldZ]);
        }
    };

    useFrame((state) => {
        // Face the central focused axis
        if (ref.current) {
            ref.current.rotation.y += 0.02;
        }
    });

    return (
        <group ref={ref} position={position}>
            {/* Clickable Card Frame Mesh */}
            <mesh onClick={handleFrameClick}>
                <boxGeometry args={[0.35, 0.45, 0.02]} />
                <meshStandardMaterial
                    color="#101827"
                    emissive={frameColor}
                    emissiveIntensity={isPhotoActive ? 2.0 : 0.3}
                    metalness={0.7}
                    roughness={0.2}
                    transparent
                    opacity={0.9}
                />
            </mesh>
            {/* Wireframe holographic overlay border */}
            <mesh position={[0, 0, 0.015]} onClick={handleFrameClick}>
                <boxGeometry args={[0.37, 0.47, 0.005]} />
                <meshBasicMaterial color={frameColor} wireframe />
            </mesh>

            {/* Mini Image description tag */}
            <Html position={[0, -0.32, 0]} center distanceFactor={18} style={{ zIndex: 10 }}>
                <div
                    onClick={handleFrameClick}
                    className={`font-mono text-[6px] uppercase tracking-wider px-1.5 py-0.5 rounded glass-panel cursor-pointer select-none transition-colors border ${isPhotoActive
                        ? 'text-neon border-neon bg-neon/15'
                        : 'text-white/40 border-white/5 bg-void/50'
                        }`}
                >
                    {photo.category}
                </div>
            </Html>

            {/* Spark glow */}
            <pointLight color={frameColor} intensity={isPhotoActive ? 1.5 : 0.2} distance={2.5} />
        </group>
    );
}
