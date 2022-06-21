<script lang="ts">
	import Forks from '$lib/components/chaoss-metrics/common/contributions/forks/Forks.svelte';
	import Languages from '$lib/components/chaoss-metrics/common/contributions/languages/Languages.svelte';
	import Close from '$lib/components/chaoss-metrics/common/time/time-to-close/Close.svelte';
	import GitHubUrlInput from '$lib/components/GitHubUrlInput.svelte';
</script>

<div class="flex flex-col justify-center m-6">
	<GitHubUrlInput />
	<Forks />
	<Languages />
	<Close />
</div>
