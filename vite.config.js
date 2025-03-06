import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import i18n from 'laravel-react-i18n/vite';
import laravel from 'laravel-vite-plugin';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      port: env.VITE_PORT || 5173,
      origin: `http://${env.VITE_HMR_HOST}:${env.VITE_PORT || 5173}`,
      cors: true,
      hmr: {
        host: env.VITE_HMR_HOST || 'localhost',
      },
    },
    plugins: [
      laravel({
        input: ['resources/css/app.css', 'resources/js/app.tsx'],
        ssr: 'resources/js/ssr.jsx',
        refresh: true,
      }),
      react(),
      tailwindcss(),
      i18n(),
    ],
    esbuild: {
      jsx: 'automatic',
    },
  };
});
