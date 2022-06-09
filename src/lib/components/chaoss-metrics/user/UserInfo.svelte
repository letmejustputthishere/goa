<script lang="ts">
	import type { UserInfoFragment } from '$lib/graphql/_kitql/graphqlTypes';

	export let userInfo: UserInfoFragment | undefined | null;
</script>

<img src={userInfo?.avatarUrl} alt="" srcset="" />
{userInfo?.login}
{userInfo?.name}
{userInfo?.followers.totalCount}
