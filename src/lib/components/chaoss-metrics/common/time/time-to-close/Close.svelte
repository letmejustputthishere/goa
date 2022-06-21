<script lang="ts">
	import Vega from '$lib/components/Vega.svelte';
	import { KQL_Close } from '$lib/graphql/_kitql/graphqlStores';
	import type { CloseQuery } from '$lib/graphql/_kitql/graphqlTypes';
	import * as vl from 'vega-lite-api';

	KQL_Close.query({
		variables: { querystring: 'repo:python/cpython is:issue created:2010-12-30..2018-01-01' }
	});

	function transformResponse(data: CloseQuery): { [key: string]: string | number }[] {
		return data.search.edges
			.map(({ node }) => {
				if (node.__typename === 'Issue' && node.closedAt) {
					return {
						created: node.createdAt,
						closed: node.closedAt,
						url: node.url,
						duration:
							Math.abs(new Date(node.createdAt).getTime() - new Date(node.closedAt).getTime()) /
							(36e5 * 24)
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
{#if $KQL_Close.isFetching}
	Loading
{:else if $KQL_Close.errors}
	{JSON.stringify($KQL_Close.errors)}
{:else}
	<Vega title="time to close" data={transformResponse($KQL_Close.data)} {viz} />
{/if}
