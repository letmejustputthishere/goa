<script lang="ts">
	import Vega from '$lib/components/Vega.svelte';
	import { KQL_Forks } from '$lib/graphql/_kitql/graphqlStores';
	import type { ForksQuery } from '$lib/graphql/_kitql/graphqlTypes';
	import * as vl from 'vega-lite-api';

	KQL_Forks.query({ variables: { name: 'ic', owner: 'dfinity' } });

	function transformResponse(data: ForksQuery): { [key: string]: string | number }[] {
		return data.repository.forks.edges.map(({ node }) => ({
			date: node.createdAt.split('T')[0],
			url: node.url
		}));
	}

	const viz = vl
		.markBar({
			tooltip: true
		})
		.encode(
			vl.x().timeYM('date').fieldO('date').axis({ title: 'Date', format: '%b %y' }),
			vl.y().count().axis({ title: 'Forks' })
		);
</script>

<!-- before this is rendered, the query has already been sent and thus state is `isFetching` -->
{#if $KQL_Forks.isFetching}
	Loading
{:else if $KQL_Forks.errors}
	{JSON.stringify($KQL_Forks.errors)}
{:else}
	<Vega title="resporitory forks" data={transformResponse($KQL_Forks.data)} {viz} />
{/if}
