<script lang="ts">
	import BurstinessDiscussions from './BurstinessDiscussions.svelte';
	import BurstinessIssues from './BurstinessIssues.svelte';
	import BurstinessPRs from './BurstinessPRs.svelte';

	export let repo, owner;
</script>

<BurstinessDiscussions {repo} {owner} />
<BurstinessPRs {repo} {owner} />
<BurstinessIssues {repo} {owner} />
