<script lang="ts">
	import { KQL_Collaborators } from '$lib/graphql/_kitql/graphqlStores';
	import { CollaboratorAffiliation } from '$lib/graphql/_kitql/graphqlTypes';

	KQL_Collaborators.query({
		variables: { name: 'ic', owner: 'dfinity', affiliation: CollaboratorAffiliation.Direct }
	});
</script>

{$KQL_Collaborators.isFetching ? 'Loading ...' : ''}

{#each $KQL_Collaborators.data?.repository.collaborators.nodes || [] as collaborator}
	<div>
		{collaborator.name}
		{collaborator.location}
	</div>
{/each}

{JSON.stringify($KQL_Collaborators.errors)}
