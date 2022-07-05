// import { KitQLClient } from '@kitql/client';
// // load local env variables

// if (!import.meta.env.VITE_GITHUB_TOKEN) {
// 	console.error(
// 		`Sorry, you need to grab a 'GITHUB_TOKEN' and put it in your .env file. (Check the README.MD 🙃)`
// 	);
// }

// export const kitQLClient = new KitQLClient({
// 	url: `${import.meta.env.VITE_GRAPHQL_ENDPOINT}`,
// 	headers: {
// 		Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`
// 	},
// 	logType: ['client', 'server', 'operationAndvariables']
// });

import type { RequestHandlerArgs } from '$houdini';
import { HoudiniClient } from '$houdini';

async function fetchQuery({
	fetch,
	text = '',
	variables = {},
	session,
	metadata
}: RequestHandlerArgs) {
	const url = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'https://countries.trevorblades.com/graphql';

	const result = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`
		},
		body: JSON.stringify({
			query: text,
			variables
		})
	});

	return await result.json();
}

export const houdiniClient = new HoudiniClient(fetchQuery);
