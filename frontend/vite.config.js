import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  publicDir: 'public',  // This is the default folder for static assets
  build: {
    outDir: 'dist',    // Default output folder
    assetsDir: 'assets', // Folder inside dist to put static assets
    rollupOptions: {
      input: './index.html',  // Entry point
    },
  },
})
