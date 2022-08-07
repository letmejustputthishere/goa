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
		if (
			$GQL_BurstinessDiscussions.pageInfo[0].hasNextPage &&
			$GQL_BurstinessDiscussions.data.search.edges.at(-1).node.createdAt >
				moment().subtract(6, 'months').toDate()
		) {
			await GQL_BurstinessDiscussions.loadNextPage(context);
			await load();
		}
		loading = false;
	}

	function transformResponse(
		data: BurstinessDiscussions$result
	): { [key: string]: string | number }[] {
		return data.search.edges
			.map(({ node }) => {
				if (node.__typename === 'Discussion') {
					return {
						date: node.createdAt.toISOString(),
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
			vl.y().count().axis({ title: 'discussions created' })
		);

	onMount(async () => {
		await GQL_BurstinessDiscussions.fetch({
			variables: {
				querystring: `repo:${owner}/${repo} created:>${date}`
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
	<Vega title="issue burstiness" data={transformResponse($GQL_BurstinessDiscussions.data)} {viz} />
{/if}
