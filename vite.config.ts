import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Ensure it binds to all available network interfaces
  },
  preview: {
    port: parseInt(process.env.PORT || '4173'),
    host: true, // Ensure it binds to all available network interfaces
  }
})
