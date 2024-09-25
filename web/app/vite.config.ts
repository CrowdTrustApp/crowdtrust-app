import Vue from '@vitejs/plugin-vue'
import terser from '@rollup/plugin-terser'
import { defineConfig } from 'vite'

export default defineConfig({
  assetsInclude: /\.(pdf|jpg|png|webm|mp4|svg|wasm)$/,
  plugins: [Vue()],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: true,
    rollupOptions: {
      plugins: [terser()],
      output: {
        format: 'es',
        dir: 'dist',
      },
    },
  },
})
