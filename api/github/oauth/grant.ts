/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { deleteAuthorization } from '@octokit/oauth-app';

export default async (req: VercelRequest, res: VercelResponse) => {
	if (req.method !== 'DELETE') {
		res.status(400);
		return res.json({
			error: `${req.method} is not supported`
		});
	}

	const credentials = {
		clientId: process.env.CLIENT_ID!,
		clientSecret: process.env.CLIENT_SECRET!
	};

	const token = (req.headers.authorization || '').substr('token '.length);
	if (!token) {
		res.status(400);
		return res.json({
			error: '"Authorization" header is required'
		});
	}

	try {
		await deleteAuthorization({
			...credentials,
			token
		});

		res.status(204);
		return res.end();
	} catch (error) {
		if (error.status === 404) {
			res.status(400);
			return res.json({
				error: `Invalid authentication`
			});
		}

		throw error;
	}
};
