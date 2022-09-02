<script lang="ts">
	import { getHoudiniContext } from '$houdini';
	import { GQL_Collaborators, CollaboratorAffiliation, Collaborators$result } from '$houdini';
	import * as vl from 'vega-lite-api';
	import { onMount } from 'svelte';
	import Vega from '$lib/components/Vega.svelte';
	import Graph from '$lib/components/Graph.svelte';

	export let repo, owner, date;
	let loading = true;

	const context = getHoudiniContext();

	async function load() {
		if ($GQL_Collaborators.pageInfo[0].hasNextPage) {
			await GQL_Collaborators.loadNextPage(context);
			await load();
		}
		loading = false;
	}

	function transformResponse(
		data: Collaborators$result,
		date
	): { [key: string]: string | number }[] {
		let aggregation = [];
		data.repository.collaborators.edges.forEach(({ node }) => {
			// count appearance of each location
			let index = aggregation.findIndex(({ location }) => location === node.location);
			if (index === -1) {
				aggregation.push({ location: node.location, count: 1 });
			} else {
				aggregation[index].count++;
			}
		});
		return aggregation;
	}

	const viz = vl
		.markArc({
			// width: 2,
			tooltip: true,
			innerRadius: 50
		})
		.encode(vl.theta().fieldQ('count'), vl.color().field('location'));

	onMount(async () => {
		await GQL_Collaborators.fetch({ variables: { name: repo, owner } });
		await load();
	});
</script>

<Graph store={GQL_Collaborators} {loading}>
	<Vega title="collaborators" data={transformResponse($GQL_Collaborators.data, date)} {viz} />
</Graph>
