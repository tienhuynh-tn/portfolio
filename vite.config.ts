import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import imagePipeline from './scripts/image-pipeline'

export default defineConfig({
  plugins: [imagePipeline(), react()],
  base: '/',
})
