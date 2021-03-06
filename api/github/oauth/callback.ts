/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createToken } from '@octokit/oauth-app';

export default async (req: VercelRequest, res: VercelResponse) => {
	const { token } = await createToken({
		clientId: process.env.CLIENT_ID!,
		clientSecret: process.env.CLIENT_SECRET!,
		state: req.query.state as string,
		code: req.query.code as string
	});

	res.writeHead(200, {
		'content-type': 'text/html'
	});
	res.end(`<h1>Token created successfull</h1>
<p>Your token is: <strong>${token}</strong>. Copy it now as it cannot be shown again.</p>`);
};
