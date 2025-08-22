import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5174', // ganti dengan port backend Anda
        changeOrigin: true,
      }
    }
  }
});