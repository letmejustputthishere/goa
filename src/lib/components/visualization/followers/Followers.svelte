<script lang="ts">
	import { KQL_Followers } from '$lib/graphql/_kitql/graphqlStores';
	import UserInfo from '../user/UserInfo.svelte';

	$: value = 2;
	$: KQL_Followers.query({ variables: { first: value } });
</script>

<div>
	<h3>Followers</h3>
	Next:
	<input type="number" bind:value />
	{$KQL_Followers.isFetching ? 'Loading ...' : ''}

	{#each $KQL_Followers.data?.viewer.followers.edges || [] as follower}
		<div>
			<UserInfo userInfo={follower?.node} />
		</div>
	{/each}
</div>
