<script lang="ts">
	import { GQL_BurstinessDiscussions } from '$houdini';
	import moment from 'moment';
	import type { BurstinessDiscussions$result } from '$houdini';
	import { getHoudiniContext } from '$houdini';
	import { onMount } from 'svelte';
	import * as vl from 'vega-lite-api';
	import Graph from '$lib/components/Graph.svelte';
	import VegaConcat from '$lib/components/VegaConcat.svelte';

	export let repo, owner, date;
	let loading = true;

	const context = getHoudiniContext();

	async function load() {
		// we dont have to check the date here because the query only returns
		// the last 6 months of data anyways
		if ($GQL_BurstinessDiscussions.pageInfo[0].hasNextPage) {
			await GQL_BurstinessDiscussions.loadNextPage(context);
			await load();
		}
		loading = false;
	}

	function transformResponse(
		data: BurstinessDiscussions$result,
		date
	): { [key: string]: string | number }[] {
		return (
			data.search.edges
				//  we filter for nodes that are created after the date we are interested in
				.filter(({ node }) => node.createdAt > date)
				.map(({ node }) => {
					if (node.__typename === 'Discussion') {
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
			vl.y().count().axis({ title: 'discussions created' })
		);

	let viz2 = vl
		.markArea()
		.params(brush)
		.encode(
			vl.x().timeYMD('date').fieldT('date').axis({ title: 'Date', format: '%b %y' }),
			vl.y().count().axis({ title: 'discussions created' })
		);

	let viz = [viz1, viz2];

	onMount(async () => {
		await GQL_BurstinessDiscussions.fetch({
			variables: {
				// we query for the last 6 months straight away and filter
				// depending on the selected timespan in `transformResponse`
				querystring: `repo:${owner}/${repo} created:>${moment()
					.subtract(6, 'months')
					.toDate()
					.toISOString()}`
			}
		});
		await load();
	});
</script>

<Graph store={GQL_BurstinessDiscussions} {loading}>
	<VegaConcat
		title="discussions burstiness"
		data={transformResponse($GQL_BurstinessDiscussions.data, date)}
		{viz}
	/>
</Graph>
