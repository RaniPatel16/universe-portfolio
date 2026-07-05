import { AnimatePresence, motion } from 'framer-motion';
import { PLANETS, getNextPlanet } from '../../lib/navigation';
import { useUniverseStore } from '../../store/useUniverseStore';

export default function HUD() {
  const phase = useUniverseStore((s) => s.phase);
  const activePlanetId = useUniverseStore((s) => s.activePlanetId);
  const isTraveling = useUniverseStore((s) => s.isTraveling);
  const travelTo = useUniverseStore((s) => s.travelTo);
  const panelOpen = useUniverseStore((s) => s.panelOpen);
  const setPanelOpen = useUniverseStore((s) => s.setPanelOpen);
  const soundOn = useUniverseStore((s) => s.soundOn);
  const toggleSound = useUniverseStore((s) => s.toggleSound);
  const novaMuted = useUniverseStore((s) => s.novaMuted);
  const setNovaMuted = useUniverseStore((s) => s.setNovaMuted);
  const unlockedPlanets = useUniverseStore((s) => s.unlockedPlanets);

  if (phase !== 'journey') return null;

  const active = PLANETS.find((p) => p.id === activePlanetId);
  const next = getNextPlanet(activePlanetId);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-4 md:p-6">
      {/* Top bar: sector readout */}
      <div className="flex items-start justify-between">
        <div className="pointer-events-auto glass-panel clip-corner px-4 py-2 font-mono text-[10px] md:text-xs text-ion uppercase tracking-widest">
          <p className="text-white/40">Current Sector</p>
          <p className="text-sm md:text-base holo-text-glow">{active?.label}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleSound}
            className="pointer-events-auto glass-panel clip-corner px-3 py-2 font-mono text-[10px] text-white/60 hover:text-ion transition-colors cursor-pointer"
          >
            {soundOn ? 'AMBIENT: ON' : 'AMBIENT: OFF'}
          </button>
          <button
            onClick={() => setNovaMuted(!novaMuted)}
            className={`pointer-events-auto glass-panel clip-corner px-3 py-2 font-mono text-[10px] transition-colors cursor-pointer ${
              novaMuted ? 'text-white/40 hover:text-white/70' : 'text-holo shadow-glow-holo/10 hover:text-holo/80'
            }`}
          >
            {novaMuted ? 'NOVA: MUTED' : 'NOVA: ACTIVE'}
          </button>
        </div>
      </div>

      {/* Bottom console: waypoint nav bar */}
      <div className="pointer-events-auto flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5 max-w-4xl glass-panel clip-corner px-3 py-2">
          {PLANETS.map((p) => {
            const isActive = p.id === activePlanetId;
            return (
              <button
                key={p.id}
                disabled={isTraveling}
                onClick={() => travelTo(p.id)}
                className={`px-2.5 py-1.5 rounded font-mono text-[9px] md:text-[10px] uppercase tracking-wider transition-all border
                  ${isActive ? 'bg-ion/20 border-ion text-ion' : 'border-white/10 text-white/50 hover:border-ion/50 hover:text-ion'}
                  disabled:opacity-40 disabled:cursor-not-allowed`}
                title={p.subtitle}
              >
                {p.label.replace(' Planet', '')}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="pointer-events-auto px-5 py-2 rounded-full bg-ion text-void font-mono text-[10px] uppercase tracking-widest font-semibold shadow-glow-ion hover:scale-105 transition-transform"
          >
            {panelOpen ? 'Close Panel' : 'Open Panel'}
          </button>

          {next && (
            <button
              disabled={isTraveling}
              onClick={() => travelTo(next.id)}
              className="pointer-events-auto px-5 py-2 rounded-full glass-panel font-mono text-[10px] uppercase tracking-widest text-holo hover:border-nebula/60 transition-colors disabled:opacity-40"
            >
              Next: {next.label}
            </button>
          )}
        </div>
      </div>

      {/* Holo-compass — signature element, bottom-right, points toward next planet */}
      <div className="pointer-events-none fixed bottom-24 right-4 md:right-8 hidden sm:block">
        <HoloCompass traveling={isTraveling} />
      </div>

      <AnimatePresence>
        {isTraveling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-ion text-xs uppercase tracking-[0.5em]"
          >
            Engaging Thrusters
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HoloCompass({ traveling }) {
  return (
    <div className={`relative w-20 h-20 ${traveling ? 'animate-pulseRing' : ''}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="46" fill="none" stroke="#35F0D0" strokeOpacity="0.3" strokeWidth="1" />
        <circle cx="50" cy="50" r="34" fill="none" stroke="#7C5CFF" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="3 5" />
        <line x1="50" y1="50" x2="50" y2="10" stroke="#35F0D0" strokeWidth="2" />
        <circle cx="50" cy="50" r="3" fill="#FFB454" />
      </svg>
    </div>
  );
}
