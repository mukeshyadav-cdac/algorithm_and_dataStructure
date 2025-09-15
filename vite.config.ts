import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@/components': '/src/components',
      '@/hooks': '/src/hooks',
      '@/services': '/src/services',
      '@/types': '/src/types',
      '@/utils': '/src/utils',
      '@/constants': '/src/constants',
    },
  },
})
