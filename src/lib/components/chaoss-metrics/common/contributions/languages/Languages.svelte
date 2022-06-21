<script lang="ts">
	import Vega from '$lib/components/Vega.svelte';
	import { KQL_Languages } from '$lib/graphql/_kitql/graphqlStores';
	import type { LanguagesQuery } from '$lib/graphql/_kitql/graphqlTypes';
	import * as vl from 'vega-lite-api';
	import { KitQLInfo } from '@kitql/all-in';

	KQL_Languages.query({ variables: { name: 'ic', owner: 'dfinity' } });

	function transformResponse(data: LanguagesQuery): { [key: string]: string | number }[] {
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
</script>

<!-- <KitQLInfo store={KQL_Languages} /> -->

<!-- before this is rendered, the query has already been sent and thus state is `isFetching` -->
{#if $KQL_Languages.isFetching}
	Loading
{:else if $KQL_Languages.errors}
	{JSON.stringify($KQL_Languages.errors)}
{:else}
	<Vega title="languages" data={transformResponse($KQL_Languages.data)} {viz} />
{/if}
