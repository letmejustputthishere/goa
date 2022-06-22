<script lang="ts">
	export let selected;
</script>

<select bind:value={selected} class="select select-bordered">
	<option selected value="3">3 months</option>
	<option value="6">6 months</option>
</select>
