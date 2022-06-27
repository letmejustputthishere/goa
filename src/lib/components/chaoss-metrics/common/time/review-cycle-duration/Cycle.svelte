<script lang="ts">
	import { KQL_Cycle } from '$lib/graphql/_kitql/graphqlStores';

	KQL_Cycle.query({ variables: { name: 'cpython', owner: 'python' } });
</script>

{#if $KQL_Cycle.isFetching}
	Loading
{:else if $KQL_Cycle.errors}
	{JSON.stringify($KQL_Cycle.errors)}
{:else}
	{@const data = $KQL_Cycle.data}
	<div class="text-2xl text-red-500 text-center">issues</div>
	<div class="text-2xl text-red-500 text-center">pull requests</div>
	{#each data.repository.pullRequests.edges || [] as pr}
		<div>
			created: {pr.node.createdAt}
			closed: {pr.node.closedAt}
			<!-- there is way more in the query than that -->
		</div>
	{/each}
{/if}
