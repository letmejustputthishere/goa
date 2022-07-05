<script context="module" lang="ts">
	import { houdiniClient } from '$graphql/client';

	houdiniClient.init();
</script>

<script>
	import '../app.css';
</script>

<slot />
