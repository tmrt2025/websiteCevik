import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
  },
  // 🔥 Base path'i kaldır veya root yap
  base: '/',
})