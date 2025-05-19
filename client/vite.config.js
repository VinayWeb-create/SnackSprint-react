import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './'  // ✅ add this line for Vercel to handle paths properly
})
