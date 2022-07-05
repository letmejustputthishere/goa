<script lang="ts">
	import Vega from '$lib/components/Vega.svelte';
	import { GQL_Forks } from '$houdini';
	import type { Forks$result } from '$houdini';
	import * as vl from 'vega-lite-api';

	export let repo, owner;

	GQL_Forks.fetch({ variables: { name: repo, owner } });

	function transformResponse(data: Forks$result): { [key: string]: string | number }[] {
		return data.repository.forks.edges.map(({ node }) => ({
			date: node.createdAt.split('T')[0],
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
			vl.y().count().axis({ title: 'Forks' })
		);
</script>

<!-- before this is rendered, the query has already been sent and thus state is `isFetching` -->
{#if $GQL_Forks.isFetching}
	Loading
{:else if $GQL_Forks.errors}
	{JSON.stringify($GQL_Forks.errors)}
{:else}
	<Vega title="resporitory forks" data={transformResponse($GQL_Forks.data)} {viz} />
{/if}
