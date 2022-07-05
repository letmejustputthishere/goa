<script lang="ts">
	import Vega from '$lib/components/Vega.svelte';
	import { GQL_BurstinessIssues } from '$houdini';
	import type { BurstinessIssues$result } from '$houdini';
	import { KitQLInfo } from '@kitql/all-in';
	import * as vl from 'vega-lite-api';

	export let repo, owner, date;

	$: if (date !== undefined) {
		GQL_BurstinessIssues.fetch({ variables: { name: repo, owner, date } });
	}

	function transformResponse(data: BurstinessIssues$result): { [key: string]: string | number }[] {
		return data.repository.issues.edges.map(({ node }) => ({
			date: node.createdAt.split('T')[0],
			url: node.url
		}));
	}

	const viz = vl
		.markTrail({
			tooltip: true,
			point: true
		})
		.encode(
			vl.x().timeYM('date').fieldO('date').axis({ title: 'Date', format: '%b %y' }),
			vl.y().count().axis({ title: 'Issues created' })
		);
</script>

<!-- before this is rendered, the query has already been sent and thus state is `isFetching` -->
{#if $GQL_BurstinessIssues.isFetching}
	Loading
{:else if $GQL_BurstinessIssues.errors}
	{JSON.stringify($GQL_BurstinessIssues.errors)}
{:else if $GQL_BurstinessIssues.data}
	<Vega title="issue burstiness" data={transformResponse($GQL_BurstinessIssues.data)} {viz} />
{/if}
