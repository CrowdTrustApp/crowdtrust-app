import Vue from '@vitejs/plugin-vue'
import terser from '@rollup/plugin-terser'
import { defineConfig } from 'vite'
import { tsconfigBaseAliases } from './tsconfig-base-aliases'

export default defineConfig({
  assetsInclude: /\.(pdf|jpg|png|webm|mp4|svg|wasm)$/,
  plugins: [Vue()],
  resolve: {
    preserveSymlinks: true,
    alias: {
      ...tsconfigBaseAliases(__dirname),
    },
  },
  server: {
    port: 8080,
  },
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
