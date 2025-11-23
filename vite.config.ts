import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import svgr from 'vite-plugin-svgr';
// import basicSsl from '@vitejs/plugin-basic-ssl'; // iOS 경고로 인해 임시 비활성화

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // basicSsl(), // HTTPS 개발 서버를 위한 자체 서명 인증서 생성 - iOS 경고로 인해 임시 비활성화
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
    host: true,
    // 개발 환경에서는 프록시 사용, 프로덕션에서는 실제 URL 사용
    proxy: {
      '/api': {
        target: 'https://api.ttobaki.app',
        changeOrigin: true,
        secure: true,
        // 대용량 파일 업로드를 위한 타임아웃 설정 (60초)
        timeout: 60000,
        // ws: true, // WebSocket 지원 (필요시)
        // 프록시 요청 전처리
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // 모든 요청의 헤더를 그대로 전달
            // FormData 요청의 경우 axios가 설정한 multipart/form-data 헤더를 유지
            if (req.headers['content-type']) {
              proxyReq.setHeader('Content-Type', req.headers['content-type']);
            }
            // Content-Length가 있으면 유지
            if (req.headers['content-length']) {
              proxyReq.setHeader('Content-Length', req.headers['content-length']);
            }
          });

          // 프록시 에러 처리
          proxy.on('error', (err) => {
            console.error('Proxy error:', err);
          });
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
