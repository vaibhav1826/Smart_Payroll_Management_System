import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — always needed
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Charts — only loaded on dashboard/reports pages
          'vendor-recharts': ['recharts'],
          // PDF/Excel — only loaded on payroll/reports pages
          'vendor-export': ['jspdf', 'jspdf-autotable', 'xlsx'],
          // Toast notifications
          'vendor-toast': ['react-hot-toast'],
        },
      },
    },
  },
})
