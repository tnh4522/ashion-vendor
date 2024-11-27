import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'D:\\ashionEcommerceApi\\static',
        manifest: "manifest.json",
        rollupOptions: {
            input: [
                'src/main.jsx',
            ]
        }
    },
    server: {
        proxy: {
            '/ngrok': {
                target: 'https://sterling-notably-monster.ngrok-free.app',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/ngrok/, ''),
                configure: (proxy) => {
                    proxy.on('proxyReq', (proxyReq) => {
                        proxyReq.setHeader('ngrok-skip-browser-warning', 'true');
                    });
                },
            },
        },
    },
})