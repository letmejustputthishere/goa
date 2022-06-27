<script lang="ts">
	import Vega from '$lib/components/Vega.svelte';
	import { KQL_BurstinessIssues } from '$lib/graphql/_kitql/graphqlStores';
	import type { BurstinessIssuesQuery } from '$lib/graphql/_kitql/graphqlTypes';
	import { KitQLInfo } from '@kitql/all-in';
	import * as vl from 'vega-lite-api';

	export let repo, owner, date;

	$: if (date !== undefined) {
		KQL_BurstinessIssues.query({ variables: { name: repo, owner, date } });
	}

	function transformResponse(data: BurstinessIssuesQuery): { [key: string]: string | number }[] {
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
{#if $KQL_BurstinessIssues.isFetching}
	Loading
{:else if $KQL_BurstinessIssues.errors}
	{JSON.stringify($KQL_BurstinessIssues.errors)}
{:else if $KQL_BurstinessIssues.data}
	<Vega title="issue burstiness" data={transformResponse($KQL_BurstinessIssues.data)} {viz} />
{/if}
