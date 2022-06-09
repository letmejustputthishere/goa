<script>
	// @ts-nocheck

	import { onMount } from 'svelte';

	onMount(() => {
		const options = {
			config: {
				// vega-lite default configuration
			},
			init: (view) => {
				// initialize tooltip handler
				view.tooltip(new vegaTooltip.Handler().call);
				// enable horizontal scrolling for large plots
				if (view.container()) view.container().style['overflow-x'] = 'auto';
			},
			view: {
				// view constructor options
				loader: vega.loader({
					baseURL: 'https://cdn.jsdelivr.net/npm/vega-datasets@1/'
				}),
				renderer: 'canvas'
			}
		};

		vl.register(vega, vegaLite, options);

		vl.markPoint({ tooltip: true })
			.data([
				{ a: 'A', b: 28 },
				{ a: 'B', b: 55 },
				{ a: 'C', b: 43 },
				{ a: 'D', b: 91 },
				{ a: 'E', b: 81 },
				{ a: 'F', b: 53 },
				{ a: 'G', b: 19 },
				{ a: 'H', b: 99 },
				{ a: 'I', b: 91 }
			])
			.encode(vl.x().fieldQ('b'), vl.y().fieldN('a'), vl.tooltip([vl.fieldQ('b'), vl.fieldN('a')]))
			.render()
			.then((chart) => {
				document.getElementById('chart').appendChild(chart);
			});
	});
</script>

<div id="chart" />
