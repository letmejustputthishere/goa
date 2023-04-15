<script lang="ts">
	import BurstinessDiscussions from './BurstinessDiscussions.svelte';
	import BurstinessIssues from './BurstinessIssues.svelte';
	import BurstinessPRs from './BurstinessPRs.svelte';

	export let repo, owner, date;
	let selected;

	let metrics = [
		{
			label: 'Issues',
			component: BurstinessIssues
		},
		{
			label: 'PRs',
			component: BurstinessPRs
		},
		// {
		// 	label: 'Discussions',
		// 	component: BurstinessDiscussions
		// }
	];
</script>

<div>
	<p class="text-2xl">Burstiness</p>
	<select bind:value={selected} class="select select-bordered">
		{#each metrics as metric}
			<option value={metric.component}>{metric.label}</option>
		{/each}
	</select>
</div>

<svelte:component this={selected} {repo} {owner} {date} />
