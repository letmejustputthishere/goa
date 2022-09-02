<script lang="ts">
	import Vega from '$lib/components/Vega.svelte';

	export let store;
	export let viz;
	export let loading;
	export let transformResponse;
	export let title;
	export let date;
</script>

{#if $store.errors}
	<div class="justify-center flex items-center">
		{JSON.stringify($store.errors[0].message)}
	</div>
{:else if loading || $store.isFetching}
	<div class="flex items-center justify-center mt-6">
		<progress class="progress w-56" />
	</div>
{:else if $store.data && !loading}
	<Vega {title} data={transformResponse($store.data, date)} {viz} />
{/if}
