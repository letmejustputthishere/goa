<script lang="ts">
	import Vega from '$lib/components/Vega.svelte';
	import { GQL_Languages } from '$houdini';
	import type { Languages$result } from '$houdini';
	import * as vl from 'vega-lite-api';
	import { onMount } from 'svelte';
	import { KitQLInfo } from '@kitql/all-in';
	import Graph from '$lib/components/Graph.svelte';

	export let repo, owner, date;
	let loading = true;

	function transformResponse(data: Languages$result, date): { [key: string]: string | number }[] {
		return data.repository.languages.edges.map(({ node, size }) => ({
			size,
			name: node.name
		}));
	}

	const viz = vl
		.markArc({
			// width: 2,
			tooltip: true,
			innerRadius: 50
		})
		.encode(vl.theta().fieldQ('size'), vl.color().field('name'));

	onMount(async () => {
		await GQL_Languages.fetch({ variables: { name: repo, owner } });
		loading = false;
	});
</script>

<!-- <KitQLInfo store={KQL_Languages} /> -->

<Graph store={GQL_Languages} {loading}>
	<Vega title="languages" data={transformResponse($GQL_Languages.data, date)} {viz} />
</Graph>
