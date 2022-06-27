<script lang="ts">
	import Forks from '$lib/components/chaoss-metrics/common/contributions/forks/Forks.svelte';
	import Languages from '$lib/components/chaoss-metrics/common/contributions/languages/Languages.svelte';
	import Close from '$lib/components/chaoss-metrics/common/time/time-to-close/Close.svelte';
	import DateRangeSelector from '$lib/components/DateRangeSelector.svelte';
	import GitHubUrlInput from '$lib/components/GitHubUrlInput.svelte';

	let source: { repo: string; owner: string } = null;
	let date;
</script>

<div class="flex flex-col justify-center m-6">
	<div class="flex justify-center">
		<DateRangeSelector bind:selected={date} />
		<GitHubUrlInput bind:source />
	</div>
	{#if source}
		<Forks repo={source.repo} owner={source.owner} />
		<Languages repo={source.repo} owner={source.owner} />
		<Close repo={source.repo} owner={source.owner} />
	{:else}
		Please enter a GitHub URL
	{/if}
</div>
