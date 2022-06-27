<script lang="ts">
	import Vega from '$lib/components/Vega.svelte';
	import { KQL_BurstinessPRs } from '$lib/graphql/_kitql/graphqlStores';
	import type { BurstinessPRsQuery } from '$lib/graphql/_kitql/graphqlTypes';
	import * as vl from 'vega-lite-api';

	export let repo, owner;

	KQL_BurstinessPRs.query({
		variables: { querystring: `repo:${owner}/${repo} created:2010-12-30..2018-01-01` }
	});

	function transformResponse(data: BurstinessPRsQuery): { [key: string]: string | number }[] {
		return data.search.edges
			.map(({ node }) => {
				if (node.__typename === 'PullRequest') {
					return {
						created: node.createdAt,
						url: node.url
					};
				}
			})
			.filter((elem) => elem !== undefined);
	}

	const viz = vl
		.markBar({
			tooltip: true
		})
		.params(
			vl.param('year').value(2018).bind(vl.slider(2010, 2018, 1))
			// vl.param('aggregation').value('mean').bind(vl.menu('mean', 'sum', 'count'))
		)
		.transform(vl.filter('year(datum.created) === year'))
		.encode(
			vl.x().timeYM('created').fieldO('created').axis({ title: 'Date', format: '%b %y' }),
			vl.y().aggregate('median').fieldQ('duration').axis({ title: 'median' })
			// .axis({ title: vl.expr('aggregation') })
		);
</script>

<!-- before this is rendered, the query has already been sent and thus state is `isFetching` -->
{#if $KQL_BurstinessPRs.isFetching}
	Loading
{:else if $KQL_BurstinessPRs.errors}
	{JSON.stringify($KQL_BurstinessPRs.errors)}
{:else}
	<Vega title="time to close" data={transformResponse($KQL_BurstinessPRs.data)} {viz} />
{/if}
