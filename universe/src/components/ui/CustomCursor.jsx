import { useEffect, useRef } from 'react';

/**
 * A small holographic ring that follows the pointer with easing.
 * Disabled automatically on touch devices via CSS (see index.css).
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('pointermove', move);

    let raf;
    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.18;
      ring.current.y += (pos.current.y - ring.current.y) * 0.18;
      if (dotRef.current) dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="hidden md:block">
      <div ref={dotRef} className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-ion -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none" />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-ion/50 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none"
      />
    </div>
  );
}
