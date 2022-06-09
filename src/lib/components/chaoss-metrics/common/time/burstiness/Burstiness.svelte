<script lang="ts">
	import { KQL_Burstiness } from '$lib/graphql/_kitql/graphqlStores';
	import { RequestStatus } from '@kitql/client';

	KQL_Burstiness.query({ variables: { name: 'cpython', owner: 'python' } });
</script>

{#if $KQL_Burstiness.isFetching}
	Loading
{:else if $KQL_Burstiness.errors}
	{JSON.stringify($KQL_Burstiness.errors)}
{:else}
	{@const data = $KQL_Burstiness.data}
	<div class="text-2xl text-red-500 text-center">issues</div>
	{data?.repository.issues.totalCount}
	{JSON.stringify(data?.repository.issues.pageInfo)}
	{#each data?.repository.issues.edges || [] as issue}
		<div class="my-4 border-2 border-red-400 flex flex-col">
			<div>{issue.node.title}</div>
			<div>created: {issue.node.createdAt}</div>
			<div>published: {issue.node.publishedAt}</div>
			<div>closed: {issue.node.closedAt}</div>
			<div>path: <a href={'https://github.com' + issue.node.resourcePath}>link</a></div>
		</div>
	{/each}
	<div class="text-2xl text-red-500 text-center">pull requests</div>
	{#each data.repository.pullRequests.edges || [] as pr}
		<div>
			{pr.node.createdAt}
			{pr.node.closedAt}
		</div>
	{/each}
	<div class="text-2xl text-red-500 text-center">comments</div>
	{#each data.repository.commitComments.edges || [] as comment}
		<div class="border-black border-2 my-2">
			<div>{comment.node.body}</div>
			<div>{comment.node.author.login}</div>
			<div>{comment.node.publishedAt}</div>
			<div>{comment.node.resourcePath}</div>
		</div>
	{/each}
	<div class="text-2xl text-red-500 text-center">discussions</div>
	{#each data.repository.discussions.edges || [] as discussion}
		<div class="border-black border-2 my-2">
			<div>{discussion.node.publishedAt}</div>
			<div>{discussion.node.reactions.edges}</div>
		</div>
	{/each}
{/if}
