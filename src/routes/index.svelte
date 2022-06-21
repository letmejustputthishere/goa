<script lang="ts">
	import Forks from '$lib/components/chaoss-metrics/common/contributions/forks/Forks.svelte';
	import Languages from '$lib/components/chaoss-metrics/common/contributions/languages/Languages.svelte';
	import Close from '$lib/components/chaoss-metrics/common/time/time-to-close/Close.svelte';
	import GitHubUrlInput from '$lib/components/GitHubUrlInput.svelte';

	let input;
</script>

<div class="flex flex-col justify-center m-6">
	<GitHubUrlInput bind:input />
	<Forks />
	<Languages />
	<Close />
</div>
