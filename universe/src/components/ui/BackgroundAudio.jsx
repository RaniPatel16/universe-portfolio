import { useEffect, useRef } from 'react';
import { useUniverseStore } from '../../store/useUniverseStore';

// Plays an ambient space-music loop at public/assets/ambient.mp3.
// Fades volume down when NOVA speaks and transitions smoothly.
export default function BackgroundAudio() {
  const soundOn = useUniverseStore((s) => s.soundOn);
  const phase = useUniverseStore((s) => s.phase);
  const novaSpeaking = useUniverseStore((s) => s.novaSpeaking);
  const novaMuted = useUniverseStore((s) => s.novaMuted);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;

    const active = soundOn && (phase === 'intro' || phase === 'journey');
    const targetVolume = (active && (!novaSpeaking || novaMuted)) ? 0.25 : (active ? 0.05 : 0);

    let interval;
    const step = 0.02;
    const intervalTime = 30; // ms

    if (active) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(() => {
          // Autoplay blocked until interaction
        });
      }

      interval = setInterval(() => {
        if (!audioRef.current) {
          clearInterval(interval);
          return;
        }
        const current = audioRef.current.volume;
        if (Math.abs(current - targetVolume) < step) {
          audioRef.current.volume = targetVolume;
          clearInterval(interval);
        } else {
          audioRef.current.volume = current + (targetVolume > current ? step : -step);
        }
      }, intervalTime);
    } else {
      audioRef.current.volume = 0;
      audioRef.current.pause();
    }

    return () => clearInterval(interval);
  }, [soundOn, phase, novaSpeaking, novaMuted]);

  return <audio ref={audioRef} src="/assets/ambient.mp3" loop />;
}
