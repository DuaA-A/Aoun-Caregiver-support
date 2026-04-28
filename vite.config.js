import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import emailServicePlugin from './src/server/emailService.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), emailServicePlugin()],
})
