<script lang="ts">
	import { GQL_FirstResponse } from '$houdini';
	import moment from 'moment';
	import { onMount } from 'svelte';
	import Vega from '$lib/components/Vega.svelte';
	import type { FirstResponse$result } from '$houdini';
	import { getHoudiniContext } from '$houdini';
	import * as vl from 'vega-lite-api';
	import Graph from '$lib/components/Graph.svelte';

	export let repo, owner, date;
	let loading = true;

	const context = getHoudiniContext();

	async function load() {
		// we dont have to check the date here because the query only returns
		// the last 6 months of data anyways
		if ($GQL_FirstResponse.pageInfo[0].hasNextPage) {
			await GQL_FirstResponse.loadNextPage(context);
			await load();
		}
		loading = false;
	}

	function transformResponse(
		data: FirstResponse$result,
		date
	): { [key: string]: string | number }[] {
		return (
			data.search.edges
				//  we filter nodes that dont have timeline items yet
				.filter(({ node }) => node.timelineItems.nodes[0])
				//  we filter for nodes that are created after the date we are interested in
				.filter(({ node }) => node.createdAt > date)
				.map(({ node }) => {
					let firstResponse = node.timelineItems.nodes
						//  we filter timeline items that have no author or actor
						.filter((node) => ('author' in node ? node.author : node.actor))
						// we filter timeline items that are created by bots
						.find((timelineItem) => {
							let author =
								'author' in timelineItem
									? timelineItem.author.__typename
									: timelineItem.actor.__typename;
							return author === 'User';
						});
					if (!firstResponse) {
						return;
					}
					let newNode = {
						created: node.createdAt.toISOString(),
						duration:
							Math.abs(
								new Date(node.createdAt).getTime() - new Date(firstResponse.createdAt).getTime()
							) / 36e5
					};
					return newNode;
				})
				.filter((elem) => elem !== undefined)
		);
	}

	const viz = vl.layer(
		vl
			.markBar({
				tooltip: true
			})
			// .params(
			// 	vl.param('year').value(2018).bind(vl.slider(2010, 2018, 1))
			// vl.param('aggregation').value('mean').bind(vl.menu('mean', 'sum', 'count'))
			// )
			// .transform(vl.filter('year(datum.created) === year'))
			.encode(
				vl.x().timeYM('created').fieldO('created').axis({ title: 'Date', format: '%b %y' }),
				vl.y().aggregate('mean').fieldQ('duration').axis({ title: 'mean (in hours)' })
				// .axis({ title: vl.expr('aggregation') })
			),
		vl
			.markRule({
				tooltip: true
			})
			.encode(
				vl.strokeWidth({ value: 4 }),
				vl.y().aggregate('mean').fieldQ('duration'),
				vl.color({ value: 'green' })
			),
		vl
			.markRule({
				tooltip: true,
				strokeWidth: 4
			})
			.encode(vl.y().aggregate('median').fieldQ('duration'), vl.color({ value: 'red' }))
	);

	onMount(async () => {
		await GQL_FirstResponse.fetch({
			variables: {
				// we query for the last 6 months straight away and filter
				// depending on the selected timespan in `transformResponse`
				querystring: `repo:${owner}/${repo} is:pr created:>${moment()
					.subtract(6, 'months')
					.toDate()
					.toISOString()}`
			}
		});
		await load();
	});
</script>

<Graph title="time to close" {date} store={GQL_FirstResponse} {viz} {loading} {transformResponse} />
