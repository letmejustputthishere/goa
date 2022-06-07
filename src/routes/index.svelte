<script lang="ts">
	import KitQlInfo from '@kitql/all-in/KitQLInfo.svelte';
	import Burstiness from '$lib/components/visualization/common/time/Burstiness/Burstiness.svelte';
	import { KQL_Burstiness } from '$lib/graphql/_kitql/graphqlStores';
</script>

<Burstiness />
<KitQlInfo store={KQL_Burstiness} />
