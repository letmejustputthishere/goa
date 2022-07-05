<script lang="ts">
	import { browser } from '$app/env';
	import { GQL_Collaborators, CollaboratorAffiliation } from '$houdini';

	$: browser &&
		GQL_Collaborators.fetch({
			variables: { name: 'ic', owner: 'dfinity', affiliation: CollaboratorAffiliation.DIRECT }
		});
</script>

{$GQL_Collaborators.isFetching ? 'Loading ...' : ''}

{#each $GQL_Collaborators.data?.repository.collaborators.nodes || [] as collaborator}
	<div>
		{collaborator.name}
		{collaborator.location}
	</div>
{/each}

{JSON.stringify($GQL_Collaborators.errors)}
