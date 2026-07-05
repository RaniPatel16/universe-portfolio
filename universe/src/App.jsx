import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/canvas/Scene';
import LoadingScreen from './components/ui/LoadingScreen';
import IntroOverlay from './components/ui/IntroOverlay';
import HUD from './components/ui/HUD';
import PlanetPanel from './components/ui/PlanetPanel';
import ProjectModal from './components/ui/ProjectModal';
import CertificateModal from './components/ui/CertificateModal';
import CustomCursor from './components/ui/CustomCursor';
import BackgroundAudio from './components/ui/BackgroundAudio';
import { useUniverseStore } from './store/useUniverseStore';
import { getNextPlanet, getPrevPlanet } from './lib/navigation';

export default function App() {
  const phase = useUniverseStore((s) => s.phase);
  const activePlanetId = useUniverseStore((s) => s.activePlanetId);
  const isTraveling = useUniverseStore((s) => s.isTraveling);
  const travelTo = useUniverseStore((s) => s.travelTo);

  useEffect(() => {
    if (phase !== 'journey') return;

    let lastScrollTime = 0;

    const handleWheel = (e) => {
      // If we are scrolling inside the sidebar or modal, don't trigger planet travel
      if (
        e.target.closest('aside') ||
        e.target.closest('.glass-panel') ||
        e.target.closest('dialog') ||
        e.target.closest('.modal')
      ) {
        return;
      }

      const now = Date.now();
      if (isTraveling || now - lastScrollTime < 1000) return;

      if (e.deltaY > 0) {
        const next = getNextPlanet(activePlanetId);
        if (next) {
          travelTo(next.id);
          lastScrollTime = now;
        }
      } else if (e.deltaY < 0) {
        const prev = getPrevPlanet(activePlanetId);
        if (prev) {
          travelTo(prev.id);
          lastScrollTime = now;
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (
        e.target.closest('aside') ||
        e.target.closest('.glass-panel') ||
        e.target.closest('dialog') ||
        e.target.closest('.modal')
      ) {
        return;
      }
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY - touchEndY;
      const now = Date.now();
      if (isTraveling || now - lastScrollTime < 1000) return;

      if (Math.abs(diffY) > 50) {
        if (diffY > 0) {
          const next = getNextPlanet(activePlanetId);
          if (next) {
            travelTo(next.id);
            lastScrollTime = now;
          }
        } else {
          const prev = getPrevPlanet(activePlanetId);
          if (prev) {
            travelTo(prev.id);
            lastScrollTime = now;
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [phase, activePlanetId, isTraveling, travelTo]);

  return (
    <div className="relative w-full h-full bg-void overflow-hidden">
      <Canvas
        camera={{ fov: 55, near: 0.1, far: 2000, position: [0, 3, 20] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.75]}
      >
        <Scene />
      </Canvas>

      <LoadingScreen />
      <IntroOverlay />
      <HUD />
      <PlanetPanel />
      <ProjectModal />
      <CertificateModal />
      <CustomCursor />
      <BackgroundAudio />
    </div>
  );
}
