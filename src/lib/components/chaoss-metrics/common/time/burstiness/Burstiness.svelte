<script lang="ts">
	import BurstinessDiscussions from './BurstinessDiscussions.svelte';
	import BurstinessIssues from './BurstinessIssues.svelte';
	import BurstinessPRs from './BurstinessPRs.svelte';

	export let repo, owner, date;
</script>

<BurstinessDiscussions {repo} {owner} {date} />
<BurstinessPRs {repo} {owner} {date} />
<BurstinessIssues {repo} {owner} {date} />
