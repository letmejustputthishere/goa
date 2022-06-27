<script lang="ts">
	import { KQL_Commits } from '$lib/graphql/_kitql/graphqlStores';

	KQL_Commits.query({ variables: { name: 'ic', owner: 'dfinity' } });
</script>

{$KQL_Commits.isFetching ? 'Loading ...' : ''}

{#await $KQL_Commits.data}
	Loading
{:then data}
	{JSON.stringify(data)}
{/await}

{#each $KQL_Commits.data?.repository.defaultBranchRef.target.__typename === 'Commit' ? $KQL_Commits.data?.repository.defaultBranchRef.target.history.nodes : [] || [] as commit}
	<div>
		{commit.committer.name}
		{commit.committedDate}
	</div>
{/each}
