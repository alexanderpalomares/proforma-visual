import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // ← Este es el cambio importante
  plugins: [react()],
})
