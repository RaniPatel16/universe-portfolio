import { useEffect, useState } from 'react';

/**
 * Reveals `text` one character at a time.
 * @param {string} text
 * @param {number} speed ms per character
 * @param {number} startDelay ms before typing begins
 */
export default function useTypewriter(text, speed = 32, startDelay = 0) {
  const [output, setOutput] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setOutput('');
    setDone(false);
    let i = 0;
    let interval;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setOutput(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { output, done };
}
