/** @type {import('houdini').ConfigFile} */
const config = {
	schemaPath: 'src/**/*.graphql',
	// schemaPath: 'src/lib/graphql/schema.json',
	sourceGlob: 'src/**/*.{svelte,gql}',
	scalars: {
		// Houdini will help you with this part when you will `generate`
		// No worries 😉
		/* in your case, something like */
		DateTime: {
			// the corresponding typescript type
			type: 'Date',
			// turn the api's response into that type
			unmarshal(val) {
				return new Date(val);
			},
			// turn the value into something the API can use
			marshal(date) {
				console.log(date);
				return date.toISOString();
			}
		},
		URI: {
			// <- The GraphQL Scalar
			type: 'string' // <-  The TypeScript type
		}
	}
};

export default config;
