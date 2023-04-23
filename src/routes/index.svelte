<script lang="ts">
	import Forks from '$lib/components/chaoss-metrics/common/contributions/forks/Forks.svelte';
	import Languages from '$lib/components/chaoss-metrics/common/contributions/languages/Languages.svelte';
	import Burstiness from '$lib/components/chaoss-metrics/common/time/burstiness/Burstiness.svelte';
	import Close from '$lib/components/chaoss-metrics/common/time/time-to-close/Close.svelte';
	import DateRangeSelector from '$lib/components/DateRangeSelector.svelte';
	import Collaborators from '$lib/components/chaoss-metrics/common/contributions/collaborators/Collaborators.svelte';
	import Activity from '$lib/components/chaoss-metrics/common/time/activity/Activity.svelte';
	import GitHubUrlInput from '$lib/components/GitHubUrlInput.svelte';
	import { store } from '../store';
	import { onMount } from 'svelte';
	import { exchangeCodeForToken, setup, logout } from '../oauth';
	import FirstResponse from '$lib/components/chaoss-metrics/common/time/time-to-first-response/FirstResponse.svelte';
	import BurstinessDiscussions from '$lib/components/chaoss-metrics/common/time/burstiness/BurstinessDiscussions.svelte';
	import BurstinessIssues from '$lib/components/chaoss-metrics/common/time/burstiness/BurstinessIssues.svelte';
	import BurstinessPRs from '$lib/components/chaoss-metrics/common/time/burstiness/BurstinessPRs.svelte';

	let source: { repo: string; owner: string } = null;
	// let source: { repo: string; owner: string } = {
	// 	repo: 'kit',
	// 	owner: 'sveltejs'
	// };
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

<div class="flex flex-col justify-center m-6">
	{#if !$store.isAuthed}
		<div class="flex justify-center fixed top-0 my-10 inset-x-0 z-10">
			<a href="/api/github/oauth/login">
				<button class="btn"> login </button>
			</a>
		</div>
	{:else}
		<div class="flex justify-center fixed top-0 my-10 inset-x-0 z-10">
			<DateRangeSelector bind:selected={date} />
			<GitHubUrlInput bind:source />
			<button class="btn" on:click={() => logout({ invalidateToken: true })}>logout</button>
		</div>
		{#if source}
			<div class="my-20">
				<Forks repo={source.repo} owner={source.owner} {date} />
				<!-- <Collaborators repo={source.repo} owner={source.owner} {date} /> -->
				<Languages repo={source.repo} owner={source.owner} {date} />
				<Close repo={source.repo} owner={source.owner} {date} />
				<FirstResponse repo={source.repo} owner={source.owner} {date} />
				<!-- <Burstiness repo={source.repo} owner={source.owner} {date} /> -->
				<!-- <BurstinessDiscussions repo={source.repo} owner={source.owner} {date} /> -->
				<BurstinessIssues repo={source.repo} owner={source.owner} {date} />
				<BurstinessPRs repo={source.repo} owner={source.owner} {date} />
				<Activity repo={source.repo} owner={source.owner} {date} />
			</div>
		{:else}
			Please enter a GitHub URL
		{/if}
	{/if}
</div>
