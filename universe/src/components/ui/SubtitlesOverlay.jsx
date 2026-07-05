import { AnimatePresence, motion } from 'framer-motion';
import { useUniverseStore } from '../../store/useUniverseStore';

export default function SubtitlesOverlay() {
  const novaSubtitle = useUniverseStore((s) => s.novaSubtitle);
  const novaSpeaking = useUniverseStore((s) => s.novaSpeaking);
  const novaMuted = useUniverseStore((s) => s.novaMuted);
  const setNovaMuted = useUniverseStore((s) => s.setNovaMuted);

  if (!novaSubtitle || !novaSpeaking) return null;

  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full max-w-xl px-4 flex flex-col items-center gap-2">
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="pointer-events-auto glass-panel bg-void/90 border border-holo/20 shadow-glow-holo/10 rounded-2xl px-6 py-3.5 flex items-center gap-4 w-full"
      >
        {/* Animated AI Core Avatar */}
        <div className="flex-shrink-0 relative w-10 h-10 rounded-full border border-holo/30 bg-holo/5 flex items-center justify-center overflow-hidden">
          {/* Pulsing inner core */}
          <div className="absolute w-5 h-5 rounded-full bg-holo opacity-45 animate-ping" />
          <div className="absolute w-3 h-3 rounded-full bg-holo shadow-glow-holo" />
          
          {/* Bouncing audio wave bars */}
          {!novaMuted && (
            <div className="absolute bottom-1 flex gap-[2px] justify-center items-end h-3 w-6">
              <span className="w-[2px] bg-holo/70 rounded-full animate-[bounce_0.8s_infinite]" />
              <span className="w-[2px] bg-holo/70 rounded-full animate-[bounce_0.5s_infinite_0.15s] h-2" />
              <span className="w-[2px] bg-holo/70 rounded-full animate-[bounce_0.7s_infinite_0.3s] h-1.5" />
              <span className="w-[2px] bg-holo/70 rounded-full animate-[bounce_0.6s_infinite_0.1s] h-2.5" />
            </div>
          )}
        </div>

        {/* Text Area */}
        <div className="flex-1 flex flex-col gap-0.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-holo font-bold">
              NOVA // AI COMPANION {novaMuted ? '(MUTED)' : ''}
            </span>
            {/* Quick Mute toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setNovaMuted(!novaMuted);
              }}
              className="font-mono text-[8px] uppercase tracking-wider text-white/40 hover:text-holo cursor-pointer"
            >
              {novaMuted ? 'Unmute' : 'Mute'}
            </button>
          </div>
          <p className="text-white/90 font-sans text-xs md:text-sm leading-relaxed text-justify">
            {novaSubtitle}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
