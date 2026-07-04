import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useUniverseStore } from '../../../store/useUniverseStore';
import { skills } from '../../../data/portfolioData';

const allSkills = [
  ...skills.frontend,
  ...skills.backend,
  ...skills.database,
  ...skills.tools,
];

/**
 * Skills Planet: every skill is a floating holographic crystal orbiting
 * the planet at a radius proportional to its proficiency level — the
 * more mastered a skill, the further out (and faster) its crystal orbits.
 */
export default function SkillsPlanet({ position, radius }) {
  const groupRef = useRef();

  const crystals = useMemo(
    () =>
      allSkills.map((skill, i) => ({
        ...skill,
        angle: (i / allSkills.length) * Math.PI * 2,
        orbitRadius: radius + 3 + (skill.level / 100) * 4,
        speed: 0.1 + (skill.level / 100) * 0.15,
        yOffset: Math.sin(i * 1.7) * 1.5,
      })),
    [radius]
  );

  const refs = useRef([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    crystals.forEach((c, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      const angle = c.angle + t * c.speed;
      mesh.position.set(Math.cos(angle) * c.orbitRadius, c.yOffset, Math.sin(angle) * c.orbitRadius);
      mesh.rotation.y += 0.01;
      mesh.rotation.x += 0.005;
    });
  });

  const panelOpen = useUniverseStore((s) => s.panelOpen);

  return (
    <group position={position}>
      {crystals.map((c, i) => (
        <group key={c.name} ref={(el) => (refs.current[i] = el)}>
          <mesh>
            <octahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial
              color="#FFB454"
              emissive="#FFB454"
              emissiveIntensity={0.5}
              metalness={0.6}
              roughness={0.2}
            />
          </mesh>
          {!panelOpen && (
            <Html center distanceFactor={28}>
              <div className="font-mono text-[8px] px-2 py-0.5 rounded-full bg-void/80 border border-solar/35 text-solar whitespace-nowrap shadow-glow-solar/10 pointer-events-none">
                {c.name}
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}
