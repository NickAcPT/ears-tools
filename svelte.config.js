import { vitePreprocess } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
	
    compilerOptions: {
        discloseVersion: false,
    },
	
    kit: {
        adapter: adapter(),
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
    },
};

export default config;