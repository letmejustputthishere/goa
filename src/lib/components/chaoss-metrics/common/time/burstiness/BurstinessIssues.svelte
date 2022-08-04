<script lang="ts">
	import Vega from '$lib/components/Vega.svelte';
	import { GQL_BurstinessIssues } from '$houdini';
	import type { BurstinessIssues$result } from '$houdini';
	import { getHoudiniContext } from '$houdini';
	import * as vl from 'vega-lite-api';
	import { onMount } from 'svelte';

	export let repo, owner, date;
	let loading = true;
	const context = getHoudiniContext();

	// $: if (date !== undefined) {
	// 	GQL_BurstinessIssues.fetch({ variables: { name: repo, owner, date } });
	// }
	async function load() {
		if (
			$GQL_BurstinessIssues.pageInfo[0].hasNextPage &&
			$GQL_BurstinessIssues.data.repository.issues.edges.at(-1).node.createdAt > date
		) {
			await GQL_BurstinessIssues.loadNextPage(context);
			await load();
		}
		loading = false;
	}

	function transformResponse(data: BurstinessIssues$result): { [key: string]: string | number }[] {
		return data.repository.issues.edges
			.filter(({ node }) => node.createdAt > date)
			.map(({ node }) => ({
				date: node.createdAt.toISOString(),
				url: node.url
			}));
	}

	const viz = vl
		.markTrail({
			tooltip: true,
			point: true
		})
		.encode(
			vl.x().timeYM('date').fieldO('date').axis({ title: 'Date', format: '%b %y' }),
			vl.y().count().axis({ title: 'Issues created' })
		);

	onMount(async () => {
		await GQL_BurstinessIssues.fetch({ variables: { name: repo, owner } });
		await load();
	});
</script>

<!-- before this is rendered, the query has already been sent and thus state is `isFetching` -->
{#if loading || $GQL_BurstinessIssues.isFetching}
	<div class="flex items-center justify-center mt-6">
		<progress class="progress w-56" />
	</div>
{:else if $GQL_BurstinessIssues.errors}
	{JSON.stringify($GQL_BurstinessIssues.errors)}
{:else if $GQL_BurstinessIssues.data && !loading}
	<Vega title="issue burstiness" data={transformResponse($GQL_BurstinessIssues.data)} {viz} />
{/if}
