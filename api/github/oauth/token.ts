/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createToken, checkToken, resetToken, deleteToken } from '@octokit/oauth-app';

export default async (req: VercelRequest, res: VercelResponse) => {
	const credentials = {
		clientId: process.env.CLIENT_ID!,
		clientSecret: process.env.CLIENT_SECRET!
	};

	if (req.method === 'POST') {
		const body = JSON.parse(req.body);
		const { token, scopes } = await createToken({
			...credentials,
			state: body.state as string,
			code: body.code as string
		});

		return res.json({ token, scopes });
	}

	const token = (req.headers.authorization || '').substring('token '.length);
	// const token = req.headers.authorization || '';
	if (!token) {
		res.status(400);
		return res.json({
			error: '"Authorization" header is required'
		});
	}

	const method = {
		GET: checkToken,
		PATCH: resetToken,
		DELETE: deleteToken
	}[req.method!];

	if (!method) {
		res.status(400);
		return res.json({
			error: `${req.method} is not supported`
		});
	}

	try {
		const result = await method({
			...credentials,
			token
		});

		if (!result) {
			res.status(204);
			return res.end();
		}

		return res.json(result);
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
