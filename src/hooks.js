// disable ssr in dev mode
// https://stackoverflow.com/questions/72251017/sveltekit-disable-ssr
// https://github.com/sveltejs/kit/tree/master/packages/adapter-static#spa-mode
export async function handle({ event, resolve }) {
	return resolve(event, { ssr: false });
}
