<script lang="ts">
	import * as vega from 'vega';
	import * as vegaLite from 'vega-lite';
	import { Handler } from 'vega-tooltip';
	import * as vl from 'vega-lite-api';

	export let data: { [key: string]: string | number }[];
	export let viz;

	function createChart(node: HTMLDivElement) {
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

		viz
			.data(data)
			.width(node.clientWidth)
			.height(node.clientHeight)
			.autosize({ type: 'fit', contains: 'padding', resize: true })
			// .background('grey')
			.render()
			.then((chart) => {
				node.appendChild(chart);
			});
	}
</script>

<div use:createChart class="mx-5 min-h-[200px]" />
