import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    host: true, // allow external access (e.g., from ngrok)
    port: 5173,
    allowedHosts: ['47cb02c7976b.ngrok-free.app'], // allow your ngrok domain
  },
})
