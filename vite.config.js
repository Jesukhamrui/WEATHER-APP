import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.weatherapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    fs: {
      allow: ['src', 'public', 'node_modules'], // Allow node_modules for Leaflet
    },
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
});