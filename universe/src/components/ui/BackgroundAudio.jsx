import { useEffect, useRef } from 'react';
import { useUniverseStore } from '../../store/useUniverseStore';

// TODO: drop an ambient space-music loop at public/assets/ambient.mp3
// (royalty-free options: Pixabay Music, freesound.org, or your own track).
export default function BackgroundAudio() {
  const soundOn = useUniverseStore((s) => s.soundOn);
  const phase = useUniverseStore((s) => s.phase);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (soundOn && phase === 'journey') {
      audioRef.current.volume = 0.25;
      audioRef.current.play().catch(() => {
        // Autoplay can be blocked until the user interacts with the page — expected.
      });
    } else {
      audioRef.current.pause();
    }
  }, [soundOn, phase]);

  return <audio ref={audioRef} src="/assets/ambient.mp3" loop />;
}
