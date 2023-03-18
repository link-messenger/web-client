import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigpaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tsconfigpaths(),
		VitePWA({
			devOptions: {
				enabled: true,
				type: 'module',
			},
			injectRegister: 'auto',
			includeAssets: ['favicon.ico'],
			strategies: 'injectManifest',
			srcDir: 'src/',
			filename: 'sw.js',
			scope: '/',
			base: '/',
			registerType: 'autoUpdate',
			manifest: {
				name: 'Link Messenger',
				short_name: 'Link',
				description: 'Link! the ultimate social experience.',
				background_color: '#f0f9ff',
				theme_color: '#38bdf8',
				display: 'standalone',
				orientation: 'portrait-primary',
				scope: '/',
				lang: 'en_US',
				start_url: '/',
				id: '/',
				icons: [
					{
						src: '/android/iconx48.png',
						sizes: '48x48',
						type: 'image/png',
					},
					{
						src: '/android/iconx72.png',
						sizes: '72x72',
						type: 'image/png',
					},
					{
						src: '/android/iconx96.png',
						sizes: '96x96',
						type: 'image/png',
					},
					{
						src: '/android/iconx144.png',
						sizes: '144x144',
						type: 'image/png',
					},
					{
						src: '/android/iconx192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/android-chrome-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/android-chrome-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: '/apple-touch-icon.png',
						sizes: '180x180',
						type: 'image/png',
						purpose: 'maskable',
					},
					{
						src: '/apple/120.png',
						sizes: '120x120',
						type: 'image/png',
						purpose: 'maskable',
					},
					{
						src: '/apple/180.png',
						sizes: '180x180',
						type: 'image/png',
						purpose: 'maskable',
					},
				],
			},
			injectManifest: {
				swSrc: 'src/pwa/sw.js',
				swDest: '/dist/sw.js',
			},

			workbox: {
				navigateFallback: 'index.html',
				swDest: 'sw.js',
			},
		}),
	],
});
