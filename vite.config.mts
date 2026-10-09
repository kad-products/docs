import path from 'node:path';
import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import mdx from 'fumadocs-mdx/vite';
import { redwood } from 'rwsdk/vite';
import { defineConfig, loadEnv } from 'vite';
import * as MdxConfig from './source.config';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const tunnelHost = env.VITE_BASE_URL ? new URL(env.VITE_BASE_URL).host : null;

	return {
		resolve: {
			alias: {
				'@source': path.resolve('.source'),
				// Stub optional peer deps and build-time-only Node modules that fumadocs
				// pulls in but that must never run in a browser/Cloudflare Worker. Vite
				// marks unresolvable optional peer deps with `:false` which throws at
				// module init time, crashing the Worker. Stubs short-circuit that.
				// NOTE: rwsdk's directiveScanBlocklist (unreleased as of 1.7.4) will
				// eventually eliminate the need for most of these — tracked in
				// https://github.com/kad-products/docs/issues/8
				// fumadocs-core/server uses AsyncLocalStorage from node:async_hooks. The
				// browser-safe version is provided by fumadocs-core itself; we alias
				// unconditionally because we never use renderToMarkdown/asMarkdown.
				'fumadocs-core/server': path.resolve('node_modules/fumadocs-core/dist/server.browser.js'),
				flexsearch: path.resolve('src/lib/module-stub.ts'),
				'@takumi-rs/image-response': path.resolve('src/lib/module-stub.ts'),
				'takumi-js/response': path.resolve('src/lib/module-stub.ts'),
				'@fumadocs/tailwind/typography': path.resolve('src/lib/module-stub.ts'),
				tinyglobby: path.resolve('src/lib/module-stub.ts'),
				// Framework-specific optional peer deps pulled in by fumadocs-core's
				// framework adapters and i18n middleware. CJS stub used so esbuild skips
				// strict named-export checking.
				'next/server.js': path.resolve('src/lib/framework-stub.cjs'),
				'next/navigation.js': path.resolve('src/lib/framework-stub.cjs'),
				'next/link.js': path.resolve('src/lib/framework-stub.cjs'),
				'next/image.js': path.resolve('src/lib/framework-stub.cjs'),
				'waku/router/client': path.resolve('src/lib/framework-stub.cjs'),
				'react-router': path.resolve('src/lib/framework-stub.cjs'),
				'@tanstack/react-router': path.resolve('src/lib/framework-stub.cjs'),
			},
		},
		css: {
			modules: {
				localsConvention: 'camelCase',
			},
		},
		plugins: [
			react(),
			tailwindcss(),
			cloudflare({
				viteEnvironment: { name: 'worker' },
			}),
			redwood({
				// fumadocs-mdx generates component imports at build time, after rwsdk's
				// directive scan has run. forceClientPaths pre-registers these modules in
				// the vendor barrel so they're available when discovered during reloads.
				forceClientPaths: [
					'node_modules/fumadocs-ui/dist/**/!(og|next|waku|react-router|tanstack|mdx|*.server).js',
					'node_modules/fumadocs-core/dist/**/!(next|waku|react-router|tanstack|middleware|server).js',
				],
			}),
			mdx(MdxConfig),
		],
		server: {
			...(tunnelHost && {
				cors: false,
				allowedHosts: [tunnelHost],
				hmr: {
					host: tunnelHost,
					protocol: 'wss',
				},
			}),
		},
	};
});
