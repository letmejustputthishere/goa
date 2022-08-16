<script lang="ts">
	import moment from 'moment';
	import { onMount } from 'svelte';
	import Vega from '$lib/components/Vega.svelte';
	import { GQL_BurstinessPRs } from '$houdini';
	import type { BurstinessPRs$result } from '$houdini';
	import KitQlInfo from '@kitql/all-in/KitQLInfo.svelte';
	import * as vl from 'vega-lite-api';
	import { getHoudiniContext } from '$houdini';

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

	const viz = vl
		.markTrail({
			tooltip: true,
			point: true
		})
		.encode(
			vl.x().timeYM('date').fieldO('date').axis({ title: 'Date', format: '%b %y' }),
			vl.y().count().axis({ title: 'pr created' })
		);

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

{#if loading || $GQL_BurstinessPRs.isFetching}
	<div class="flex items-center justify-center mt-6">
		<progress class="progress w-56" />
	</div>
{:else if $GQL_BurstinessPRs.errors}
	{JSON.stringify($GQL_BurstinessPRs.errors)}
{:else if $GQL_BurstinessPRs.data && !loading}
	<Vega title="pr burstiness" data={transformResponse($GQL_BurstinessPRs.data, date)} {viz} />
{/if}
