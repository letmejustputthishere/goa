<script context="module" lang="ts">
	export async function load({ fetch, url, params, session, stuff }: LoadEvent) {
		await KQL_Me.queryLoad({ fetch });
		return {};
	}
</script>

<script lang="ts">
	import Followers from '$lib/components/visualization/followers/Followers.svelte';

	import UserInfo from '$lib/components/visualization/user/UserInfo.svelte';
	import { KQL_Me } from '$lib/graphql/_kitql/graphqlStores';
	import { KitQLInfo } from '@kitql/all-in';
	import type { LoadEvent } from '@sveltejs/kit';
</script>

<UserInfo userInfo={$KQL_Me.data?.viewer} />
<Followers />

<KitQLInfo store={KQL_Me} />
