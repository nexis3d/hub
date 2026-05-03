import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Replace "Your-Repo-Name" with the exact name of your GitHub repository!
  // It MUST have the slashes before and after it.
  base: '/hub/', 
})