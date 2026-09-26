import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // Same reason as the production nginx: to the browser this is same-origin, so
        // the gateway's CORS rules must not see the dev server's Origin header.
        configure: (proxy) => proxy.on('proxyReq', (req) => req.removeHeader('origin'))
      }
    }
  }
})
