<script lang="ts">
	import { onMount } from 'svelte';
	import * as vega from 'vega';
	import * as vegaLite from 'vega-lite';
	import { Handler } from 'vega-tooltip';
	import * as vl from 'vega-lite-api';

	export let data: { [key: string]: string | number };

	onMount(() => {
		const options = {
			config: {
				// vega-lite default configuration
			},
			init: (view) => {
				// initialize tooltip handler
				view.tooltip(new Handler().call);
				// enable horizontal scrolling for large plots
				if (view.container()) view.container().style['overflow-x'] = 'auto';
			},
			view: {
				// view constructor options
				loader: vega.loader({
					baseURL: 'https://cdn.jsdelivr.net/npm/vega-datasets@1/'
				}),
				renderer: 'svg'
			}
		};

		vl.register(vega, vegaLite, options);

		vl.markLine({ tooltip: true })
			.data(data)
			.encode(vl.x().fieldQ('b'), vl.y().fieldN('a'), vl.tooltip([vl.fieldQ('b'), vl.fieldN('a')]))
			.render()
			.then((chart) => {
				document.getElementById('chart').appendChild(chart);
			});
	});
</script>

<div id="chart" />
