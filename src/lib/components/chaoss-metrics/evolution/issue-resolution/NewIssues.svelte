<script lang="ts">
	import moment from 'moment';
	import { onMount } from 'svelte';
	import Vega from '$lib/components/Vega.svelte';
	import { GQL_New } from '$houdini';
	import type { New$result } from '$houdini';
	import { getHoudiniContext } from '$houdini';
	import * as vl from 'vega-lite-api';
	import Graph from '$lib/components/Graph.svelte';

	export let repo, owner, date;
	let loading = true;

	const context = getHoudiniContext();

	async function load() {
		// we dont have to check the date here because the query only returns
		// the last 6 months of data anyways
		if ($GQL_New.pageInfo[0].hasNextPage) {
			await GQL_New.loadNextPage(context);
			await load();
		}
		loading = false;
	}

	function transformResponse(data: New$result, date): { [key: string]: string | number }[] {
		return (
			data.search.edges
				//  we filter for nodes that are created after the date we are interested in
				.filter(({ node }) => node.createdAt > date)
				// we filter for issues
				.filter(({ node }) => node.__typename === 'Issue')
				.map(({ node }) => {
					return {
						date: node.createdAt.toISOString(),
						author: node.author.login
					};
				})
		);
	}

	const viz = vl
		.markBar({
			tooltip: true
		})
		.encode(
			vl.x().timeYMD('date').axis({ title: 'Date', format: '%d %m' }),
			vl.y().count().axis({ title: 'New Issues' })
		);

	onMount(async () => {
		await GQL_New.fetch({
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

<Graph store={GQL_New} {loading}>
	<Vega title="new issues" data={transformResponse($GQL_New.data, date)} {viz} />
</Graph>
