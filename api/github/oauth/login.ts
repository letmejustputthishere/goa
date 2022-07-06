import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAuthorizationUrl } from '@octokit/oauth-app';

export default async (req: VercelRequest, res: VercelResponse) => {
	const url = await getAuthorizationUrl({
		clientId: process.env.CLIENT_ID!,
		state: req.query.state as string,
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		scopes: typeof req.query.scopes === 'string' ? req.query.scopes.split(',') : [],
		allowSignup: req.query.allowSignup === 'true' ? true : false,
		redirectUrl: req.query.redirectUrl as string
	});

	res.writeHead(302, { location: url });
	return res.end();
};
