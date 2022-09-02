<script lang="ts">
	import moment from 'moment';
	import { onMount } from 'svelte';
	import { GQL_BurstinessPRs } from '$houdini';
	import type { BurstinessPRs$result } from '$houdini';
	import KitQlInfo from '@kitql/all-in/KitQLInfo.svelte';
	import * as vl from 'vega-lite-api';
	import { getHoudiniContext } from '$houdini';
	import Graph from '$lib/components/Graph.svelte';
	import VegaConcat from '$lib/components/VegaConcat.svelte';

	export let repo, owner, date;
	let loading = true;

	const context = getHoudiniContext();

	async function load() {
		// we dont have to check the date here because the query only returns
		// the last 6 months of data anyways
		if ($GQL_BurstinessPRs.pageInfo[0].hasNextPage) {
			await GQL_BurstinessPRs.loadNextPage(context);
			await load();
		}
		loading = false;
	}

	function transformResponse(
		data: BurstinessPRs$result,
		date
	): { [key: string]: string | number }[] {
		return (
			data.search.edges
				//  we filter for nodes that are created after the date we are interested in
				.filter(({ node }) => node.createdAt > date)
				.map(({ node }) => {
					if (node.__typename === 'PullRequest') {
						return {
							date: node.createdAt.toISOString(),
							url: node.url
						};
					}
				})
				.filter((elem) => elem !== undefined)
		);
	}

	const brush = vl.selectInterval('brush').encodings(['x']);

	let viz1 = vl
		.markArea({
			tooltip: true,
			point: true
		})
		.encode(
			vl.x().timeYMD('date').fieldT('date').axis({ title: '' }).scale({ domain: brush }),
			vl.y().count().axis({ title: 'pr created' })
		);

	let viz2 = vl
		.markArea()
		.params(brush)
		.encode(
			vl.x().timeYMD('date').fieldT('date').axis({ title: 'Date', format: '%b %y' }),
			vl.y().count().axis({ title: 'pr created' })
		);

	let viz = [viz1, viz2];

	onMount(async () => {
		await GQL_BurstinessPRs.fetch({
			variables: {
				// we query for the last 6 months straight away and filter
				// depending on the selected timespan in `transformResponse`.
				// using the search will always only return 1000 items maximum
				querystring: `repo:${owner}/${repo} is:pr created:>${moment()
					.subtract(6, 'months')
					.toDate()
					.toISOString()}`
			}
		});
		await load();
	});
</script>

<Graph store={GQL_BurstinessPRs} {loading}>
	<VegaConcat title="pr burstiness" data={transformResponse($GQL_BurstinessPRs.data, date)} {viz} />
</Graph>
