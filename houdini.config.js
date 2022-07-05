/** @type {import('houdini').ConfigFile} */
const config = {
	schemaPath: 'src/**/*.graphql',
	// schemaPath: 'src/lib/graphql/schema.json',
	sourceGlob: 'src/**/*.{svelte,gql}',
	scalars: {
		// Houdini will help you with this part when you will `generate`
		// No worries 😉
	}
};

export default config;
