<script lang="ts">
	import Forks from '$lib/components/chaoss-metrics/common/contributions/forks/Forks.svelte';
	import Languages from '$lib/components/chaoss-metrics/common/contributions/languages/Languages.svelte';
	import Burstiness from '$lib/components/chaoss-metrics/common/time/burstiness/Burstiness.svelte';
	import Close from '$lib/components/chaoss-metrics/common/time/time-to-close/Close.svelte';
	import DateRangeSelector from '$lib/components/DateRangeSelector.svelte';
	import GitHubUrlInput from '$lib/components/GitHubUrlInput.svelte';
	import { store } from '../store';
	import { onMount } from 'svelte';
	import { exchangeCodeForToken, setup, logout } from '../oauth';

	// let source: { repo: string; owner: string } = null;
	let source: { repo: string; owner: string } = { repo: 'kit', owner: 'sveltejs' };
	let date: Date;

	onMount(async () => {
		const searchParams = new URLSearchParams(location.search);

		const params: { [key: string]: string } = {};
		for (const [key, value] of searchParams.entries()) {
			params[key] = value;
		}

		if (params.code) {
			await exchangeCodeForToken(params.code);
		} else {
			await setup();
		}
	});
</script>

{#if !$store.isAuthed}
	<a href="/api/github/oauth/login">
		<button class="btn"> login </button>
	</a>
{:else}
	<button class="btn" on:click={() => logout({ invalidateToken: true })}>logout</button>

	<div class="flex flex-col justify-center m-6">
		<div class="flex justify-center">
			<DateRangeSelector bind:selected={date} />
			<GitHubUrlInput bind:source />
		</div>
		{#if source}
			<Forks repo={source.repo} owner={source.owner} />
			<Languages repo={source.repo} owner={source.owner} />
			<Close repo={source.repo} owner={source.owner} />
			<Burstiness repo={source.repo} owner={source.owner} {date} />
		{:else}
			Please enter a GitHub URL
		{/if}
	</div>
{/if}
