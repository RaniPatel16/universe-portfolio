/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#05060B',
          deep: '#020208',
          panel: '#0B0E1A',
        },
        nebula: {
          DEFAULT: '#7C5CFF',
          dim: '#4B3899',
        },
        ion: {
          DEFAULT: '#35F0D0',
          dim: '#1B8C7B',
        },
        solar: {
          DEFAULT: '#FFB454',
          dim: '#8C6530',
        },
        alert: '#FF5C7A',
        holo: '#EAF6FF',
      },
      fontFamily: {
        display: ['"Orbitron"', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-ion': '0 0 24px 2px rgba(53, 240, 208, 0.35)',
        'glow-nebula': '0 0 30px 4px rgba(124, 92, 255, 0.35)',
        'glow-solar': '0 0 24px 2px rgba(255, 180, 84, 0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulseRing: {
          '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
      },
      animation: {
        scanline: 'scanline 3s linear infinite',
        pulseRing: 'pulseRing 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
