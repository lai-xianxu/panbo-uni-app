// vite.config.js
 
import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
 
export default defineConfig({
	plugins: [uni()],
	server: {
		proxy: {
			'/aaaa': {
				target: 'http://113.250.177.237:8080',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/aaaa/, '')
			}
		}
	}
});