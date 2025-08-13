import { defineConfig,loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
    },
    base:'/web',
    build: {
      outDir: 'build',
      assetsInlineLimit:0,
    },
    plugins: [react()],
    server: {
        proxy: {
          '/api': { // The path to be proxied
            target: 'http://localhost:3000', // The target backend server URL
            changeOrigin: true, // Changes the origin of the host header to the target URL
          },
          // You can add more proxy rules here for different paths
        },

  },
  }});