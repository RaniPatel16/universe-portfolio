import { Suspense } from 'react';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import Galaxy from './Galaxy';
import Planet from './Planet';
import CameraRig from './CameraRig';
import AsteroidField from './AsteroidField';
import LaunchPadPlanet from './planets/LaunchPadPlanet';
import AboutPlanet from './planets/AboutPlanet';
import SkillsPlanet from './planets/SkillsPlanet';
import ProjectsPlanet from './planets/ProjectsPlanet';
import PlaceholderPlanet from './planets/PlaceholderPlanet';
import { PLANETS } from '../../lib/navigation';
import { useUniverseStore } from '../../store/useUniverseStore';

const DECORATIONS = {
    launchpad: LaunchPadPlanet,
    about: AboutPlanet,
    skills: SkillsPlanet,
    projects: ProjectsPlanet,
};

export default function Scene() {
    const activePlanetId = useUniverseStore((s) => s.activePlanetId);
    const travelTo = useUniverseStore((s) => s.travelTo);

    return (
        <Suspense fallback={null}>
            <Galaxy />

            {PLANETS.map((planet) => {
                const Decoration = DECORATIONS[planet.id] ?? PlaceholderPlanet;
                return (
                    <group key={planet.id}>
                        <Planet planet={planet} isActive={planet.id === activePlanetId} onSelect={travelTo} />
                        <Decoration position={planet.position} radius={planet.radius} color={planet.color} />
                    </group>
                );
            })}

            {/* Asteroid belts scattered along the flight corridor */}
            <AsteroidField center={[64, 0, -10]} count={18} spread={26} />
            <AsteroidField center={[200, 0, 30]} count={18} spread={30} />
            <AsteroidField center={[350, 0, 0]} count={18} spread={28} />

            <CameraRig />

            <EffectComposer>
                <Bloom intensity={0.7} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
                <ChromaticAberration offset={[0.0006, 0.0006]} />
                <Vignette eskil={false} offset={0.15} darkness={0.9} />
            </EffectComposer>
        </Suspense>
    );
}
