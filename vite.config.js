import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    cssMinify: 'esbuild',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendors into separate chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor'
          }
          // Split algorithms
          if (id.includes('/src/algorithms/')) {
            return 'algorithms'
          }
          // Split visualizer components
          if (id.includes('/src/components/SortingVisualizer') ||
              id.includes('/src/components/SearchingVisualizer') ||
              id.includes('/src/components/GraphVisualizer') ||
              id.includes('/src/components/TreeVisualizer') ||
              id.includes('/src/components/CompareView')) {
            return 'visualizers'
          }
          // Split data/theory files
          if (id.includes('/src/data/')) {
            return 'data'
          }
        },
      },
    },
  },
})
