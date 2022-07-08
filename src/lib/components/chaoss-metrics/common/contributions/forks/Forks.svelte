<script lang="ts">
	import Vega from '$lib/components/Vega.svelte';
	import { GQL_Forks } from '$houdini';
	import type { Forks$result } from '$houdini';
	import * as vl from 'vega-lite-api';
	import { getHoudiniContext } from '$houdini';
	import { onMount } from 'svelte';

	export let repo, owner;
	let loading = true;

	const context = getHoudiniContext();

	async function load() {
		console.log($GQL_Forks.pageInfo[0]);
		if ($GQL_Forks.pageInfo[0].hasNextPage) {
			console.log('load');
			await GQL_Forks.loadNextPage(context);
			load();
		}
		loading = false;
	}

	function transformResponse(data: Forks$result): { [key: string]: string | number }[] {
		return data.repository.forks.edges.map(({ node }) => {
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

<!-- <KitQlInfo store={GQL_Forks} /> -->
<!-- before this is rendered, the query has already been sent and thus state is `isFetching` -->
{#if $GQL_Forks.isFetching}
	Loading
{:else if $GQL_Forks.errors}
	{JSON.stringify($GQL_Forks.errors)}
{:else if !loading}
	<Vega title="resporitory forks" data={transformResponse($GQL_Forks.data)} {viz} />
{/if}
