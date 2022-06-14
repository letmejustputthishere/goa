<script lang="ts">
	import { onMount } from 'svelte';
	import * as vega from 'vega';
	import * as vegaLite from 'vega-lite';
	import { Handler } from 'vega-tooltip';
	import * as vl from 'vega-lite-api';

	export let data: { [key: string]: string | number }[];

	function createChart(node) {
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

		vl.markPoint({
			fill: '#3e3c38',
			stroke: false,
			size: 100,
			opacity: 0.9
		})
			.data(data)
			.encode(
				vl.y().fieldN('a'), // add nominal data from data key 'a' to y-axis
				vl.x().fieldQ('b'), // add qunantitative data from data key 'b' to x-axis
				vl.tooltip([vl.fieldQ('b'), vl.fieldN('a')])
			)
			.render()
			.then((chart) => {
				node.appendChild(chart);
			});
	}
</script>

<div use:createChart class="w-full h-full" />
