<script lang="ts">
	import FirstResponse from '$lib/components/chaoss-metrics/common/time/time-to-first-response/FirstResponse.svelte';
	import Vega from '$lib/components/Vega.svelte';
	import { KQL_FirstResponse } from '$lib/graphql/_kitql/graphqlStores';

	import KitQlInfo from '@kitql/all-in/KitQLInfo.svelte';
</script>

<FirstResponse />
<Vega />

<KitQlInfo store={KQL_FirstResponse} />
