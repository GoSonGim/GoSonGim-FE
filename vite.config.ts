import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      include: '**/*.svg', // ?react 안붙혀도 컴포넌트로 인식
      svgrOptions: {
        exportType: 'default',
        icon: true, // tailwind className 사용 가능
      },
    }),
  ],
  server: {
    port: 8080,
    // 개발 환경에서는 프록시 사용, 프로덕션에서는 실제 URL 사용
    proxy: {
      '/api': {
        target: 'https://ttobaki.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
