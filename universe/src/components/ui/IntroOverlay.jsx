import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import useTypewriter from '../../hooks/useTypewriter';
import { profile } from '../../data/portfolioData';
import { useUniverseStore } from '../../store/useUniverseStore';

const AI_LINE = 'Welcome, Rani Patel. Welcome to journey through my universe. Prepare for launch.';

export default function IntroOverlay() {
  const phase = useUniverseStore((s) => s.phase);
  const setPhase = useUniverseStore((s) => s.setPhase);
  const { output } = useTypewriter(AI_LINE, 28, 600);
  const [logs, setLogs] = useState([]);
  const [systemTime, setSystemTime] = useState('');

  // Space AI voice player helper (checks custom audio first, falls back to web speech TTS)
  const playVoice = (text, audioPath) => {
    const audio = new Audio(audioPath);
    audio.play()
      .catch(() => {
        // Fallback to text-to-speech if custom audio is not found/supported
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          const voices = window.speechSynthesis.getVoices();
          // Prioritize female English voices
          const femaleKeywords = ['zira', 'amy', 'samantha', 'siri', 'hazel', 'female', 'heera', 'susan', 'google us english', 'natural'];
          let voice = voices.find((v) => {
            if (!v.lang.startsWith('en')) return false;
            const nameLower = v.name.toLowerCase();
            return femaleKeywords.some((keyword) => nameLower.includes(keyword));
          });
          // Fallback to any available English voice if no specific female voice matches
          if (!voice) {
            voice = voices.find(
              (v) =>
                v.lang.startsWith('en') &&
                (v.name.toLowerCase().includes('google') ||
                  v.name.toLowerCase().includes('microsoft'))
            );
          }
          if (voice) {
            utterance.voice = voice;
          }
          utterance.rate = 0.92;
          // Set pitch slightly higher for a cleaner female voice profile
          utterance.pitch = 1.05;
          window.speechSynthesis.speak(utterance);
        }
      });
  };

  const speakAI = () => {
    playVoice(AI_LINE, '/assets/voice-welcome.mp3');
  };

  // Speaks on mount/intro phase if user has clicked standard browser items previously,
  // we also add listeners on mouse movement, click, touch, and keypress to guarantee
  // it speaks instantly on first action.
  useEffect(() => {
    if (phase === 'intro') {
      let spoken = false;

      const runSpeech = () => {
        if (spoken) return;
        speakAI();
        spoken = true;
        cleanup();
      };

      const cleanup = () => {
        window.removeEventListener('click', runSpeech);
        window.removeEventListener('touchstart', runSpeech);
        window.removeEventListener('mousemove', runSpeech);
        window.removeEventListener('keydown', runSpeech);
      };

      // Try autoplaying right away in case permission is already granted
      runSpeech();

      // Fallback triggers for immediate speech playback upon user action
      window.addEventListener('click', runSpeech, { passive: true });
      window.addEventListener('touchstart', runSpeech, { passive: true });
      window.addEventListener('mousemove', runSpeech, { passive: true });
      window.addEventListener('keydown', runSpeech, { passive: true });

      return () => cleanup();
    }
  }, [phase]);

  // Telemetry log simulator
  useEffect(() => {
    if (phase !== 'intro') return;
    const diagnostics = [
      'SYS INIT: CALIBRATING THRUSTER CORRIDORS... OK',
      'COR-DRIVE: LOCKING STABILITY FLUX CAPS... 98%',
      'SATELLITE LINK: ESTABLISHED SECTOR 0-A',
      'GRAVITATIONAL SHIELDING: CALIBRATED TO 1.0G',
      'WARP DRIVE: REACTOR CHARGING AT 4700 GW',
      'LIFE SUPPORT CORES: FULLY ACTIVE // SAFE',
      'NAV-COMPUTER: CODENAME: COM-RANI SECURED',
      'AI UPLINK: READY FOR RANI PATEL ACTIONS...',
    ];

    let timer = 0;
    diagnostics.forEach((line, index) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${line}`].slice(-6));
      }, timer);
      timer += 1100;
    });

    // Update real time coordinate
    const interval = setInterval(() => {
      const now = new Date();
      setSystemTime(
        `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString()
          .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  const begin = () => {
    playVoice('Launch initiated. Safe journey, Rani Patel.', '/assets/voice-launch.mp3');
    setPhase('journey');
  };

  return (
    <AnimatePresence>
      {phase === 'intro' && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-40 flex flex-col items-center justify-between p-6 text-center select-none overflow-hidden"
        >
          {/* Cybergrid visual layer overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(5,6,11,0.92)_2px,_transparent_2px),_linear-gradient(90deg,_rgba(5,6,11,0.92)_2px,_transparent_2px)] bg-[size:32px_32px] opacity-25 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-void/35 via-void/75 to-void pointer-events-none" />

          {/* Top Sci-Fi Telemetry Panel */}
          <div className="relative z-10 w-full flex justify-between items-center text-left font-mono text-[9px] uppercase tracking-widest text-white/50 border-b border-ion/10 pb-3 md:px-6">
            <div className="flex gap-4">
              <div>
                <span className="text-ion">UPLINK:</span> ACTIVE
              </div>
              <div className="hidden sm:block">
                <span className="text-solar">SECTOR:</span> R-16/ASG1
              </div>
            </div>
            <button
              onClick={speakAI}
              className="flex items-center gap-1.5 px-3 py-1 rounded border border-ion/20 bg-ion/5 hover:bg-ion/15 text-ion font-semibold text-[8px] sm:text-[9px] transition-all cursor-pointer shadow-glow-ion/10"
              title="Voice synthesizer playback"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-ion animate-ping" />
              VOICE LINK: CONNECTED
            </button>
            <div className="flex gap-4 text-right">
              <div>SYS CODE: 10.0.JOURNEY</div>
              <div>ST-TIME: {systemTime || '12:00:00'}</div>
            </div>
          </div>

          {/* Main Visual content section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="relative z-10 flex flex-col items-center gap-4 my-auto max-w-2xl px-4"
          >
            {/* High-tech Holographic Profile Photo Scanner */}
            <div className="relative w-36 h-36 rounded-2xl glass-panel p-2 flex items-center justify-center border border-ion/30 shadow-glow-ion/30 overflow-hidden group">
              {/* Scanline animator */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-cyan-400 opacity-60 shadow-glow-ion animate-[scan_2.8s_infinite] pointer-events-none z-20" />
              <style>{`
                @keyframes scan {
                  0%, 100% { top: 0%; opacity: 0.2; }
                  50% { top: 100%; opacity: 0.8; }
                }
              `}</style>

              {/* Spinning target reticle background */}
              <div className="absolute inset-0 rounded-full border border-dashed border-ion/20 animate-[spin_40s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border border-dotted border-solar/15 animate-[spin_20s_linear_infinite_reverse]" />

              {/* High-tech Animated wireframe head avatar or Photo if present */}
              <div className="w-full h-full rounded-xl bg-void/50 overflow-hidden flex items-center justify-center border border-white/5 relative z-10">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 contrast-125 brightness-110"
                />

                {/* SVG Targeting HUD metrics layered on top */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-ion/60 fill-none stroke-current" strokeWidth="1">
                  {/* Concentric rings representing target focal */}
                  <circle cx="50" cy="50" r="44" strokeDasharray="3 5" className="opacity-20" />
                  <circle cx="50" cy="50" r="32" strokeDasharray="6 3" className="opacity-30 animate-pulse" />

                  {/* Tech crosshair grid markings */}
                  <line x1="50" y1="5" x2="50" y2="95" strokeDasharray="2 3" className="opacity-20" />
                  <line x1="5" y1="50" x2="95" y2="50" strokeDasharray="2 3" className="opacity-20" />

                  {/* Target corner ticks inside the HUD */}
                  <path d="M 8,16 L 8,8 L 16,8" className="opacity-60 stroke-[1.2]" />
                  <path d="M 84,8 L 92,8 L 92,16" className="opacity-60 stroke-[1.2]" />
                  <path d="M 8,84 L 8,92 L 16,92" className="opacity-60 stroke-[1.2]" />
                  <path d="M 84,92 L 92,92 L 92,84" className="opacity-60 stroke-[1.2]" />
                </svg>

                {/* Subtitle tag overlay */}
                <div className="absolute bottom-1 inset-x-0 font-mono text-[7px] text-solar tracking-widest uppercase bg-void/70 py-0.5 z-20">
                  SYSTEM ONLINE // RANI
                </div>
              </div>
            </div>

            <p className="font-mono text-ion text-xs tracking-[0.4em] uppercase">{profile.title}</p>
            <h1 className="font-display text-4xl md:text-6xl font-black text-holo holo-text-glow tracking-wider">
              {profile.name}
            </h1>

            <p className="font-mono text-white/70 text-xs md:text-sm max-w-xl min-h-[3rem] px-2 leading-relaxed">
              {output}
              <span className="animate-pulse text-ion">_</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <button
                onClick={begin}
                className="px-6 py-3 rounded-full bg-ion hover:bg-ion/95 text-void font-mono text-xs uppercase tracking-widest font-bold shadow-glow-ion hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Start Journey
              </button>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-full glass-panel text-holo font-mono text-xs uppercase tracking-widest hover:border-ion/60 hover:bg-ion/5 transition-all text-center"
              >
                View Resume
              </a>
              <button
                onClick={begin}
                className="px-6 py-3 rounded-full glass-panel text-holo font-mono text-xs uppercase tracking-widest hover:border-nebula/60 hover:bg-nebula/5 transition-all cursor-pointer"
              >
                Contact Me
              </button>
              <button
                onClick={begin}
                className="px-6 py-3 rounded-full glass-panel text-holo font-mono text-xs uppercase tracking-widest hover:border-solar/60 hover:bg-solar/5 transition-all cursor-pointer"
              >
                Explore Universe
              </button>
            </div>
          </motion.div>

          {/* Bottom Diagnostic Console & Telemetry logs */}
          <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-end font-mono text-[8px] md:text-[9px] uppercase tracking-widest text-white/35 md:px-6 pt-3 border-t border-ion/10">
            {/* Diagnostic Logs terminal terminal */}
            <div className="flex flex-col gap-0.5 text-left text-ion/60 w-full md:w-auto mb-2 md:mb-0">
              {logs.map((log, i) => (
                <div key={i} className="font-mono leading-none">
                  {log}
                </div>
              ))}
            </div>

            {/* Ship Telemetry Readings */}
            <div className="flex flex-row justify-between md:justify-end gap-6 w-full md:w-auto">
              <div>
                <span className="text-white/20">TARGET_VECTOR:</span> [0, 0, 0]
              </div>
              <div>
                <span className="text-white/20">VELOCITY:</span> 0.0 M/S
              </div>
              <div className="hidden sm:block">
                <span className="text-white/20">THRUST_RATIO:</span> 0.00%
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
