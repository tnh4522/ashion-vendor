import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        strictPort: true,
        port: 80,
        proxy: {
            '/ngrok': {
                target: 'https://included-sheepdog-slowly.ngrok-free.app',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/ngrok/, ''),
                configure: (proxy) => {
                    proxy.on('proxyReq', (proxyReq) => {
                        proxyReq.setHeader('ngrok-skip-browser-warning', 'true');
                    });
                },
            },
            '/api-viva-accounts': {
                target: 'https://demo-accounts.vivapayments.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api-viva-accounts/, ''),
            },
            '/api-viva-checkout': {
                target: 'https://demo-api.vivapayments.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api-viva-checkout/, ''),
            },
        },
    },
})
