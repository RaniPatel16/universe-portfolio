import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/universe-portfolio/',
  plugins: [react()],
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 2000,
  },
});
