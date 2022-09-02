<script lang="ts">
	import Vega from '$lib/components/Vega.svelte';
	import { GQL_BurstinessIssues } from '$houdini';
	import moment from 'moment';
	import type { BurstinessIssues$result } from '$houdini';
	import { getHoudiniContext } from '$houdini';
	import * as vl from 'vega-lite-api';
	import { onMount } from 'svelte';
	import Graph from '$lib/components/Graph.svelte';

	export let repo, owner, date;
	let loading = true;

	const context = getHoudiniContext();

	async function load() {
		if (
			$GQL_BurstinessIssues.pageInfo[0].hasNextPage &&
			$GQL_BurstinessIssues.data.repository.issues.edges.at(-1).node.createdAt >
				moment().subtract(6, 'months').toDate()
		) {
			await GQL_BurstinessIssues.loadNextPage(context);
			await load();
		}
		loading = false;
	}

	function transformResponse(
		data: BurstinessIssues$result,
		date
	): { [key: string]: string | number }[] {
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

<Graph
	title="issue burstiness"
	{date}
	store={GQL_BurstinessIssues}
	{viz}
	{loading}
	{transformResponse}
/>
