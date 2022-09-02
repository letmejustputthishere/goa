<script lang="ts">
	import Vega from '$lib/components/Vega.svelte';
	import { GQL_Forks } from '$houdini';
	import type { Forks$result } from '$houdini';
	import moment from 'moment';
	import * as vl from 'vega-lite-api';
	import { getHoudiniContext } from '$houdini';
	import { onMount } from 'svelte';
	import Graph from '$lib/components/Graph.svelte';

	export let repo, owner, date;
	let loading = true;

	const context = getHoudiniContext();

	async function load() {
		if (
			$GQL_Forks.pageInfo[0].hasNextPage &&
			$GQL_Forks.data.repository.forks.edges.at(-1).node.createdAt >
				moment().subtract(6, 'months').toDate()
		) {
			await GQL_Forks.loadNextPage(context);
			await load();
		}
		loading = false;
	}

	function transformResponse(data: Forks$result, date): { [key: string]: string | number }[] {
		return data.repository.forks.edges
			.filter((node) => node)
			.filter(({ node }) => node.createdAt > date)
			.map(({ node }) => {
				return {
					date: node.createdAt.toISOString(),
					url: node.url
				};
			});
	}

	const viz = vl
		.markTrail({
			tooltip: true,
			point: true
		})
		.encode(
			vl.x().timeYM('date').fieldO('date').axis({ title: 'Date', format: '%b %y' }),
			vl.y().count().axis({ title: 'Forks' })
		);

	onMount(async () => {
		await GQL_Forks.fetch({ variables: { name: repo, owner } });
		await load();
	});
</script>

<Graph store={GQL_Forks} {loading}>
	<Vega title="repository forks" data={transformResponse($GQL_Forks.data, date)} {viz} />
</Graph>
