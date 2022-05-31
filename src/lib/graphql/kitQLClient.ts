import { KitQLClient } from '@kitql/client';
// load local env variables

if (!import.meta.env.VITE_GITHUB_TOKEN) {
	console.error(
		`Sorry, you need to grab a 'GITHUB_TOKEN' and put it in your .env file. (Check the README.MD 🙃)`
	);
}

export const kitQLClient = new KitQLClient({
	url: `${import.meta.env.VITE_GRAPHQL_ENDPOINT}`,
	headers: {
		Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`
	},
	logType: ['client', 'server', 'operationAndvariables']
});
