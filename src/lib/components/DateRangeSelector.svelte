<script lang="ts">
	import moment from 'moment';

	export let selected;

	let dates = [
		{
			label: '3 months',
			value: moment().subtract(3, 'months').toDate()
		},
		{
			label: '6 months',
			value: moment().subtract(6, 'months').toDate()
		}
	];
</script>

<select bind:value={selected} class="select select-bordered">
	{#each dates as date}
		<option value={date.value}>{date.label}</option>
	{/each}
</select>
