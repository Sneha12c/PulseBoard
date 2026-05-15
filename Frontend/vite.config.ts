import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist', // The main output directory
    assetsDir: '',  // Empty string puts files directly into dist instead of dist/assets
    rollupOptions: {
      output: {
        // Keeps all entry JS files directly in the root of dist
        entryFileNames: '[name].js',
        // Keeps all split/lazy-loaded JS chunks directly in the root of dist
        chunkFileNames: '[name].js',
        // Keeps CSS and image assets directly in the root of dist
        assetFileNames: '[name].[ext]'
      }
    }
  },
  plugins: [react()],
})
