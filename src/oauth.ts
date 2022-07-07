export async function setup() {
	const token = localStorage.getItem('token');
	if (!token) return logout();

	// we asume the token is valid
	login(token);

	// ... but we check just to be sure
	fetch(`GET ${location.origin}/api/github/oauth/token`, {
		headers: {
			authorization: `token ${token}`
		}
	}).catch(logout);
}

export async function exchangeCodeForToken(code: string) {
	const response = await fetch(`${location.origin}/api/github/oauth/token`, {
		body: JSON.stringify({
			code: code
		}),
		method: 'POST'
	}).catch(console.error);

	if (!response) return;

	const data = await response.json();

	console.log('access token is %s. Enabled scopes: ', data.token, data.scopes.join(', '));
	login(data.token);

	// remove ?code=... and &state=... from URL
	const path =
		location.pathname + location.search.replace(/\b(code|state)=\w+/g, '').replace(/[?&]+$/, '');

	history.pushState({}, '', path);
}

function login(token) {
	document.body.dataset.state = 'main';
	localStorage.setItem('token', token);
}

export async function logout(options: { [key: string]: string } = {}) {
	if (options.invalidateToken) {
		await fetch(`${location.origin}/api/github/oauth/token`, {
			method: 'DELETE',
			headers: {
				authorization: localStorage.getItem('token')
			}
		});
	}

	document.body.dataset.state = 'login';
	localStorage.clear();
}

export async function sayMyName() {
	const response = await fetch('/user', {
		headers: {
			authorization: localStorage.getItem('token')
		}
	});
	const data = await response.json();
	alert(data.name);
}
