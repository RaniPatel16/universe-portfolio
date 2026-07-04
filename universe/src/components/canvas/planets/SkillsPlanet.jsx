import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
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

  return (
    <group position={position}>
      {crystals.map((c, i) => (
        <mesh key={c.name} ref={(el) => (refs.current[i] = el)}>
          <octahedronGeometry args={[0.45, 0]} />
          <meshStandardMaterial color="#FFB454" emissive="#FFB454" emissiveIntensity={0.5} metalness={0.6} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}
