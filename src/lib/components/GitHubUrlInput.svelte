<script lang="ts">
	let input;

	export let source;

	function extractRepoAndOwner(url) {
		const match = url.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)\/([^/]+)(?:\/.*)?$/);
		if (match) {
			return {
				owner: match[1],
				repo: match[2]
			};
		}
		return null;
	}
</script>

<div class="flex justify-center gap-4">
	<input bind:value={input} class="input input-bordered" placeholder="enter github url" />

	<button class="btn" on:click={() => (source = extractRepoAndOwner(input))}> get data </button>
</div>
