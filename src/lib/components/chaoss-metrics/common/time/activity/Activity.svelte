<script lang="ts">
	import moment from 'moment';
	import { onMount } from 'svelte';
	import Vega from '$lib/components/Vega.svelte';
	import type { Commits$result } from '$houdini';
	import { getHoudiniContext } from '$houdini';
	import * as vl from 'vega-lite-api';
	import { GQL_Commits } from '$houdini';
	import Graph from '$lib/components/Graph.svelte';

	export let repo, owner, date;
	let loading = true;

	const context = getHoudiniContext();

	async function load() {
		if (
			$GQL_Commits.pageInfo[0].hasNextPage &&
			$GQL_Commits.data.repository.defaultBranchRef.target.history.edges.at(-1).node.committedDate >
				moment().subtract(6, 'months').toDate()
		) {
			await GQL_Commits.loadNextPage(context);
			await load();
		}
		loading = false;
	}

	function transformResponse(data: Commits$result, date): { [key: string]: string | number }[] {
		let transformed = data.repository.defaultBranchRef.target.history.edges
			.filter((node) => node)
			.filter(({ node }) => node.committedDate > date)
			.map(({ node }) => {
				return {
					date: node.committedDate.toISOString()
				};
			});
		return transformed;
	}

	const viz = vl
		.markTrail({
			tooltip: true,
			point: true
		})
		.encode(
			vl.x().hours('date').axis({ title: 'Commit Hour (UTC)', format: '%H' }),
			vl.y().count().axis({ title: 'Commits' })
		);

	onMount(async () => {
		await GQL_Commits.fetch({ variables: { name: repo, owner } });
		await load();
	});
</script>

<Graph store={GQL_Commits} {loading}>
	<Vega title="commit activity" data={transformResponse($GQL_Commits.data, date)} {viz} />
</Graph>
