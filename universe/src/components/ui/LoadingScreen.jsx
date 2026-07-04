import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUniverseStore } from '../../store/useUniverseStore';

export default function LoadingScreen() {
  const phase = useUniverseStore((s) => s.phase);
  const setPhase = useUniverseStore((s) => s.setPhase);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (phase !== 'loading') return;
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + Math.random() * 18, 100);
        if (next >= 100) {
          clearInterval(interval);
          setComplete(true);
        }
        return next;
      });
    }, 180);
    return () => clearInterval(interval);
  }, [phase]);

  const handleEnter = () => {
    setPhase('intro');
  };

  return (
    <AnimatePresence>
      {phase === 'loading' && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void/80 gap-6 select-none"
        >
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border border-ion/30 animate-pulseRing" />
            <div className="absolute inset-3 rounded-full border border-nebula/40" />
            <div className="absolute inset-6 rounded-full bg-ion/20 blur-md" />
          </div>

          <p className="font-mono text-ion text-xs tracking-[0.3em] uppercase">
            {complete ? 'Navigation Systems Calibrated' : 'Calibrating Navigation Systems'}
          </p>

          {!complete ? (
            <>
              <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-ion to-nebula"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>
              <p className="font-mono text-white/40 text-[10px]">{Math.floor(progress)}%</p>
            </>
          ) : (
            <motion.button
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleEnter}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-ion to-nebula text-void font-mono text-xs uppercase tracking-widest font-bold shadow-glow-ion cursor-pointer"
            >
              Enter Universe
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
