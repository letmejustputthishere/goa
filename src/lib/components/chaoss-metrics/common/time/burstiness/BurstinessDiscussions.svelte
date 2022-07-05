<script lang="ts">
	import Vega from '$lib/components/Vega.svelte';
	import { GQL_BurstinessDiscussions } from '$houdini';
	import type { BurstinessDiscussions$result } from '$houdini';
	import KitQlInfo from '@kitql/all-in/KitQLInfo.svelte';
	import * as vl from 'vega-lite-api';

	export let repo, owner, date;

	$: if (date !== undefined) {
		GQL_BurstinessDiscussions.fetch({
			variables: { querystring: `repo:${owner}/${repo} created:>${date}` }
		});
	}

	function transformResponse(
		data: BurstinessDiscussions$result
	): { [key: string]: string | number }[] {
		return data.search.edges
			.map(({ node }) => {
				if (node.__typename === 'Discussion') {
					return {
						date: node.createdAt.split('T')[0],
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
</script>

<!-- before this is rendered, the query has already been sent and thus state is `isFetching` -->
{#if $GQL_BurstinessDiscussions.isFetching}
	Loading
{:else if $GQL_BurstinessDiscussions.errors}
	{JSON.stringify($GQL_BurstinessDiscussions.errors)}
{:else if $GQL_BurstinessDiscussions.data}
	<Vega
		title="burstiness discussion"
		data={transformResponse($GQL_BurstinessDiscussions.data)}
		{viz}
	/>
{/if}
