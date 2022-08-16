<script lang="ts">
	import Vega from '$lib/components/Vega.svelte';
	import { GQL_BurstinessDiscussions } from '$houdini';
	import moment from 'moment';
	import type { BurstinessDiscussions$result } from '$houdini';
	import { getHoudiniContext } from '$houdini';
	import { onMount } from 'svelte';
	import * as vl from 'vega-lite-api';

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

	const viz = vl
		.markTrail({
			tooltip: true,
			point: true
		})
		.encode(
			vl.x().timeYM('date').fieldO('date').axis({ title: 'Date', format: '%b %y' }),
			vl.y().count().axis({ title: 'discussions created' })
		);

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

<!-- before this is rendered, the query has already been sent and thus state is `isFetching` -->
{#if loading || $GQL_BurstinessDiscussions.isFetching}
	<div class="flex items-center justify-center mt-6">
		<progress class="progress w-56" />
	</div>
{:else if $GQL_BurstinessDiscussions.errors}
	{JSON.stringify($GQL_BurstinessDiscussions.errors)}
{:else if $GQL_BurstinessDiscussions.data && !loading}
	<Vega
		title="discussions burstiness"
		data={transformResponse($GQL_BurstinessDiscussions.data, date)}
		{viz}
	/>
{/if}
