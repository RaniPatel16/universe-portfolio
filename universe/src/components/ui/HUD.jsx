import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PLANETS, getNextPlanet } from '../../lib/navigation';
import { useUniverseStore } from '../../store/useUniverseStore';
import * as THREE from 'three';

// Narration scripts spoken by the NOVA AI voice narrator
const PLANET_NARRATIONS = {
  launchpad: "Welcome to Mission Control, Rani Patel. All systems online. Ready to initiate warp sequence.",
  about: "Entering the Developer sector. Scanning Rani's career timeline, education history, and qualifications.",
  skills: "Approaching Skills cluster. Scanners detect glowing ability crystals mapping frontend, backend, and tools.",
  projects: "Entering the Cyber City sector. Orbiting active 3D skyscrapers; select a building to inspect production codes.",
  figma: "Arriving at Figma Design planet. Visualizing client wireframes and user interface layouts.",
  certificates: "Now entering Credentials Museum. Scanning academic degrees and industry certificates.",
  hackathons: "Arriving at Hackathon Arena. Analysis shows past code sprints and competitive programming logs.",
  achievements: "Approaching Trophy City. Accessing golden monuments of career milestones and awards.",
  missioncontrol: "Warp destination reached: Secret Command Center online.",
  resume: "Loading holographic resume archive. Accessing candidate profile sheet.",
  contact: "Docking at communication station. High gain antenna ready to transmit message log feeds.",
  social: "Social Signal Array active. Broadcast feeds successfully linked to all networks. Mission complete.",
};

