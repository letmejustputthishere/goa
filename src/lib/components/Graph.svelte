<script lang="ts">
	export let store;
	export let loading;
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
	<slot />
{/if}
