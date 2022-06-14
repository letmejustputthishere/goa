<script lang="ts">
	import FirstResponse from '$lib/components/chaoss-metrics/common/time/time-to-first-response/FirstResponse.svelte';
	import Vega from '$lib/components/Vega.svelte';
	import { KQL_FirstResponse } from '$lib/graphql/_kitql/graphqlStores';

	import KitQlInfo from '@kitql/all-in/KitQLInfo.svelte';

	let data = [
		{ a: 'A', b: 28 },
		{ a: 'B', b: 55 },
		{ a: 'C', b: 43 },
		{ a: 'D', b: 91 },
		{ a: 'E', b: 81 },
		{ a: 'F', b: 53 },
		{ a: 'G', b: 19 },
		{ a: 'H', b: 99 },
		{ a: 'I', b: 91 }
	];
</script>

<FirstResponse />
<Vega {data} />

<KitQlInfo store={KQL_FirstResponse} />
