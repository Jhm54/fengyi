import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
});