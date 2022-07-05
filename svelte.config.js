import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import watchAndRun from '@kitql/vite-plugin-watch-and-run';
import houdini from 'houdini/preprocess';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [preprocess({ postcss: true }), houdini()],

	kit: {
		adapter: adapter({
			fallback: '200.html'
		}),
		vite: {
			resolve: {
				alias: {
					$houdini: path.resolve('.', '$houdini'),
					$graphql: path.resolve('src', 'lib', 'graphql')
				}
			},
			server: {
				fs: {
					allow: ['.']
				}
			},
			plugins: [
				watchAndRun([
					{
						watch: '**/*.(gql|graphql)',
						run: 'npm run gen'
					}
				])
			]
		}
	}
};

export default config;
