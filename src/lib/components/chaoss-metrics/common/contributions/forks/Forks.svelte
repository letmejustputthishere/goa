<script lang="ts">
	import { KQL_Forks } from '$lib/graphql/_kitql/graphqlStores';

	KQL_Forks.query({ variables: { name: 'ic', owner: 'dfinity' } });
</script>

{$KQL_Forks.isFetching ? 'Loading ...' : ''}

{#each $KQL_Forks.data?.repository.forks.nodes || [] as fork}
	<div>
		{fork.createdAt}
		{fork.name}
	</div>
{/each}
