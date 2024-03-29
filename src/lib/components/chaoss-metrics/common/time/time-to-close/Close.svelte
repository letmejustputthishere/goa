<script lang="ts">
	import moment from 'moment';
	import { onMount } from 'svelte';
	import Vega from '$lib/components/Vega.svelte';
	import { GQL_Close } from '$houdini';
	import type { Close$result } from '$houdini';
	import { getHoudiniContext } from '$houdini';
	import * as vl from 'vega-lite-api';
	import Graph from '$lib/components/Graph.svelte';

	export let repo, owner, date;
	let loading = true;

	const context = getHoudiniContext();

	async function load() {
		// we dont have to check the date here because the query only returns
		// the last 6 months of data anyways
		if ($GQL_Close.pageInfo[0].hasNextPage) {
			await GQL_Close.loadNextPage(context);
			await load();
		}
		loading = false;
	}

	function transformResponse(data: Close$result, date): { [key: string]: string | number }[] {
		return (
			data.search.edges
				//  we filter for nodes that are created after the date we are interested in
				.filter(({ node }) => node.createdAt > date)
				.map(({ node }) => {
					if (node.__typename === 'Issue' && node.closedAt) {
						return {
							created: node.createdAt.toISOString(),
							closed: node.closedAt.toISOString(),
							url: node.url,
							duration:
								Math.abs(new Date(node.createdAt).getTime() - new Date(node.closedAt).getTime()) /
								(36e5 * 24)
						};
					}
				})
				.filter((elem) => elem !== undefined)
		);
	}

	// we create the param first
	const brush = vl.selectInterval().encodings('x');
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
				vl.y().aggregate('median').fieldQ('duration').axis({ title: 'median (in days)' }),
				vl.opacity().value(0.7).if(brush, vl.value(1))
				// .axis({ title: vl.expr('aggregation') })
			)
			// and then pass it into params
			.params(brush),
		vl
			.markRule({
				tooltip: true
			})
			.encode(
				vl.strokeWidth({ value: 4 }),
				vl.y().aggregate('mean').fieldQ('duration'),
				vl.color({ value: 'green' })
			)
			.transform(vl.filter(brush)),
		vl
			.markRule({
				tooltip: true,
				strokeWidth: 4
			})
			.encode(vl.y().aggregate('median').fieldQ('duration'), vl.color({ value: 'red' }))
			.transform(vl.filter(brush))
	);

	onMount(async () => {
		await GQL_Close.fetch({
			variables: {
				// we query for the last 6 months straight away and filter
				// depending on the selected timespan in `transformResponse`
				querystring: `repo:${owner}/${repo} is:issue created:>${moment()
					.subtract(6, 'months')
					.toDate()
					.toISOString()}`
			}
		});
		await load();
	});
</script>

<Graph store={GQL_Close} {loading}>
	<Vega title="time to close" data={transformResponse($GQL_Close.data, date)} {viz} />
</Graph>
