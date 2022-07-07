<script lang="ts">
	import Vega from '$lib/components/Vega.svelte';
	import { GQL_Forks } from '$houdini';
	import type { Forks$result } from '$houdini';
	import * as vl from 'vega-lite-api';
	import KitQlInfo from '@kitql/all-in/KitQLInfo.svelte';
	import { get } from 'svelte/store';
	import { getHoudiniContext } from '$houdini';
	import { onMount } from 'svelte';

	export let repo, owner;
	let loadingNextPage = true;

	const context = getHoudiniContext();

	function loadMore() {
		GQL_Forks.fetch({ variables: { name: repo, owner } });
		console.log('load');
		console.log($GQL_Forks.pageInfo.hasNextPage);
		if ($GQL_Forks.pageInfo.hasNextPage) {
			console.log('load');
			GQL_Forks.loadNextPage(context);
		}
		loadingNextPage = false;
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

	onMount(loadMore);
</script>

<button on:click={loadMore}>load more</button>

<!-- <KitQlInfo store={GQL_Forks} /> -->
<!-- before this is rendered, the query has already been sent and thus state is `isFetching` -->
{#if $GQL_Forks.isFetching}
	Loading
{:else if $GQL_Forks.errors}
	{JSON.stringify($GQL_Forks.errors)}
{:else if !loadingNextPage}
	<Vega title="resporitory forks" data={transformResponse($GQL_Forks.data)} {viz} />
{/if}
