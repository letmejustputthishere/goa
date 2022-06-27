<script lang="ts">
	import Vega from '$lib/components/Vega.svelte';
	import { KQL_BurstinessDiscussions } from '$lib/graphql/_kitql/graphqlStores';
	import type { BurstinessDiscussionsQuery } from '$lib/graphql/_kitql/graphqlTypes';
	import KitQlInfo from '@kitql/all-in/KitQLInfo.svelte';
	import * as vl from 'vega-lite-api';

	export let repo, owner, date;

	$: if (date !== undefined) {
		KQL_BurstinessDiscussions.query({
			variables: { querystring: `repo:${owner}/${repo} created:>${date}` }
		});
	}

	function transformResponse(
		data: BurstinessDiscussionsQuery
	): { [key: string]: string | number }[] {
		return data.search.edges
			.map(({ node }) => {
				if (node.__typename === 'Discussion') {
					return {
						date: node.createdAt.split('T')[0],
						url: node.url
					};
				}
			})
			.filter((elem) => elem !== undefined);
	}

	const viz = vl
		.markTrail({
			tooltip: true,
			point: true
		})
		.encode(
			vl.x().timeYM('date').fieldO('date').axis({ title: 'Date', format: '%b %y' }),
			vl.y().count().axis({ title: 'discussions created' })
		);
</script>

<!-- before this is rendered, the query has already been sent and thus state is `isFetching` -->
{#if $KQL_BurstinessDiscussions.isFetching}
	Loading
{:else if $KQL_BurstinessDiscussions.errors}
	{JSON.stringify($KQL_BurstinessDiscussions.errors)}
{:else if $KQL_BurstinessDiscussions.data}
	<Vega
		title="burstiness discussion"
		data={transformResponse($KQL_BurstinessDiscussions.data)}
		{viz}
	/>
{/if}
