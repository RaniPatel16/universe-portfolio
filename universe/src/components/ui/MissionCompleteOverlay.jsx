import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUniverseStore } from '../../store/useUniverseStore';
import { PLANETS } from '../../lib/navigation';

// Animated floating particle
function Particle({ delay, x, y, size, color }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color, filter: 'blur(1px)' }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0.6, 0],
        scale: [0, 1.2, 0.8, 0],
        y: [0, -60, -120],
        x: [0, (Math.random() - 0.5) * 40],
      }}
      transition={{ duration: 3 + Math.random() * 2, delay, repeat: Infinity, repeatDelay: Math.random() * 3 }}
    />
  );
}

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  delay: i * 0.18,
  x: Math.random() * 100,
  y: 40 + Math.random() * 50,
  size: 4 + Math.random() * 8,
  color: ['#35F0D0', '#FFB454', '#7C5CFF', '#FF5C7A', '#FFD700'][i % 5],
}));

const PLANET_LABELS = PLANETS.map(p => p.label.replace(' Planet', '').replace(' Core', '').replace(' Arena', ''));

export default function MissionCompleteOverlay() {
  const show = useUniverseStore((s) => s.showMissionComplete);
  const visitedPlanets = useUniverseStore((s) => s.visitedPlanets);
  const restartJourney = useUniverseStore((s) => s.restartJourney);
  const travelTo = useUniverseStore((s) => s.travelTo);

  // Lock scroll while showing
  useEffect(() => {
    if (show) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [show]);

  const handleRestart = () => {
    restartJourney();
    travelTo('launchpad');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Deep space background */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at 50% 40%, #0a0f2e 0%, #050810 60%, #000 100%)',
          }} />

          {/* Star field */}
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: Math.random() > 0.9 ? 2 : 1,
                height: Math.random() > 0.9 ? 2 : 1,
                opacity: 0.2 + Math.random() * 0.6,
              }}
            />
          ))}

          {/* Floating particles */}
          {PARTICLES.map(p => <Particle key={p.id} {...p} />)}

          {/* Central glow ring */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 500, height: 500,
              background: 'radial-gradient(circle, rgba(53,240,208,0.07) 0%, transparent 70%)',
              border: '1px solid rgba(53,240,208,0.1)',
            }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Main content card */}
          <motion.div
            className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg w-full"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          >
            {/* Badge */}
            <motion.div
              className="mb-6 px-4 py-1.5 rounded-full border border-ion/40 bg-ion/10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
            >
              <span className="font-mono text-[10px] text-ion uppercase tracking-[0.3em]">
                NOVA — All Sectors Explored
              </span>
            </motion.div>

            {/* Trophy icon */}
            <motion.div
              className="text-6xl mb-4"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 180 }}
            >
              🏆
            </motion.div>

            {/* Title */}
            <motion.h1
              className="font-display font-black uppercase leading-none mb-2"
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                background: 'linear-gradient(135deg, #35F0D0 0%, #FFB454 50%, #7C5CFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: 'none',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              Mission Complete
            </motion.h1>

            <motion.p
              className="text-white/50 font-mono text-xs uppercase tracking-[0.2em] mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              Universe of Rani Patel — Fully Explored
            </motion.p>

            {/* Stats row */}
            <motion.div
              className="flex gap-6 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
            >
              {[
                { label: 'Sectors Visited', value: visitedPlanets.length },
                { label: 'Total Sectors', value: PLANETS.length },
                { label: 'Mission Status', value: '100%' },
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center">
                  <span className="font-display font-bold text-2xl text-solar">{s.value}</span>
                  <span className="font-mono text-[9px] text-white/30 uppercase tracking-wider mt-0.5">{s.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Planet checklist */}
            <motion.div
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
            >
              <p className="font-mono text-[9px] text-ion uppercase tracking-widest mb-3 text-left">Sectors Logged</p>
              <div className="grid grid-cols-3 gap-2">
                {PLANETS.map((planet, i) => {
                  const visited = visitedPlanets.includes(planet.id);
                  return (
                    <motion.div
                      key={planet.id}
                      className="flex items-center gap-1.5 text-left"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.6 + i * 0.05 }}
                    >
                      <span className="text-[10px]">{visited ? '✅' : '○'}</span>
                      <span className={`font-mono text-[9px] leading-tight ${visited ? 'text-white/70' : 'text-white/25'}`}>
                        {planet.label.replace(' Planet', '').replace(' Core', '').replace(' Arena', '')}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              className="flex gap-4 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
            >
              <button
                onClick={handleRestart}
                className="flex-1 py-4 rounded-2xl font-display font-bold text-sm uppercase tracking-[0.15em] text-void transition-all hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #35F0D0, #7C5CFF)',
                  boxShadow: '0 0 30px rgba(53,240,208,0.3)',
                }}
              >
                🚀 Explore Again
              </button>
              <button
                onClick={() => useUniverseStore.setState({ showMissionComplete: false })}
                className="px-6 py-4 rounded-2xl font-mono text-xs uppercase tracking-widest text-white/50 border border-white/15 hover:border-white/30 hover:text-white/80 transition-all"
              >
                Close
              </button>
            </motion.div>

            {/* NOVA subtitle */}
            <motion.p
              className="mt-6 text-white/25 font-mono text-[10px] italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
            >
              "Universe fully explored. Mission complete." — NOVA
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
