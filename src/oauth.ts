import { store } from './store';
import { get } from 'svelte/store';

export async function setup() {
	const token = localStorage.getItem('token');
	if (!token) return logout();

	// we asume the token is valid
	login(token);

	// ... but we check just to be sure
	fetch(`/api/github/oauth/token`, {
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
	localStorage.setItem('token', token);
	store.set({ isAuthed: true });
}

export async function logout(options: { [key: string]: boolean } = {}) {
	if (options.invalidateToken) {
		await fetch(`${location.origin}/api/github/oauth/token`, {
			method: 'DELETE',
			headers: {
				authorization: `token ${localStorage.getItem('token')}`
			}
		});
	}

	localStorage.clear();
	store.set({ isAuthed: false });
}
