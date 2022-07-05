<script lang="ts">
	import Vega from '$lib/components/Vega.svelte';
	import { GQL_Languages } from '$houdini';
	import type { Languages$result } from '$houdini';
	import * as vl from 'vega-lite-api';
	import { KitQLInfo } from '@kitql/all-in';

	export let repo, owner;

	GQL_Languages.fetch({ variables: { name: repo, owner } });

	function transformResponse(data: Languages$result): { [key: string]: string | number }[] {
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
{#if $GQL_Languages.isFetching}
	Loading
{:else if $GQL_Languages.errors}
	{JSON.stringify($GQL_Languages.errors)}
{:else}
	<Vega title="languages" data={transformResponse($GQL_Languages.data)} {viz} />
{/if}