const playNovaVoice = (text, soundOn = true) => {
  if (!soundOn || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find(
    (v) =>
      v.name.includes('Google US English') ||
      v.name.includes('Female') ||
      v.name.includes('Zira') ||
      v.name.includes('Samantha') ||
      v.name.includes('Microsoft')
  );
  if (femaleVoice) utterance.voice = femaleVoice;
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
};

export default function HUD() {
  const phase = useUniverseStore((s) => s.phase);
  const activePlanetId = useUniverseStore((s) => s.activePlanetId);
  const isTraveling = useUniverseStore((s) => s.isTraveling);
  const travelTo = useUniverseStore((s) => s.travelTo);
  const panelOpen = useUniverseStore((s) => s.panelOpen);
  const setPanelOpen = useUniverseStore((s) => s.setPanelOpen);
  const soundOn = useUniverseStore((s) => s.soundOn);
  const toggleSound = useUniverseStore((s) => s.toggleSound);

  // Mission system parameters
  const unlockedPlanetIds = useUniverseStore((s) => s.unlockedPlanetIds) || ['launchpad'];
  const visitedPlanetIds = useUniverseStore((s) => s.visitedPlanetIds) || [];
  const missionComplete = useUniverseStore((s) => s.missionComplete);
  const resetMission = useUniverseStore((s) => s.resetMission);

  // Sector landing narration triggers
  useEffect(() => {
    if (phase === 'journey') {
      const narration = PLANET_NARRATIONS[activePlanetId];
      if (narration) {
        // Delay speech slightly to let translation complete
        const timer = setTimeout(() => {
          playNovaVoice(narration, soundOn);
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [activePlanetId, phase, soundOn]);

  if (phase !== 'journey') return null;

  const active = PLANETS.find((p) => p.id === activePlanetId);
  const next = getNextPlanet(activePlanetId);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-4 md:p-6">
      {/* Top bar: sector readout & NOVA status */}
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="pointer-events-auto glass-panel clip-corner px-4 py-2 font-mono text-[10px] md:text-xs text-ion uppercase tracking-widest">
            <p className="text-white/40">Current Sector</p>
            <p className="text-sm md:text-base holo-text-glow">{active?.label}</p>
          </div>
          <div className="pointer-events-auto glass-panel clip-corner px-4 py-2 font-mono text-[10px] md:text-xs text-ion uppercase tracking-widest">
            <p className="text-white/40">NOVA Narrative</p>
            <p className="text-sm md:text-base text-holo font-bold">
              {visitedPlanetIds.length === PLANETS.length ? 'MISSION COMPLETE' : `${visitedPlanetIds.length} / ${PLANETS.length} SECTORS`}
            </p>
          </div>
        </div>

        <button
          onClick={toggleSound}
          className="pointer-events-auto glass-panel clip-corner px-3 py-2 font-mono text-[10px] text-white/60 hover:text-ion transition-colors"
        >
          {soundOn ? 'NOVA AUDIO: ON' : 'NOVA AUDIO: OFF'}
        </button>
      </div>

      {/* Bottom console: waypoint nav bar */}
      <div className="pointer-events-auto flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5 max-w-4xl glass-panel clip-corner px-3 py-2">
          {PLANETS.map((p) => {
            const isActive = p.id === activePlanetId;
            const isUnlocked = unlockedPlanetIds.includes(p.id);
            return (
              <button
                key={p.id}
                disabled={isTraveling || !isUnlocked}
                onClick={() => travelTo(p.id)}
                className={`px-2.5 py-1.5 rounded font-mono text-[9px] md:text-[10px] uppercase tracking-wider transition-all border
                  ${isActive ? 'bg-ion/20 border-ion text-ion' : isUnlocked ? 'border-white/10 text-white/50 hover:border-ion/50 hover:text-ion' : 'border-white/5 text-white/20 cursor-not-allowed'}
                  disabled:opacity-50`}
                title={p.subtitle + (isUnlocked ? '' : ' (LOCKED)')}
              >
                {!isUnlocked && '🔒 '}
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

          {next && unlockedPlanetIds.includes(next.id) && (
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

      {/* Holo-compass */}
      <div className="pointer-events-none fixed bottom-24 right-4 md:right-8 hidden sm:block">
        <HoloCompass traveling={isTraveling} />
      </div>

      {/* Warp Speed Boost telemetries */}
      <AnimatePresence>
        {isTraveling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-ion text-xs uppercase tracking-[0.5em] text-center"
          >
            <div>ENGAGING WARP THRUSTERS</div>
            <div className="text-[9px] text-white/50 mt-2 animate-pulse">TELEMETRY LOCK ACTIVE // SPEED MAX BOOST</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mission Complete Overlay */}
      {missionComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-auto fixed inset-0 z-50 flex flex-col items-center justify-center bg-void/95 backdrop-blur-md p-6 select-none"
        >
          <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-holo/30 animate-spin" style={{ animationDuration: '10s' }} />
            <div className="absolute inset-4 rounded-full border border-dashed border-ion/40 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
            <div className="text-holo text-5xl filter drop-shadow-[0_0_15px_#35f0d0]">🏆</div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center max-w-lg"
          >
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-holo holo-text-glow tracking-widest uppercase mb-1">
              Mission Accomplished
            </h1>
            <p className="font-mono text-[10px] text-ion uppercase tracking-widest mb-6">
              All 12 Planetary Sectors Successfully Logged
            </p>

            <div className="glass-panel p-4 rounded text-left font-mono text-[10px] text-white/70 flex flex-col gap-2 mb-8 select-text">
              <p className="text-ion">// SYSTEM ARCHIVE SYNCHRONIZATION LOGS</p>
              <p>✔ Developer sector timelines scanned.</p>
              <p>✔ Technical ability crystals mapped into database.</p>
              <p>✔ Academic credentials cataloged inside Museum.</p>
              <p>✔ Signal transmitter communication arrays online.</p>
              <p className="text-holo mt-1">&gt; Rani Patel Portfolio calibration completed.</p>
            </div>

            <button
              onClick={resetMission}
              className="px-6 py-2.5 rounded-full bg-holo border border-holo/50 text-void font-mono text-xs uppercase tracking-widest font-bold hover:scale-105 transition-transform shadow-glow-ion"
            >
              Restart Simulation Loop
            </button>
          </motion.div>
        </motion.div>
      )}
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
