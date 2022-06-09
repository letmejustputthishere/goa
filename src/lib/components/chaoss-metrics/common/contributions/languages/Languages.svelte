<script lang="ts">
	import { KQL_Languages } from '$lib/graphql/_kitql/graphqlStores';

	KQL_Languages.query({ variables: { name: 'glue-api', owner: 'glue-org' } });
</script>

{$KQL_Languages.isFetching ? 'Loading ...' : ''}

{#each $KQL_Languages.data?.repository.languages.nodes || [] as language}
	<div>
		{language.name}
	</div>
{/each}
