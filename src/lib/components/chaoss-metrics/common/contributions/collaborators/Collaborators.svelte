<script lang="ts">
	import { getHoudiniContext } from '$houdini';
	import { GQL_Collaborators, CollaboratorAffiliation, Collaborators$result } from '$houdini';
	import * as vl from 'vega-lite-api';
	import { onMount } from 'svelte';
	import Vega from '$lib/components/Vega.svelte';

	export let repo, owner;
	let loading = true;

	const context = getHoudiniContext();

	async function load() {
		if ($GQL_Collaborators.pageInfo[0].hasNextPage) {
			await GQL_Collaborators.loadNextPage(context);
			await load();
		}
		loading = false;
	}

	function transformResponse(data: Collaborators$result): { [key: string]: string | number }[] {
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

{#if $GQL_Collaborators.errors}
	<div class="justify-center flex items-center">
		{JSON.stringify($GQL_Collaborators.errors[0].message)}
	</div>
{:else if loading || $GQL_Collaborators.isFetching}
	<div class="flex items-center justify-center mt-6">
		<progress class="progress w-56" />
	</div>
{:else if $GQL_Collaborators.data && !loading}
	<Vega title="resporitory forks" data={transformResponse($GQL_Collaborators.data)} {viz} />
{/if}
