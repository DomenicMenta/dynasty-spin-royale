import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/dynasty-spin-royale/',
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [react()],
  publicDir: 'public',
  build: { outDir: 'pages-dist', emptyOutDir: true },
});
