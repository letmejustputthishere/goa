<script lang="ts">
	import Vega from '$lib/components/Vega.svelte';
	import { KQL_BurstinessPRs } from '$lib/graphql/_kitql/graphqlStores';
	import type { BurstinessPRsQuery } from '$lib/graphql/_kitql/graphqlTypes';
	import KitQlInfo from '@kitql/all-in/KitQLInfo.svelte';
	import * as vl from 'vega-lite-api';

	export let repo, owner, date;

	$: if (date !== undefined) {
		KQL_BurstinessPRs.query({
			variables: { querystring: `repo:${owner}/${repo} is:pr created:>${date}` }
		});
	}

	function transformResponse(data: BurstinessPRsQuery): { [key: string]: string | number }[] {
		return data.search.edges
			.map(({ node }) => {
				if (node.__typename === 'PullRequest') {
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
			vl.y().count().axis({ title: 'pr created' })
		);
</script>

<!-- before this is rendered, the query has already been sent and thus state is `isFetching` -->
{#if $KQL_BurstinessPRs.isFetching}
	Loading
{:else if $KQL_BurstinessPRs.errors}
	{JSON.stringify($KQL_BurstinessPRs.errors)}
{:else if $KQL_BurstinessPRs.data}
	<Vega title="pr burstiness" data={transformResponse($KQL_BurstinessPRs.data)} {viz} />
{/if}
