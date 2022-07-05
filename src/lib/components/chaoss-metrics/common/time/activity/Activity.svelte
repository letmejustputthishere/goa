<script lang="ts">
	import { GQL_Commits } from '$houdini';

	GQL_Commits.fetch({ variables: { name: 'ic', owner: 'dfinity' } });
</script>

{$GQL_Commits.isFetching ? 'Loading ...' : ''}

{#await $GQL_Commits.data}
	Loading
{:then data}
	{JSON.stringify(data)}
{/await}

{#each $GQL_Commits.data?.repository.defaultBranchRef.target.__typename === 'Commit' ? $GQL_Commits.data?.repository.defaultBranchRef.target.history.nodes : [] || [] as commit}
	<div>
		{commit.committer.name}
		{commit.committedDate}
	</div>
{/each}
