<script lang="ts">
	import { GQL_FirstResponse } from '$houdini';

	// this is run first on every render
	GQL_FirstResponse.fetch({
		variables: {
			querystring: 'repo:python/cpython is:pr created:2010-12-30..2018-01-01',
			endCursor: 'Y3Vyc29yOjIwMA=='
		}
	});
</script>

<!-- before this is rendered, the query has already been sent and thus state is `isFetching` -->
{#if $GQL_FirstResponse.isFetching}
	Loading
{:else if $GQL_FirstResponse.errors}
	{JSON.stringify($GQL_FirstResponse.errors)}
{:else}
	{@const data = $GQL_FirstResponse.data}
	<div class="text-2xl text-red-500 text-center">
		pull requests (add lables not from author and remove bot interactions)
	</div>
	{data.search.issueCount}
	{data.search.edges.length}
	{#each data.search.edges || [] as pr}
		{#if pr.node.__typename === 'PullRequest'}
			<div>
				<div>created: {pr.node.createdAt}</div>
				<a href={pr.node.url}>link</a>
				{#each pr.node.timelineItems.nodes as timelineItem}
					{#if timelineItem.__typename === ('AssignedEvent' || 'ClosedEvent' || 'IssueComment' || 'MergedEvent' || 'PullRequestReview' || 'ReadyForReviewEvent' || 'ReviewRequestedEvent' || 'MarkedAsDuplicateEvent' || 'MilestonedEvent')}
						<div>{timelineItem.__typename}</div>
						<div>{timelineItem.createdAt}</div>
						<br />
					{/if}
				{/each}
			</div>
		{/if}
	{/each}
{/if}
