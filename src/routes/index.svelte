<script lang="ts">
	import FirstResponse from '$lib/components/visualization/common/time/time-to-first-response/FirstResponse.svelte';
	import { KQL_FirstResponse } from '$lib/graphql/_kitql/graphqlStores';

	import KitQlInfo from '@kitql/all-in/KitQLInfo.svelte';
</script>

<FirstResponse />

<KitQlInfo store={KQL_FirstResponse} />
