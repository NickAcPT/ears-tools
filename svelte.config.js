import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-cloudflare';
/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [vitePreprocess()],
	
    compilerOptions: {
        discloseVersion: false,
    },
	
    kit: {
        adapter: adapter({
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			}
		}),
        paths: {
            base: process.argv.includes('dev') ? '' : process.env.BASE_PATH,
        },
        prerender: {
            handleMissingId: 'warn',
        }
    },
    vitePlugin: {
        inspector: true,
        emitCss: true,
        prebundleSvelteLibraries: true,
        dynamicCompileOptions({ filename }) {
			if (!filename.includes('node_modules')) {
				return { runes: true };
			}
		}
    },
};

export default config;