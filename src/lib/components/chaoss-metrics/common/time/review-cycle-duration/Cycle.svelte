<script lang="ts">
	import { GQL_Cycle } from '$houdini';

	GQL_Cycle.fetch({ variables: { name: 'cpython', owner: 'python' } });
</script>

{#if $GQL_Cycle.isFetching}
	Loading
{:else if $GQL_Cycle.errors}
	{JSON.stringify($GQL_Cycle.errors)}
{:else}
	{@const data = $GQL_Cycle.data}
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
